const express= require("express");
const fs=require("fs");
const { dirname } = require("path");
const sharp=require("sharp");
const {Client}=require("pg");
const sass=require("sass");
const ejs = require("ejs");

var client=new Client({user:"victor", password:"victor", database:"proiect", host:"localhost", port:5432});
var nrAleator=Math.ceil(Math.random()*5)*3;
// var nrAleator=3;

client.connect();
app= express();

app.set("view engine","ejs");

app.use("/Resurse", express.static(__dirname+"/Resurse"))

app.use("/*", function(req, res, next){
   client.query("select * from unnest(enum_range(null::categ_jocuri))", function(err, rezMeniu){
        console.log(rezMeniu.rows);
        res.locals.optiuniMeniu = rezMeniu.rows;
        next();
    });
})


console.log("Director proiect:",__dirname);

app.get(["/", "/index", "/home", "/acasa"], function(req, res){
    //res.sendFile(__dirname+"/index1.html");
    // client.query("select * from test", function(err,rez){
    //     if(!err)
        // res.render("pagini/index", {ip:req.ip, imagini:obImagini.imagini});
    // })
   
    res.render("pagini/index", {ip:req.ip, imagini:obImagini.imagini, nrImag:nrAleator});
})

app.get("/produse", function(req, res){
    var cond_where = req.query.categorie ? ` categorie= '${req.query.categorie}'` : " 1=1"

    client.query("select * from unnest(enum_range(null::tipuri_jocuri))", function(er, rezCateg){
        client.query("select * from jocuri where"+cond_where, function(err, rezQuerry){
            console.log("Am ajuns aici "+rezQuerry);
            res.render("pagini/produse", {produse:rezQuerry.rows, optiuni:rezCateg.rows});
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

app.listen(8080);
console.log("A pornit");