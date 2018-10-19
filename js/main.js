 var respuesta=[];
 var urlimg="https://hardstopp.000webhostapp.com/img/prod/";
 var $producto = document.getElementById('productos');
 var $boton=document.getElementsByClassName('boton');
 var $productoelegido = document.getElementById('ocultar2');
 var $cajacomprar = document.getElementById('ocultar4');
 var $cajaconfirmar = document.getElementById('ocultar5')
 var tabla = ``;
 var tabla2 = ``;
 var comprar = ``; 
 var $loading = document.getElementById("loading");
function traerProductos(){
	let request = new XMLHttpRequest();	
     
	let url = "https://hardstopp.000webhostapp.com/api/productos.php";
    request.open('GET', url, true);
    //request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.onreadystatechange = function(){
        if(request.status==200 && request.readyState==4){
            respuesta = JSON.parse(request.responseText);
            var lista = respuesta.response;
            mostrar(lista);
            document.getElementById("loading").id="ocultar3";
                        
                        
        }
    };
            request.send();
}
function mostrar(xd){
    xd.forEach(function(elemento,indice){
       tabla += '<table>'
            +'<tr><td class="imagen">'+ '<img src="'+urlimg+elemento.imagen+'">'+'</td>'
            +'<td class="precio">$'+ elemento.precio +'</td>'
            +'<td class="nombre">'+ elemento.nombre +'</td>'
            +'<td><button type="submit" value="'+elemento.id_producto+'" class="boton">+ INFO</button></td></tr>'
        tabla += '</table>';
        $producto.innerHTML=tabla;
    });
    selecprod(xd); 
}
window.onload = function(){
    traerProductos();
};

function selecprod(prodss){
    $producto.addEventListener('click', function (event) {
        let elemento = event.target;
        
        if (elemento.classList.contains("boton")){
            
                
            
            
            for (let id of prodss) {
                if(elemento.value == id.id_producto ){
                    document.getElementById("productos").id="ocultar";
                    tabla2 += '<table id="'+id.id_producto+'">'
                        +'<tr><td class="imagen"><img src="'+urlimg+id.imagen+'">'+'</td>'
                        +'<td class="precio">$'+ id.precio +'</td>'
                        +'<td class="nombre">'+ id.nombre +'</td>'
                        +'<td class="desc">'+ id.descripcion +'</td></tr>'
                    tabla2 += '</table>'
                            + '<div id="menu-compras">'
                            + '<button type="submit" class="botonxd btnvolver botonc"><span class="icon-undo2"></span>Volver</button>'
                            + '<button type="submit" id="favorito" class="botonxd btnfavorito"><span class="icon-heart"></span>Fav</button>'
                            + '<button type="submit" class="botonxd btncomprar"><span class="icon-cart"></span>Comprar</button>';
                            + '</div>'
                    document.getElementById("ocultar2").id = "prodelegido";
                    $productoelegido.innerHTML=tabla2;
                    window.sessionStorage.setItem("precio",id.precio);
                    window.sessionStorage.setItem("id",id.id_producto);
                    volver(elemento.value);
                } 
            }
        }
            

    }, false);
    
}
function volver(paramProducto){
    $productoelegido.addEventListener('click', function (event) {
        let elemento = event.target;
        if (elemento.classList.contains("btncomprar")){
            document.getElementById("prodelegido").id = "ocultar2"; 
            document.getElementById("ocultar4").id = "compra";
            cancelar();
        }
        if (elemento.classList.contains("btnvolver")){
            tabla2 = ``;
            document.getElementById("ocultar").id="productos";
            document.getElementById("prodelegido").id = "ocultar2";
        }
        if(elemento.classList.contains("btnfavoritored")){
            debugger
            let boton = document.getElementById("favorito")
            boton.classList.remove("btnfavoritored")
            boton.classList.add("botonfavorito")
            //quitarProducto(paramProducto)
            return true
        }
        if(elemento.classList.contains("btnfavorito")){
            debugger
            let boton = document.getElementById("favorito")
            boton.classList.remove("btnfavorito")
            boton.classList.add("btnfavoritored")
            agregarProducto(paramProducto)
            return true
        }  
    }, false);
}

function agregarProducto (paramProducto) {
    a = JSON.parse(localStorage.getItem('test'))
    if(a === null){
        localStorage.setItem('test',paramProducto)
    }else{
        b = a.toString();
        test = b.split(',')
        test.push(paramProducto)
        var buola = test.reduce((i,n) => i+','+n)
        localStorage.setItem('test',buola)
    }
}

function quitarProducto (producto) {
    let a = []
    a = JSON.parse(localStorage.getItem('session'))
    a.forEach(function (elemento, indice) {
        console.log(elemento, indice);
    });
}
function cancelar(){
    $cajacomprar.addEventListener('click', function (event) {
        let elemento = event.target;
        if (elemento.classList.contains("cancelar")){
            comprar =``;
            document.getElementById("compra").id = "ocultar4";
            document.getElementById("ocultar2").id = "prodelegido";
        }
        if(elemento.classList.contains("compra")){
            document.getElementById("compra").id = "ocultar4";
            document.getElementById("ocultar5").id = "casicompro";
            $cajaconfirmar.addEventListener('click', function (event) {
                let element = event.target;
                if(element.classList.contains("cancelar")){
                    comprar =``;
                    document.getElementById("ocultar2").id = "prodelegido";
                    document.getElementById("casicompro").id = "ocultar5";
                }
                if(element.classList.contains("noscompro")){
                    swal("Compra realizada!", "Recibiras mas informacion sobre tu compra en tu casilla de correo", "success")
                    .then((value) => {
                        tabla2 = ``;
                        document.getElementById("casicompro").id = "ocultar5";
                        document.getElementById("ocultar").id="productos";
                      });
                }
            })
        }
    }, false);
}




function compra(){
   
    var precio = window.sessionStorage.getItem("precio");
    
            
            let parametros = {precio:precio };
            let request = new XMLHttpRequest();
            let url = 'https://hardstopp.000webhostapp.com/api/compra.php';
            request.open('POST', url, true);// configuro mi request para que sea tipo POST
            // Este header es necesario para comunicar al servidor dónde son enviados los parámetros
            // application/json : los parámetros se enviaran a través del body del request
            request.setRequestHeader("Content-Type", "application/json");
            request.onreadystatechange = function(){
                if(request.status==200 && request.readyState==4){
                        window.sessionStorage.removeItem("precio");
                        let respuestaDelServidor = JSON.parse(request.responseText);
                }
            };
            // la función JSON.stringify() transforma una variable tipo object a un string con formato Json
            request.send(JSON.stringify(parametros));

}

function compra2(){
    var id = window.sessionStorage.getItem("id");
    let parametros = {id:id };
            let req = new XMLHttpRequest();
            let url2 = 'https://hardstopp.000webhostapp.com/api/prodxventa.php';
            req.open('POST', url2, true);// configuro mi request para que sea tipo POST
            // Este header es necesario para comunicar al servidor dónde son enviados los parámetros
            // application/json : los parámetros se enviaran a través del body del request
            req.setRequestHeader("Content-Type", "application/json");
            req.onreadystatechange = function(){
                if(req.status==200 && req.readyState==4){
                        window.sessionStorage.removeItem("id");
                        let respuestaDelServidor = JSON.parse(req.responseText);
                }
            };
            // la función JSON.stringify() transforma una variable tipo object a un string con formato Json
            req.send(JSON.stringify(parametros));


}
