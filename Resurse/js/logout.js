window.onload = function(){
    buton = document.getElementById("buton_logout");
    if(buton)
        buton.onclick = function(){
            window.location.href='/logout';
        }
}