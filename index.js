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
const path = require('path');
const { ClientRequest } = require("http");
const { query } = require("express");


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

v_intervale=[65,80];
for(let i=v_intervale[0]; i<=v_intervale[1]; i++)
    obGlobal.sirAlphaNum+=String.fromCharCode(i);


console.log(obGlobal.sirAlphaNum);

function genereazaToken2(n){
    let token=""
    for (let i=0;i<n; i++){
        token+=obGlobal.sirAlphaNum[Math.floor(Math.random()*obGlobal.sirAlphaNum.length)]
    }
    return token;
}

function genereazaToken1(n){
    return Math.floor(Math.random()*n);
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
app.use("/poze_uploadate", express.static(__dirname+"/poze_uploadate"));

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

var ipuri_active={};


app.all("/*",function(req,res,next){
    let ipReq=getIp(req);
    let ip_gasit=ipuri_active[ipReq+"|"+req.url];
    timp_curent=new Date();
    if(ip_gasit){
    
        if( (timp_curent-ip_gasit.data)< 5*1000) {//diferenta e in milisecunde; verific daca ultima accesare a fost pana in 10 secunde
            if (ip_gasit.nr>10){//mai mult de 10 cereri 
                res.send("<h1>Prea multe cereri intr-un interval scurt. Ia te rog sa fii cuminte, da?!</h1>");
                ip_gasit.data=timp_curent
                return;
            }
            else{  
                
                ip_gasit.data=timp_curent;
                ip_gasit.nr++;
            }
        }
        else{
            //console.log("Resetez: ", req.ip+"|"+req.url, timp_curent-ip_gasit.data)
            ip_gasit.data=timp_curent;
            ip_gasit.nr=1;//a trecut suficient timp de la ultima cerere; resetez
        }
    }
    else{
        ipuri_active[ipReq+"|"+req.url]={nr:1, data:timp_curent};
        //console.log("am adaugat ", req.ip+"|"+req.url);
        //console.log(ipuri_active);        

    }
    let comanda_param= `insert into accesari(ip, user_id, pagina) values ($1::text, $2,  $3::text)`;
    //console.log(comanda);
    if (ipReq){
        var id_utiliz=req.session.utilizator?req.session.utilizator.id:null;
        //console.log("id_utiliz", id_utiliz);
        client.query(comanda_param, [ipReq, id_utiliz, req.url], function(err, rez){
            if(err) console.log(err);
        });
    }
    next();   
}); 




function stergeAccesariVechi(){
    var queryDelete="delete from accesari where now()-data_accesare >= interval '1440 minutes' ";
    client.query(queryDelete, function(err, rezQuery){
        console.log(err);
    });
}

stergeAccesariVechi();
setInterval(stergeAccesariVechi, 1*60*1000)

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
    queryAccesari = `select distinct username, email, min(acc.data_accesare) from utilizatori as u
                        inner join accesari as acc on acc.user_id = u.id where now() - data_accesare < interval '10 minutes' and rol='admin'
                        group by username, email
                        order by min(acc.data_accesare), username`
    useriOnline=[];
    client.query(queryAccesari, function(err, rezAccesari){
        if(err) console.log(err);
        else 
            useriOnline = rezAccesari.rows;
        res.render("pagini/index", {ip:getIp(req), imagini:obImagini.imagini, nrImag:nrAleator, useriOnline:useriOnline});
    })
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

app.get("/administrareProduse", function(req, res){
    if(req.session.utilizator && req.session.utilizator.rol=='admin')
    {
        var query = 'select * from jocuri';
        client.query(query, function(err, rezQuerry){
            if(err) randeazaEroare(res, 403, 'Eroare baza de date', err);
            res.render('pagini/administrareProduse', {produse:rezQuerry.rows})
        })
    }
    else  randeazaEroare(res, 403);
})

app.post('/sterge-prod', function(req, res){
    var formular = new formidable.IncomingForm();
    formular.parse(req, function(err, campuriText, campuriFisier){
        console.log(`-------------------IN PARSE`);
        var query = `delete from jocuri where id = ${campuriText.id}`;
        client.query(query, function(err, rezQuerry){
            if(err) res.redirect('/administrareProduse');
            res.redirect('/administrareProduse');
        })
    });
})

app.post('/modifica-joc-intermediar', function(req, res){
    var formular = new formidable.IncomingForm();
    formular.parse(req, function(err, campuriText, campuriFisier){
        var query = `select * from jocuri where id = ${campuriText.id}`;
        client.query(query, function(err, rezQuerry){
            if(err) res.render('pagini/modifica-joc', {eroare: `eroare la baza de date: ${err}`});
            if(rezQuerry.rowCount!=1) res.render('pagini/modifica-joc', {eroare: `eroare la interogare. Jocuri gasire: ${rezQuerry.rowCount}`});
            client.query("select * from unnest(enum_range(null::tipuri_jocuri))", function(er, rezTip){
                client.query("select * from unnest(enum_range(null::categ_jocuri))", function(er, rezCateg){
                    client.query("select * from unnest(enum_range(null::caracteristici_jocuri))", function(er, rezCarac){
                        res.render('pagini/modifica-joc', {joc:rezQuerry.rows[0], tipuri:rezTip.rows, caracteristici:rezCarac.rows, categorii:rezCateg.rows, dirname:__dirname});
                    });
                });
            });
        })
    });
})

app.get('/modifica-joc', function(req, res){
    if(req.session.utilizator && req.session.rol == 'admin');
    else randeazaEroare(res, 403);
})

app.post('/modificat', function(req, res){
    var formular = new formidable.IncomingForm();
    let numeJoc;
    let caleUtiliz = null;
    formular.on("field", function(nume,val){  // 1 
            console.log(`--- ${nume}=${val}`);
            if(nume=="nume")
                numeJoc=val;
        });
        formular.on("fileBegin", function(nume,fisier){ //2
            caleUtiliz=path.join(__dirname,"Resurse","images", "produse", fisier.originalFilename);
            console.log(caleUtiliz);
            fisier.filepath=caleUtiliz;
            console.log(nume, fisier);
            console.log(nume, fisier.filepath);
            console.log("nu are sens");
            if(fisier.originalFilename)
                {
                    caleUtiliz = fisier.originalFilename;
                }
            else caleUtiliz = '';
        });
        formular.on("file", function(nume,fisier){//3
            console.log("file");
            console.log(nume,fisier);
        });    
        
    formular.parse(req, function(err, campuriText, campuriFisier){
        console.log(`-------------------IN PARSE`);
        console.log(caleUtiliz);
        console.log(campuriText.carac);
        console.log(campuriText.data_lansare);
            var query = `update jocuri set nume=$1::text, descriere = '${campuriText.descriere}', pret = '${campuriText.pret}', categorie = '${campuriText.categ}', scor = '${campuriText.scor}', pt_copii = '${campuriText.pt_copii}', producator = '${campuriText.producator}', tip_joc = '${campuriText.tip}'`;

            if(caleUtiliz)
                {
                    query+=`, imagine = '${caleUtiliz}'`;
                    console.log("in if");
                }
            query+=` where id = ${campuriText.id}`;
            console.log(query);
            client.query(query,[campuriText.nume], function(err, rezInserare){
                if(err) 
                {
                    res.render("pagini/administrareProduse", {mesaj:"Eroare baza de date"+err});
                    console.log('EROAREA LA BAZA DE DATE ESTE: ');
                    console.log(err);
                }
                else  {
                    res.redirect("/administrareProduse");
                }
            });

    });
    
})

app.post('/adauga-joc-intermediar', function(req, res){
    var formular = new formidable.IncomingForm();
    formular.parse(req, function(err, campuriText, campuriFisier){
            client.query("select * from unnest(enum_range(null::tipuri_jocuri))", function(er, rezTip){
                client.query("select * from unnest(enum_range(null::categ_jocuri))", function(er, rezCateg){
                    client.query("select * from unnest(enum_range(null::caracteristici_jocuri))", function(er, rezCarac){
                        res.render('pagini/adauga-joc', {tipuri:rezTip.rows, caracteristici:rezCarac.rows, categorii:rezCateg.rows});
                    });
                });
            });
    });
})
app.get('/adauga-joc', function(req, res){
    if(req.session.utilizator && req.session.utilizator.rol == 'admin');
    else randeazaEroare(res, 403);
})
app.post('/adaugat', function(req, res){
    var formular = new formidable.IncomingForm();
    let numeJoc;
    let caleUtiliz = null;
    formular.on("field", function(nume,val){  // 1 
            console.log(`--- ${nume}=${val}`);
            if(nume=="nume")
                numeJoc=val;
        });
        formular.on("fileBegin", function(nume,fisier){ //2
            caleUtiliz=path.join(__dirname,"Resurse","images", "produse", fisier.originalFilename);
            console.log(caleUtiliz);
            fisier.filepath=caleUtiliz;
            console.log(nume, fisier);
            console.log(nume, fisier.filepath);
            console.log("nu are sens");
            if(fisier.originalFilename)
                {
                    caleUtiliz = fisier.originalFilename;
                }
            else caleUtiliz = '';
        });
        formular.on("file", function(nume,fisier){//3
            console.log("file");
            console.log(nume,fisier);
        });    
        
    formular.parse(req, function(err, campuriText, campuriFisier){
        console.log(`-------------------IN PARSE`);
        console.log(caleUtiliz);
        console.log(campuriText.carac);
        console.log(campuriText.data_lansare);
        client.query(`select * from jocuri where nume = $1::text`, [campuriText.nume], function(err, rezQuerry){
            if(rezQuerry.rowCount) res.render('pagini/adauga-joc', {eroare:`Jocul cu numele ${campuriText.nume} deja exista`});
            else{
                var query = `insert into jocuri(nume, descriere, pret, categorie, scor, pt_copii, producator, tip_joc) values($1::text,  '${campuriText.descriere}',  '${campuriText.pret}', '${campuriText.categ}', '${campuriText.scor}', '${campuriText.pt_copii}', '${campuriText.producator}', '${campuriText.tip}')`;
            console.log(query);
            console.log(campuriText.carac);
            client.query(query,[campuriText.nume], function(err, rezInserare){
                if(err) 
                {
                    res.render("pagini/adauga-joc", {eroare:"Eroare baza de date"+err});
                    console.log('EROAREA LA BAZA DE DATE ESTE: ');
                    console.log(err);
                }
                else  {       
                    if(caleUtiliz)
                    {
                        client.query(`update jocuri set imagine = '${caleUtiliz}' where nume = $1::text`, [campuriText.nume], function(err, rezQuerry){
                            if(err) res.render('pagini/adauga-joc', {eroare:'a fost o problema cu adaugarea imaginii'});
                        })
                    }
                    res.redirect("/administrareProduse");
                }
            });

            }
        })
            
    });
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
    
    let caleUtiliz = null;
    formular.on("field", function(nume,val){  // 1 
            console.log(`--- ${nume}=${val}`);
            if(nume=="username")
                username=val;
        });
        formular.on("fileBegin", function(nume,fisier){ //2
            console.log(`username = ${username}`)
            console.log("fileBegin");
            console.log(__dirname);
            caleUtiliz=path.join(__dirname,"poze_uploadate",username);
            console.log(caleUtiliz);
            if(!fs.existsSync(caleUtiliz))
                    fs.mkdirSync(caleUtiliz);
            fisier.filepath=path.join(caleUtiliz,fisier.originalFilename);
            console.log(nume, fisier);
            console.log(nume, fisier.filepath);
            if(fisier.originalFilename)
                {
                    caleUtiliz = path.join('poze_uploadate', username, fisier.originalFilename);
                    caleUtiliz = '/'+caleUtiliz;
                    caleUtiliz = caleUtiliz.replaceAll('\\', '/');
                }
            else caleUtiliz = '';
        });
        formular.on("file", function(nume,fisier){//3
            console.log("file");
            console.log(nume,fisier);
        });    
        
    formular.parse(req, function(err, campuriText, campuriFisier){
        console.log(`-------------------IN PARSE`);
        console.log(caleUtiliz);
        var eroare="";
        if(!campuriText.username)
            eroare+="Username necompletat.<br>";
        else{
            queryUtilizator = `select id from utilizatori where username = '${campuriText.username}'`;
            client.query(queryUtilizator, function(err, rezUtilizatori){
                if(rezUtilizatori.rows.length){
                    eroare+="Username-ul este deja folosit.<br>"; //misterele creatiei...
                }
            })
        }
        console.log(eroare+'--------------------------------------------------')
        if(!campuriText.email || campuriText.email=='nume@example.com')
            eroare+="Email necompletat.<br>";
        else if(!campuriText.email.match(new RegExp("^[A-Za-z0-9_-]+@[a-z0-9]+.[a-z]{2,3}$")))
            eroare+="Formatul email-ului nu este valid.<br>";
        if(campuriText.parola!=campuriText.rparola) eroare+="Parolele nu corespund.<br>";
        if(!campuriText.nume) eroare+="Nume necompletat.<br>";
        if(!campuriText.prenume) eroare+="Prenume necompletat.<br>";

        
        if(!eroare){
            var parolaCriptata = crypto.scryptSync(campuriText.parola, parolaServer, 64).toString('hex');
            let token1 = genereazaToken1(10000000000);
            let token2 = campuriText.nume+'-'+genereazaToken2(70);
            var comandaInserare = `insert into utilizatori (username, nume, prenume, parola, email, culoare_chat, cod, blocat, poza) values ('${campuriText.username}','${campuriText.nume}', '${campuriText.prenume}', '${parolaCriptata}', '${campuriText.email}', '${campuriText.culoare_chat}', '${token1+token2}', false, '${caleUtiliz}' )`;
            client.query(comandaInserare, function(err, rezInserare){
                if(err) 
                {
                    res.render("pagini/inregistrare", {err:"Eroare baza de date"});
                    console.log('EROAREA LA BAZA DE DATE ESTE: ');
                    console.log(err);
                }
                else  {
                    res.render("pagini/inregistrare", {raspuns:"Datele au fost introduse"});
                    let linkConfirmare=`${obGlobal.protocol}${obGlobal.numeDomeniu}/confirmare_inreg/${token1}/${campuriText.username.split('').reverse().join('')}/${token2}`;
                            trimiteMail(campuriText.email, `Buna, ${campuriText.username}`, "Bine ai venit în comunitatea For the gamers",
                                            `<span style='background-color:lightblue; font-size:larger'>Bine ai venit </span> <span>în comunitatea For the gamers!</span>
                                            <p><a href='${linkConfirmare}'>Link confirmare</a></p>`);
                    // trimiteMail(campuriText.email, "Inregistrare reușită!","Mesajul text", `<h1>Salut!</h1><p style='color:blue'>Username-ul tau este ${campuriText.username}.</p>`)
                }
            });
        
        
        }
        else{
            res.render("pagini/inregistrare", {err:eroare});
        }

    });
    
});

app.get("/confirmare_inreg/:token1/:username/:token2",function(req, res){
    var comandaUpdate=`update utilizatori set confirmat_mail=true where username='${req.params.username.split('').reverse().join('')}' and cod='${req.params.token1+req.params.token2}'`;
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
                        id: rezSelect.rows[0].id,
                        poza: rezSelect.rows[0].poza
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
        var criptareParola=crypto.scryptSync(campuriText.parola,parolaServer, 64).toString('hex'); 
        query = `delete from utilizatori where username = '${campuriText.username}' and parola = '${criptareParola}'`;
        client.query(query, function(err, rezQuerry){
            if(err) res.render('pagini/profil', {mesaj:"Eroare la baza de date " + err});
            else{
                if (rezQuerry.rowCount==0){
                    res.render("pagini/profil",{mesaj:"Stergerea nu s-a realizat. Verificati parola introdusa."});
                    return;
                }
                trimiteMail(campuriText.email, "La revedere", "Ne pare rau ca ti-ai sters contul", "<p>Ne pare rau ca pleci :( </p>");
                req.session.destroy();
                res.redirect('/index');
            }
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


// ---------------- Update profil -----------------------------

app.post("/profil", function(req, res){
    console.log("profil");
    if (!req.session.utilizator){
        res.render("pagini/eroare_generala",{text:"Nu sunteti logat."});
        return;
    }
    var formular= new formidable.IncomingForm();
    
    let caleUtiliz = null;
    formular.on("field", function(nume,val){  // 1 
            console.log(`--- ${nume}=${val}`);
            if(nume=="username")
                username=val;
        });
        formular.on("fileBegin", function(nume,fisier){ //2
            console.log(`username = ${username}`)
            console.log("fileBegin");
            console.log(__dirname);
            caleUtiliz=path.join(__dirname,"poze_uploadate",username);
            console.log(caleUtiliz);
            if(!fs.existsSync(caleUtiliz))
                    fs.mkdirSync(caleUtiliz);
            fisier.filepath=path.join(caleUtiliz,fisier.originalFilename);
            console.log(nume, fisier);
            console.log(nume, fisier.filepath);
            if(fisier.originalFilename)
                {
                    caleUtiliz = path.join('poze_uploadate', username, fisier.originalFilename);
                    caleUtiliz = '/'+caleUtiliz;
                    caleUtiliz = caleUtiliz.replaceAll('\\', '/');
                }
            else caleUtiliz = '';
        });
        formular.on("file", function(nume,fisier){//3
            console.log("file");
            console.log(nume,fisier);
        });    
        
    formular.parse(req,function(err, campuriText, campuriFile){
        
        var criptareParola=crypto.scryptSync(campuriText.parola,parolaServer, 64).toString('hex'); 

        //TO DO query
        var queryUpdate=`update utilizatori set nume='${campuriText.nume}', prenume='${campuriText.prenume}', email='${campuriText.email}', culoare_chat='${campuriText.culoare_chat}'`;
        var condQuerry = ` where parola='${criptareParola}' and username = '${campuriText.username}'`;
        if(caleUtiliz) queryUpdate+=`, poza='${caleUtiliz}'`;
        queryUpdate+=condQuerry;
        console.log(queryUpdate+'------------------------------------------------------------');
        client.query(queryUpdate,  function(err, rez){
            if(err){
                console.log(err);
                res.render("pagini/eroare_generala",{text:"Eroare baza date. Incercati mai tarziu."});
                return;
            }
            console.log(rez.rowCount);
            if (rez.rowCount==0){
                res.render("pagini/profil",{mesaj:"Update-ul nu s-a realizat. Verificati parola introdusa."});
                return;
            }
            else{            
                //actualizare sesiune
                req.session.utilizator.nume= campuriText.nume;
                req.session.utilizator.prenume= campuriText.prenume;
                req.session.utilizator.email= campuriText.email;
                req.session.utilizator.culoare_chat= campuriText.culoare_chat;
            }

            trimiteMail(campuriText.email, 'Modificarea detaliilor contului',  `Noile tale detalii sunt: Nume: ${campuriText.nume}, prenume: ${campuriText.prenume}, email: ${campuriText.email}, culoare chat: ${campuriText.culoare_chat}`, 
            `<h1>Noile tale detalii sunt:</h1> <p>Nume: ${campuriText.nume}</p> <p>Prenume: ${campuriText.prenume}</p><p>Email: ${campuriText.email}</p><p>Culoare chat: ${campuriText.culoare_chat}</p>`);
            res.render("pagini/profil",{mesaj:"Update-ul s-a realizat cu succes. Este posibil sa fie nevoie de un refresh pentru a vedea modificarile"});

        });
        

    });
});

//TODO: trebuie completat post-ul de mai sus a.i. sa verifice daca utilizatorul a bagat parola buna si daca da sa ii fac update-urile


app.post('/modifica_parola', function(req, res){
    var formular = new formidable.IncomingForm();
    formular.parse(req, function(err, campuriText, campuriFisier){
        var parolaActuala=crypto.scryptSync(campuriText.parola_actuala,parolaServer, 64).toString('hex'); 
        var parolaNoua=crypto.scryptSync(campuriText.parola,parolaServer, 64).toString('hex');
        var parolaConfirm=crypto.scryptSync(campuriText.parola_confirmare,parolaServer, 64).toString('hex');  
        if(parolaNoua!=parolaConfirm || parolaNoua.length==0)
            res.render('pagini/profil', {mesaj:"Parolele nu se potrivesc"});
        var query = `update utilizatori set parola = '${parolaNoua}' where username = '${campuriText.username}' and parola = '${parolaActuala}'`;
        console.log(query);
        client.query(query, function(err, rezQuerry){
            if(err) res.render('pagini/profil', {mesaj:"Eroare la baza de date " + err});
            else{
                if (rezQuerry.rowCount==0){
                    res.render("pagini/profil",{mesaj:"Modificarea nu s-a realizat. Verificati parola cureanta."});
                    return;
                }
                trimiteMail(campuriText.email, "Parola schimbata", "Parola a fost schimbata", `<h2>Parola contului ${campuriText.username} a fost schimbată</h2>`);
                res.render('pagini/profil', {mesaj:"Parola schimbata cu succes!"});
            }
        })
    });
})





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
    // console.log('-------------------------'+buf);
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


