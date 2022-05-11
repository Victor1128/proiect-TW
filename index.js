const express= require("express");
const fs=require("fs");
const { dirname } = require("path");
const sharp=require("sharp");
const {Client}=require("pg");
const sass=require("sass");
const ejs = require("ejs");
const formidable= require('formidable');
const crypto= require('crypto');
const session= require('express-session');
const nodemailer = require('nodemailer');
const helmet = require('helmet');


const obGlobal={
    emailServer:"victorbadulescu11@gmail.com",
    port:8080,
    sirAlphaNum:"",
    protocol:null,
    numeDomeniu:null
};

if(process.env.SITE_ONLINE){
    obGlobal.protocol="https://"
    obGlobal.numeDomeniu="morning-meadow-31540.herokuapp.com"
    var client=new Client(
        {user:"ixaooytijodbkq", 
        password:"1afa79d5a119fbf94996873db4961a28e08691d43cb084a4b0dd11fea1fe8010",
        database:"d9pie08spiu4te", host:"ec2-35-168-194-15.compute-1.amazonaws.com", 
        port:5432, 
        ssl: {	rejectUnauthorized: false}
        }
);
}
else{
    obGlobal.protocol="http://"
    obGlobal.numeDomeniu="localhost:8080"
    var client=new Client(
        {
            user:"victor", 
            password:"victor", 
            database:"proiect", 
            host:"localhost", 
            port:5432
        });
    }

//-----------------------------mail

v_intervale=[[48,57],[65,90],[97,122]]
for(let interval of v_intervale){
    for(let i=interval[0]; i<=interval[1]; i++)
        obGlobal.sirAlphaNum+=String.fromCharCode(i)
}

console.log(obGlobal.sirAlphaNum);

function genereazaToken(n){
    let token=""
    for (let i=0;i<n; i++){
        token+=obGlobal.sirAlphaNum[Math.floor(Math.random()*obGlobal.sirAlphaNum.length)]
    }
    return token;
}

async function trimiteMail(email, subiect, mesajText, mesajHtml, atasamente=[]){
    var transp= nodemailer.createTransport({
        service: "gmail",
        secure: false,
        auth:{//date login 
            user:obGlobal.emailServer,
            pass:"fwkbdgklppiccydt"
        },
        tls:{
            rejectUnauthorized:false
        }
    });
    //genereaza html
    await transp.sendMail({
        from:obGlobal.emailServer,
        to:email,
        subject:subiect,//"Te-ai inregistrat cu succes",
        text:mesajText, //"Username-ul tau este "+username
        html: mesajHtml,// `<h1>Salut!</h1><p style='color:blue'>Username-ul tau este ${username}.</p> <p><a href='http://${numeDomeniu}/cod/${username}/${token}'>Click aici pentru confirmare</a></p>`,
        attachments: atasamente
    })
    console.log("trimis mail");
}

var nrAleator=Math.ceil(Math.random()*5)*3;
// var nrAleator=3;

client.connect();
app= express();

app.use(session({
    secret: 'abcdefg',
    resave: true,
    saveUninitialized: false
}));

app.set("view engine","ejs");

app.use("/Resurse", express.static(__dirname+"/Resurse"));

function getIp(req){//pentru Heroku
    var ip = req.headers["x-forwarded-for"];//ip-ul userului pentru care este forwardat mesajul
    if (ip){
        let vect=ip.split(",");
        return vect[vect.length-1];
    }
    else if (req.ip){
        return req.ip;
    }
    else{
     return req.connection.remoteAddress;
    }
}

function stergeAccesari(){
    queryDelete = `delete from accesari where now()-data_accesare >= interval '5 minutes'`;
    client.query(queryDelete, function (err, rez){
        if(err) console.log(err);
    });
}

setInterval(stergeAccesari, 5*60*1000);

app.use("/*", function(req, res, next){
    res.locals.utilizator = req.session.utilizator;
    client.query("select * from unnest(enum_range(null::categ_jocuri))", function(err, rezMeniu){
        res.locals.optiuniMeniu = rezMeniu.rows;
        next();
    });
})

app.get("/*", function(req, res, next){
    let idUtiliz = req.session.utilizator? req.session.utilizator.id : null;
    let queryInsert = `insert into accesari(ip, user_id, pagina)
    values (${getIp(req)}, ${idUtiliz}, ${req.url})`;
    client.query(queryInsert, function(err, rezInserare){
        if(err) console.log(err);
    });
    next();
})


console.log("Director proiect:",__dirname);

