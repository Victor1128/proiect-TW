const express= require("express");
app= express();

app.set("view engine","ejs");


app.use("/Resurse", express.static(__dirname+"/Resurse"))

console.log("Director proiect:",__dirname);

app.get(["/", "/index", "/home", "/acasa"], function(req, res){
    //res.sendFile(__dirname+"/index1.html");
    res.render("pagini/index", {ip:req.ip});
})

app.get("/*.ejs", function(req, res){
    //res.sendFile(__dirname+"/index1.html");
    res.status(403).render("pagini/403");
})

app.get("/ip", function(req, res, next){
    var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
   res.write(ip);
    console.log("2");
    next();
})
app.get("/*#info_user", function(req, res, next){
    var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
    res.write("Salut-2");
   res.write(ip);
    console.log("2");
    next();
})

app.get("/*", function(req, res){
    res.render("pagini"+req.url, function(err, rezRender){
        if (err){
            if(err.message.includes("Failed to lookup view")){
                console.log(err);
                res.status(404).render("pagini/404");
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

app.listen(8080);
console.log("A pornit")