
function setCookie(nume, val, timpExp, path="/"){
  //timpExp timp in milisecunde in care va expira cookie-ul
  d=new Date();
  d.setTime(d.getTime()+timpExp);
  console.log("Va expira:", d.toUTCString());
  document.cookie=`${nume}=${val}; expires=${d.toUTCString()}; path=${path}`;
}

function getCookie(nume){
  var vectCookies=document.cookie.split(";");
  for (let c of vectCookies){
      c=c.trim();
      if(c.startsWith(nume+"=")){
          return c.substring(nume.length+1)
      }
  }
  return 0;
}

function deleteCookie(nume){
  setCookie(nume, "", 0);

}
/*
functie de verificare a faptului ca exista cookie-ul "acceptat_banner", 
caz in care ascundem bannerul. Altfel, daca nu exista cookie-ul afisam 
bannerul si setam o functie la click pe buton prin care adaugam cookie-ul (care va expira dupa 5 secunde).*/

function checkBanner(){
  if(getCookie("acceptat_banner")){
      document.getElementById("banner2").style.display="none";
  }
  else{
      document.getElementById("banner2").style.display="flex";
      document.getElementById("ok_cookies").onclick=function(){
          setCookie("acceptat_banner", "true", 24*60*60*1000);
          // setCookie("acceptat_banner", "true", 5*1000);
          document.getElementById("banner2").style.display="none";
      }
  }
}

window.addEventListener("DOMContentLoaded", function(){
  checkBanner();
})