app.get(["/", "/index", "/home", "/acasa"], function(req, res){
    //res.sendFile(__dirname+"/index1.html");
    // client.query("select * from test", function(err,rez){
    //     if(!err)
        // res.render("pagini/index", {ip:req.ip, imagini:obImagini.imagini});
    // })
    queryAccesari = `select nume, username from utilizatori where id in (select distinct user_id from accesari where now()-data_accesare < interval '5 minutes')`
    client.query(queryAccesari, function(err, rezAccesari){
        //mai ai putin de vazut din finalul laboratorului
    })

    var sirScss=fs.readFileSync(__dirname+"/Resurse/Stil/galerie_animata.scss").toString("utf8");
    rezScss=ejs.render(sirScss,{nr:nrAleator});
    console.log(rezScss);
    var caleScss=__dirname+"/Resurse/temp/galerie_animata.scss";
    fs.writeFileSync(caleScss,rezScss);
    try {
        rezCompilare=sass.compile(caleScss,{sourceMap:true});
        var caleCss=__dirname+"/Resurse/temp/galerie_animata.css";
        fs.writeFileSync(caleCss,rezCompilare.css);
        // res.setHeader("Content-Type","text/css");
        // res.sendFile(caleCss);
    }
    catch (err){  
        console.log(err);
        res.send("Eroare");
    }
    res.render("pagini/index", {ip:getIp(req), imagini:obImagini.imagini, nrImag:nrAleator});
})

app.get("/produse", function(req, res){
    var cond_where = req.query.categorie ? ` categorie= '${req.query.categorie}'` : " 1=1"

    client.query("select * from unnest(enum_range(null::tipuri_jocuri))", function(er, rezCateg){
        client.query("select * from jocuri where"+cond_where, function(err, rezQuerry){
            client.query("select * from unnest(enum_range(null::caracteristici_jocuri))", function(err, rezCar){
                client.query("select * from unnest(enum_range(null::producatori))",function(err, rezProd){
                    console.log("Am ajuns aici "+rezCar);
                    res.render("pagini/produse", {produse:rezQuerry.rows, optiuni:rezCateg.rows, caract:rezCar.rows, prod:rezProd.rows});
                });
            });
        });
    });
        
});

app.get("/produs/:id", function(req, res){
    console.log("PRODUS:", req.url);
    client.query(`select * from jocuri where id= ${req.params.id}`, function(err, rezQuerry){
        console.log("Am ajuns aici 2"+rezQuerry);
        res.render("pagini/produs", {prod:rezQuerry.rows[0]});
    })
})

app.get("*/rest",function(req, res){
    /* TO DO
    citim in sirScss continutul fisierului galerie_animata.scss
    setam culoare aleatoare din vectorul culori=["navy","black","purple","grey"]
    in variabila rezScss compilam codul ejs din sirScss
    scriu rezScss in galerie-animata.scss din folderul temp 
    compilez scss cu sourceMap:true
    scriu rezultatul in "temp/galerie-animata.css"
    setez headerul Content-Type
    trimit fisierul css
    */
    var sirScss=fs.readFileSync(__dirname+"/Resurse/Stil/galerie_animata.scss").toString("utf8");
    rezScss=ejs.render(sirScss,{nr:nrAleator});
    console.log(rezScss);
    var caleScss=__dirname+"/Resurse/temp/galerie_animata.scss";
    fs.writeFileSync(caleScss,rezScss);
    try {
        rezCompilare=sass.compile(caleScss,{sourceMap:true});
        var caleCss=__dirname+"/Resurse/temp/galerie_animata.css";
        fs.writeFileSync(caleCss,rezCompilare.css);
        res.setHeader("Content-Type","text/css");
        res.sendFile(caleCss);
    }
    catch (err){  
        console.log(err);
        res.send("Eroare");
    }
});


app.get("/galerie", function(req, res){
    res.render("pagini/galStatica", {imagini:obImagini.imagini});
})

app.get("/eroare", function(req, res){
    randeazaEroare(res,1, "Titlu schimbat");
});

