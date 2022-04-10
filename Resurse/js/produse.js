window.onload=function(){
    document.getElementById("inp-pret").onchange = function(){
        document.getElementById("infoRange").innerHTML = " ("+ this.value +")";
    }


    document.getElementById("filtrare").onclick=function(){
        var valNume=document.getElementById("inp-nume").value;
        var butoaneRadio=document.getElementsByName("gr_rad");
        var valPret=document.getElementById("inp-pret").value;
        var valCateg = document.getElementById("inp-categorie").value;

        for(let rad of butoaneRadio){
            if(rad.checked){
                var valScor = rad.value;
                break;
            }
        }

        if(valScor!="toate"){
            var minScor, maxScor;
            [minScor, maxScor]=valScor.split(":");
            minScor=parseInt(minScor);
            maxScor=parseInt(maxScor);
        }

        var articole=document.getElementsByClassName("produs");
        for(let art of articole){
            art.style.display="none";
            let numeArt=art.getElementsByClassName("val-nume")[0].innerHTML;
            let scor = parseInt(art.getElementsByClassName("val-scor")[0].innerHTML);
            let pret = parseInt(art.getElementsByClassName("val-pret")[0].innerHTML);
            let categ = art.getElementsByClassName("val-tip")[0].innerHTML;

            let cond1 = (numeArt.toLowerCase().startsWith(valNume.toLowerCase()));
            let cond2 = (valScor=="toate" || (scor>=minScor && scor<maxScor));
            let cond3 = (valPret<=pret);
            let cond4 = (valCateg == "toate" || valCateg == categ);
            let conditieFinala = cond1&cond2&cond3&cond4;

            if(conditieFinala){
                art.style.display="grid";
            }

        }
    }

    document.getElementById("resetare").onclick=function(){ 
        var articole=document.getElementsByClassName("produs"); 
        for (let art of articole) {
             art.style.display="block";
        }
    document.getElementById("inp-nume").value="";
    document.getElementById("i_rad4").checked=true; 
    document.getElementById("inp-pret").value=0; 
    document.getElementById("infoRange").innerHTML=" (0)";
    document.getElementById("sel-toate").selected=true;
    }
}