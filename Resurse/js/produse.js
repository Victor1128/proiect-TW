window.onload=function(){
    document.getElementById("inp-pret").onchange = function(){
        document.getElementById("infoRange").innerHTML = " ("+ this.value +")";
    }

    function filtreaza(){
        var valNume=document.getElementById("inp-nume").value;
            var butoaneRadio=document.getElementsByName("gr_rad");
            var valPret=document.getElementById("inp-pret").value;
            var valCateg = document.getElementById("inp-categorie").value;
            var valCheie = document.getElementById("inp-cheie").value;
            var valData = document.getElementById("inp-noutati").checked;

            var selected = document.querySelectorAll('#inp-caracteristici option:checked');
            var valCar = Array.from(selected).map(el => el.value);
            // console.log(valCar);

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
                let descriere = art.getElementsByClassName("val-descriere")[0].innerHTML;
                let data = Date.parse(art.getElementsByClassName("val-data")[0].innerHTML);
                let caraci = art.getElementsByClassName("val-caracteristici")[0].innerHTML.split(" ");
                let carac = new Array();
                for(let c of caraci){
                    if(c.length>1)
                    carac.push(c);
                }
                console.log(carac);
                let cond1 = (numeArt.toLowerCase().startsWith(valNume.toLowerCase()) || valNume == "Numele jocului");
                let cond2 = (valScor=="toate" || (scor>=minScor && scor<maxScor));
                let cond3 = (valPret<=pret);
                let cond4 = (valCateg == "toate" || valCateg == categ);
                let cond5 = (descriere.toLowerCase().includes(valCheie.toLowerCase()));
                let cond6 = (!valData || data>Date.parse('10 Apr 2022 00:00:00 GMT'));
                let cond7 = (valCar.every(function(el){
                    if(carac.includes(el)) return true;
                    else return false;
                }) || valCar.length==0)
                let conditieFinala = cond1&cond2&cond3&cond4&cond5&cond6&cond7;
    
                if(conditieFinala){
                    art.style.display="grid";
                }
    
            }
    }
    document.getElementById("filtrare").onclick=function(){
            var valNume=document.getElementById("inp-nume").value;
            var butoaneRadio=document.getElementsByName("gr_rad");
            var valPret=document.getElementById("inp-pret").value;
            var valCateg = document.getElementById("inp-categorie").value;
            var valCheie = document.getElementById("inp-cheie").value;
            var valData = document.getElementById("inp-noutati").checked;
            var valProd = document.getElementById("inp-prod").value;
            var selected = document.querySelectorAll('#inp-caracteristici option:checked');
            var valCar = Array.from(selected).map(el => el.value);
            // console.log(valCar);
            console.log(valProd);
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
                let descriere = art.getElementsByClassName("val-descriere")[0].innerHTML;
                let data = Date.parse(art.getElementsByClassName("val-data")[0].innerHTML);
                let prod = art.getElementsByClassName("val-producator")[0].innerHTML;
                let caraci = art.getElementsByClassName("val-caracteristici")[0].innerHTML.split(" ");
                let carac = new Array();
                for(let c of caraci){
                    if(c.length>1)
                    carac.push(c);
                }
                // console.log(carac);
                let cond1 = (numeArt.toLowerCase().startsWith(valNume.toLowerCase()) || valNume == "Numele jocului");
                let cond2 = (valScor=="toate" || (scor>=minScor && scor<maxScor));
                let cond3 = (valPret<=pret);
                let cond4 = (valCateg == "toate" || valCateg == categ);
                let cond5 = (descriere.toLowerCase().includes(valCheie.toLowerCase()));
                let cond6 = (!valData || data>Date.parse('10 Apr 2022 00:00:00 GMT'));
                let cond7 = (valCar.every(function(el){
                    if(carac.includes(el)) return true;
                    else return false;
                }) || valCar.length==0)
                let cond8 = (valProd=="" || prod == valProd);

                let conditieFinala = cond1&cond2&cond3&cond4&cond5&cond6&cond7&cond8;
    
                if(conditieFinala){
                    art.style.display="grid";
                }
    
            }
        
    };
    
    window.onkeydown = function(ev){
        if(ev.key == "Enter"){
            filtreaza();
        }
    }

    document.getElementById("resetare").onclick=function(){ 
        var articole=document.getElementsByClassName("produs"); 
        for (let art of articole) {
             art.style.display="grid";
        }
    document.getElementById("inp-nume").value="Numele jocului";
    document.getElementById("i_rad4").checked=true; 
    document.getElementById("inp-pret").value=0; 
    document.getElementById("infoRange").innerHTML=" (0)";
    document.getElementById("sel-toate").selected=true;
    document.getElementById("inp-cheie").value="";
    document.getElementById("inp-prod").value="";
    document.getElementById("inp-noutati").checked=false;
    document.getElementsByClassName("opt-caracteristici").selected=false;
    }

    function sorteaza(semn){
        var articole=document.getElementsByClassName("produs");
        var v_articole= Array.from(articole)
        v_articole.sort(function(a,b){
            let pret_a=parseInt(a.getElementsByClassName("val-scor")[0].innerHTML) / (parseInt(a.getElementsByClassName("val-pret")[0].innerHTML)+0.00001);
            let pret_b=parseInt(b.getElementsByClassName("val-scor")[0].innerHTML) / (parseInt(b.getElementsByClassName("val-pret")[0].innerHTML)+0.00001);
            

            if (pret_a!=pret_b)
                return semn*(pret_a-pret_b);
            else{
                //se activeaza a 2-a cheie de sortare: pret
                let nume_a=a.getElementsByClassName("val-nume")[0].innerHTML
                let nume_b=b.getElementsByClassName("val-nume")[0].innerHTML
                
                return semn*nume_a.localeCompare(nume_b);
            }
        })
        for (let art of v_articole){
            art.parentElement.appendChild(art);
        }
    }

    document.getElementById("sortCrescNume").onclick=function(){
        sorteaza(1);
    }
    document.getElementById("sortDescrescNume").onclick=function(){
        sorteaza(-1);
    }

    document.getElementById("sumaPret").onclick=function(){
        if(! document.getElementById("divsuma")){
            let suma=0;
            var articole = document.getElementsByClassName("produs");
            for(let art of articole){
                if(art.style.display!="none" 
                && art.getElementsByClassName("select-cos")[0].checked
                )
                    suma+=parseInt(art.getElementsByClassName("val-pret")[0].innerHTML);
            }
            var divSuma = document.createElement("div");
            divSuma.id="divsuma";
            divSuma.innerHTML = "<p>Suma totală jocuri selectate: "+ suma + "</p>";
            var sectiune = document.getElementById("produse");
            sectiune.parentElement.insertBefore(divSuma, sectiune);
            setTimeout(function(){
                let div=document.getElementById("divsuma");
                if(div){
                    div.remove();
                }
            }, 2000);
        }
       
    }
}