//-----------------------------utilizatori
parolaServer = "tehniciweb";
app.post("/inreg", function(req, res){
    var formular = new formidable.IncomingForm();
    formular.parse(req, function(err, campuriText, campuriFisier){
        console.log(campuriText);
        var eroare="";
        if(!campuriText.username)
            eroare+="Username necompletat.<br>";
        else{
            queryUtilizator = `select nume from utilizatori where username = '${campuriText.username}'`;
            client.query(queryUtilizator, function(err, rezUtilizatori){
                if(rezUtilizatori.rows.length){
                    eroare+="Username-ul este deja folosit.<br>";
                }
            })
        }
        if(!campuriText.email)
            eroare+="Email necompletat.<br>";
        else if(!campuriText.email.match(new RegExp("^[A-Za-z0-9_-]+@[a-z0-9]+.[a-z]{2,3}$")))
            eroare+="Formatul email-ului nu este valid.<br>";
        if(campuriText.parola!=campuriText.rparola) eroare+="Parolele nu corespund.<br>";
        if(!campuriText.nume) eroare+="Nume necompletat.<br>";
        if(!campuriText.prenume) eroare+="Prenume necompletat.<br>";

        if(!eroare){
            var parolaCriptata = crypto.scryptSync(campuriText.parola, parolaServer, 64).toString('hex');
            let token = genereazaToken(100);
            var comandaInserare = `insert into utilizatori (username, nume, prenume, parola, email, culoare_chat, cod, blocat) values ('${campuriText.username}','${campuriText.nume}', '${campuriText.prenume}', '${parolaCriptata}', '${campuriText.email}', '${campuriText.culoare_chat}', '${token}', false )`;
            client.query(comandaInserare, function(err, rezInserare){
                if(err) 
                res.render("pagini/inregistrare", {err:"Eroare baza de date"});
                else  {
                    res.render("pagini/inregistrare", {raspuns:"Datele au fost introduse"});
                    let linkConfirmare=`${obGlobal.protocol}${obGlobal.numeDomeniu}/cod/${campuriText.username}/${token}`;
                            trimiteMail(campuriText.email, "Te-ai inregistrat", "text",`<h1>Salut!</h1>
                                            <p style='color:blue'>Username-ul tau este ${campuriText.username}.</p>
                                            <a href='${linkConfirmare}'>Link confirmare</a>`);
                    // trimiteMail(campuriText.email, "Inregistrare reușită!","Mesajul text", `<h1>Salut!</h1><p style='color:blue'>Username-ul tau este ${campuriText.username}.</p>`)
                }
            });
        
        
        }
        else{
            res.render("pagini/inregistrare", {err:eroare});
        }

    });

});

app.get("/cod/:username/:token",function(req, res){
    var comandaUpdate=`update utilizatori set confirmat_mail=true where username='${req.params.username}' and cod='${req.params.token}'`;
    client.query(comandaUpdate, function(err, rezUpdate){
        if(err){
            console.log(err);
            randeazaEroare(res, 2);
        }
        else{
            if(rezUpdate.rowCount==1){
                res.render("pagini/confirmare");
            }
            else{
                randeazaEroare(res,-1, "Mail neconfirmat", "Incercati iar");
            }
        }
    })

})

app.post("/login", function(req, res){
    var formular = new formidable.IncomingForm();
    formular.parse(req, function(err, campuriText, campuriFisier){
        console.log(campuriText);
        var parolaCriptata = crypto.scryptSync(campuriText.parola, parolaServer, 64).toString('hex'); 
        // var querySelect = `select * from utilizatori where username = '${campuriText.username}' and parola = '${parolaCriptata}'`;
        var querySelect = `select * from utilizatori where username = $1::text and parola = $2::text and confirmat_mail=true and blocat=false`;
        client.query(querySelect,[campuriText.username, parolaCriptata], function(err, rezSelect){
            if(err) console.log("naspa "+err);
            else{
                if(rezSelect.rowCount==1){
                    req.session.utilizator = {
                        nume: rezSelect.rows[0].nume,
                        prenume: rezSelect.rows[0].prenume,
                        username: rezSelect.rows[0].username,
                        email: rezSelect.rows[0].email,
                        culoare_chat: rezSelect.rows[0].culoare_chat,
                        rol: rezSelect.rows[0].rol,
                        id: rezSelect.rows[0].id
                    }
                    res.redirect('/index');
                } 
                else randeazaEroare(res, -1, "Login esuat", "User sau parola gresita sau nu a fost confirmat mailul... sau esti blocat :(", null);
            }
        })
    })
}) 

app.get("/logout", function(req, res){
    req.session.destroy();
    res.locals.utilizator=null;
    res.render("pagini/logout");
})

app.get("/useri", function(req, res){
    if(req.session.utilizator && req.session.utilizator.rol=='admin')
        {client.query("select * from utilizatori where rol!='admin'", function(er, rezUseri){
            res.render("pagini/useri", {useri:rezUseri.rows});
        });
    }
    else randeazaEroare(res,403);  
});

app.post('/sterge_utiliz', function(req, res){
    var formular = new formidable.IncomingForm();
    formular.parse(req, function(err, campuriText, campuriFisier){
        query = `delete from utilizatori where id = ${campuriText.id_utiliz}`;
        client.query(query, function(err, rezQuerry){
            res.redirect('/useri');
        })
    });
});

