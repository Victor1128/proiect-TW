/*
Functii preluate de pe 
https://www.w3schools.com/js/js_cookies.asp
si modificate */


function setCookie(cname, cvalue, timp_expirare, path="/") {//timp_expirare masurat in milisecunde
    d = new Date();
    d.setTime(d.getTime() + timp_expirare);
    let stringCookie=`${cname}=${cvalue}; expires=${d.toUTCString()}; path=${path}`;
    console.log(stringCookie);
    document.cookie = stringCookie;
    console.log(d.toUTCString());
  }
  
  function getCookie(nume) {//returneaza valoarea cookie-ului cu numele cname
    var ca = document.cookie.split(';');//vectorul de stringuri de forma nume_cookie=valoare_cookie
    for(let c of ca) {
      c = c.trim();//elementul curent
      if(c.startsWith(nume+'=')){
        return c.substring(nume.length+1);
      }
    }
  }
  
  function checkBanner() {
    if ( getCookie("acceptat_banner")) { //sirul vid e evaluat la fals intr-o expresie booleana
      document.getElementById("banner").style.display="none";
    } else {

        document.getElementById("banner").style.display="block";
       
        document.getElementById("ok_cookies").onclick=function(){
          console.log(getCookie("acceptat_banner"));
            document.getElementById("banner").style.display = "none";
            setCookie("acceptat_banner", "true", 5000);
            //setCookie("test", "ceva", 5000);
            // document.getElementById("banner").style.display="none";
          }
      
    }
  } 

function deleteCookie(nume){//presupunem path =/
   setCookie(nume, "", 0);
}


window.addEventListener("DOMContentLoaded", function(){
  checkBanner();
  console.log("aici");

})
