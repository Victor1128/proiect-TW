const express= require("express");
const fs=require("fs");
const { dirname } = require("path");
const sharp=require("sharp");
const {Client}=require("pg");

var client=new Client({user:"victor", password:"victor", database:"proiect", host:"localhost", port:5432});
client.connect();
app= express();

app.set("view engine","ejs");

app.use("/Resurse", express.static(__dirname+"/Resurse"))

console.log("Director proiect:",__dirname);

app.get(["/", "/index", "/home", "/acasa"], function(req, res){
    //res.sendFile(__dirname+"/index1.html");
    // client.query("select * from test", function(err,rez){
    //     if(!err)
        // res.render("pagini/index", {ip:req.ip, imagini:obImagini.imagini});
    // })
    res.render("pagini/index", {ip:req.ip, imagini:obImagini.imagini});
})

app.get("/produse", function(req, res){
    client.query("select * from jocuri", function(err, rezQuerry){
        console.log("Am ajuns aici "+rezQuerry);
        res.render("pagini/produse", {produse:rezQuerry.rows});
    })
})

app.get("/produs/:id", function(req, res){
    console.log("PRODUS:", req.url);
    client.query(`select * from jocuri where id= ${req.params.id}`, function(err, rezQuerry){
        console.log("Am ajuns aici 2"+rezQuerry);
        res.render("pagini/produs", {prod:rezQuerry.rows[0]});
    })
})

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