app.post('/blocheaza_utiliz', function(req, res){
    var formular = new formidable.IncomingForm();
    formular.parse(req, function(err, campuriText, campuriFisier){
        client.query(`select blocat from utilizatori where id = ${campuriText.id_utiliz}`, function(err, rezQuerry){
            console.log("\n\n\n\n\n\nAsta e rezultatul la blocare!!!");
            console.log(rezQuerry.rows[0].blocat);
            // res.send(rezQuerry);
            if(!rezQuerry.rows[0].blocat)
            {query = `update utilizatori set blocat=true where id = ${campuriText.id_utiliz}`;
            trimiteMail(campuriText.mail_utiliz, "Ai fost blocat!", `N-ai fost cuminte, ${campuriText.prenume_utiliz} ${campuriText.nume_utiliz}, așa că te-am blocat`, `<h1 style='color:red'>N-ai fost cuminte, ${campuriText.prenume_utiliz} ${campuriText.nume_utiliz}, așa că te-am blocat</h1>`);
            client.query(query, function(err, rezQuerry){
                res.redirect('/useri');
            })
        }else{
            query = `update utilizatori set blocat=false where id = ${campuriText.id_utiliz}`;
            trimiteMail(campuriText.mail_utiliz, "Ai fost deblocat!", `Ai fost cuminte, ${campuriText.prenume_utiliz} ${campuriText.nume_utiliz}, așa că te-am deblocat`, `<h1 style='color:green'>Ai fost cuminte, ${campuriText.prenume_utiliz} ${campuriText.nume_utiliz}, așa că te-am deblocat</h1>`);
            client.query(query, function(err, rezQuerry){
                res.redirect('/useri');
            })
        }
        })
    });
});

// app.post('/profil', function(req, res){
//     var formular = new formidable.IncomingForm();
//     formular.parse(req, function(err, campuriText, campuriFisier){
//         client.query(`select * from utilizatori where username = ${campuriText.username}`, function(err, rezQuerry){
//             if(rezQuerry.rowCount == 1){
                
//             }
//         })
//     });
// })

//TODO: trebuie completat post-ul de mai sus a.i. sa verifice daca utilizatorul a bagat parola buna si daca da sa ii fac update-urile





app.get("/*.ejs", function(req, res){
    //res.sendFile(__dirname+"/index1.html");
    // res.status(403).render("pagini/403");
    randeazaEroare(res, 403);
})
app.get("/*", function(req, res){
    res.render("pagini"+req.url, function(err, rezRender){
        if (err){
            if(err.message.includes("Failed to lookup view")){
                console.log(err);
                //res.status(404).render("pagini/404");
                randeazaEroare(res, 404);
            }
            else{
                
                res.render("pagini/eroare_generala");
            }
        }
        else{
            console.log(rezRender);
            res.send(rezRender);
        }
    });

    res.end();
})

function creeazaImagini(){
    var buf=fs.readFileSync(__dirname+"/Resurse/json/galerie.json").toString("utf8");
    obImagini=JSON.parse(buf);

    for(let imag of obImagini.imagini){
        let nume_imag, extensie;
        [nume_imag, extensie] = imag.cale_imagine.split(".");
        let dim_mic=150;
        let dim_mediu=300;

        imag.mic=`${obImagini.cale_galerie}/mic/${nume_imag}-${dim_mic}.webp`;
        imag.mediu=`${obImagini.cale_galerie}/mediu/${nume_imag}-${dim_mediu}.png`;
        imag.mare=`${obImagini.cale_galerie}/${imag.cale_imagine}`;

        if(!fs.existsSync(imag.mic)){
            sharp(__dirname+"/"+imag.mare).resize(dim_mic).toFile(__dirname+"/"+imag.mic);
        }
        if (!fs.existsSync(imag.mediu))
            sharp(__dirname+"/"+imag.mare).resize(dim_mediu).toFile(__dirname+"/"+imag.mediu);
        // console.log(imag);
    }
}

creeazaImagini();






function creeazaErori(){
    let buf=fs.readFileSync(__dirname+"/Resurse/json/erori.json").toString("utf8");
    obErori=JSON.parse(buf); //global
}

creeazaErori();

function randeazaEroare(res, identificator, titlu, text, imagine){
    var eroare=obErori.erori.find(function(elem){
        return elem.identificator==identificator;
    });
    titlu=titlu || (eroare && eroare.titlu) || "N-avem chiar niciun titlu de eroare";
    text=text||(eroare&&eroare.text);
    imagine=imagine||(eroare && (obErori.cale_baza+"/"+eroare.imagine))||"Resurse/images/erori/interzis.png";
    if(eroare && eroare.status)
        res.status(eroare.identificator).render("pagini/eroare_generala", {titlu:titlu, text:text, imagine:imagine});
    else res.render("pagini/eroare_generala", {titlu:titlu, text:text, imagine:imagine});
}

// app.listen(8080);
var s_port=process.env.PORT || 8080;
app.listen(s_port)

console.log("A pornit");