
window.addEventListener("load",function(){
// 	var myHeaders = new Headers();
// myHeaders.append();
	var prod_sel=localStorage.getItem("cos_virtual")


	if (prod_sel){ //p.then(f1).then(f2).then(f3)
		// var vect_ids=prod_sel.split(",");
		var vect_ids = []
		var vect_cant = []
		prod_sel = prod_sel.split(',');
		for(let i = 0; i<prod_sel.length; i++){
			if(i%2==0)
				vect_cant.push(prod_sel[i])
			else vect_ids.push(prod_sel[i])
		}
		fetch("/produse_cos", {		

			method: "POST",
			headers:{'Content-Type': 'application/json'},
			
			mode: 'cors',		
			cache: 'default',
			body: JSON.stringify({
				ids_prod: vect_ids,

				a:10
			})
		})
		.then(function(rasp){ console.log(rasp); x=rasp.json(); console.log(x); return x})
		.then(function(objson) {
			console.log(objson);
			for (let prod of objson){
				let divCos=document.createElement("div");
				divCos.classList.add("cos-virtual");
				let titluNume = document.createElement('h1');
				titluNume.innerHTML = `${prod.nume}`;
				divCos.appendChild(titluNume);
				let divImagine=document.createElement("div");
				divImagine.classList.add("cos-imagine");
				let imag=document.createElement("img");
				imag.src="/Resurse/images/produse/"+prod.imagine;
				divImagine.appendChild(imag);
				divCos.appendChild(divImagine);
				let divInfo=document.createElement("div");
				divInfo.classList.add('cos-info');
				let pt_copii = '';
				if(!prod.pt_copii)
					pt_copii = 'NU ';
				let cantitate;
				for(let i = 0;i<prod_sel.length; i++)
					if(vect_ids[i] == prod.id)
						{
							cantitate = vect_cant[i];
							break;
						}
				divInfo.innerHTML=`<p style = 'color:#a1e049;'>Pret: ${prod.pret}&euro;</p><p>Cantitate: ${cantitate}</p><p>Acest joc <snap style = 'color:red'>${pt_copii}</snap><snap>este adecvat si pentru copii!</snap></p>`;
				divCos.appendChild(divInfo);
				let divButon = document.createElement('div');
				// divButon.innerHTML = `<form  method = 'post' action="/sterge_cos"><input name = 'id' value = '${prod.id}' hidden ><button style = "color:red; font-size:27px;" class="b3" type="submit"><i class="fa-solid fa-trash-can"></i></button></form>`
				divButon.innerHTML = `<button style = "color:red; font-size:27px;" class = 'stergere' value = '${prod.id}'><i class="fa-solid fa-trash-can"></i></button>`
				// divButon.innerHTML = `<input type='checkbox' value = '${prod.id}' class = "b3">`
				divCos.appendChild(divButon);
				document.getElementsByTagName("main")[0].insertBefore(divCos, document.getElementById("cumpara"));
			}

			var butoane = document.getElementsByClassName("stergere");
			console.log("este inainte de burtone", butoane);
			for(let buton of butoane){
				console.log("in forul de butoame");
					buton.onclick = function(){
						// alert("ho ho ho");
						console.log("a mers butoinul");
						for(let i = 1; i<prod_sel.length;i+=2)
						{
							if(parseInt(prod_sel[i]) == parseInt(buton.value))
								prod_sel.splice(i-1, 2);
						}
						localStorage.removeItem("cos_virtual");
						localStorage.setItem('cos_virtual', prod_sel.join(','));
						window.location.href = '/cos-virtual';
					}
			}
			
				}
		).catch(function(err){console.log(err)});

		
		// document.getElementById('b14').onclick = function(){
		// 	console.log("a mers butoinul");
		// 			for(let i = 1; i<prod_sel.length;i+=2)
		// 			{
		// 				if(parseInt(prod_sel[i]) == parseInt(buton.value))
		// 					prod_sel.splice(i-1, 2);
		// 			}
		// 			localStorage.removeItem("cos_virtual");
		// 			localStorage.setItem('cos_virtual', prod_sel.join(','));
		// 			window.location.href('/cos-virtual');
		// }

		document.getElementById("cumpara").onclick=function(){
			fetch("/cumpara", {		
	
				method: "POST",
				headers:{'Content-Type': 'application/json'},
				
				mode: 'cors',		
				cache: 'default',
				body: JSON.stringify({
					ids_prod: vect_ids,
					prod_cant: prod_sel,
					a:10
				})
			})
			.then(function(rasp){ console.log(rasp); return rasp.text()})
			.then(function(raspunsText) {
		   
				console.log(raspunsText);
	
				let p=document.createElement("p");
				p.innerHTML=raspunsText;
				document.getElementsByTagName("main")[0].innerHTML="";
				document.getElementsByTagName("main")[0].appendChild(p)
				if(!raspunsText.includes("nu sunteti logat"))
					localStorage.removeItem("cos_virtual");
		   
			}
			).catch(function(err){console.log(err)});
		}
		
	}
	else{
		document.getElementsByTagName("main")[0].innerHTML="<p>Nu aveti nimic in cos!</p>";
	}
	
	
});