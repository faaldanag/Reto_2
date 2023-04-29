var btnGet = document.getElementById('GET');
var btnPost = document.getElementById('POST');
var btnDelete = document.getElementById('DELETE');
var btnPut = document.getElementById('PUT');


btnGet.addEventListener('click', cargarGet);
btnPost.addEventListener('click', enviarPost);
btnDelete.addEventListener('click', eliminarDelete);
btnPut.addEventListener('click', enviarPut);



let datosAgregados = [];

function alert() {
  alert('prueba');
}

function cargarGet() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://g3834a8f0c0ab9b-car.adb.us-chicago-1.oraclecloudapps.com/ords/admin/car/car', true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      try {
        // alert("Metodo Get");
        // document.getElementById('resultado').innerHTML = xhr.responseText;
        const datos = JSON.parse(this.responseText);
        if (datos.items.length > 0) {
          agregarDatosTabla(datos.items);
          console.log(datos.items);
          document.getElementById("miDiv").style.display = 'none';
        }else
        document.getElementById("miDiv").style.display = 'block';
      } catch (error) {
        document.getElementById("miDiv").style.display = 'block';
      }
    }
  }
  xhr.send();
}

function enviarPost() {
  event.preventDefault();

  var idProducto = parseInt(document.getElementById("idProducto").value);
  var nombre = document.getElementById("nombre").value;
  var descripcion = document.getElementById("descripcion").value;
  var Valor = parseInt(document.getElementById("Valor").value);


  var datos = {
    idProducto: idProducto,
    nombre: nombre,
    descripcion: descripcion,
    valor: Valor
  }

  console.log(JSON.stringify(datos));

  try {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:8080/', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var respuesta = xhr.responseText;

        agregarDatosTabla(datos)


        document.getElementById("idProducto").value = '';
        document.getElementById("nombre").value = '';
        document.getElementById("descripcion").value = '';
        document.getElementById("Valor").value = '';




        document.getElementById("Respuesta").style.display = 'block';
        document.getElementById("Respuesta").innerHTML = xhr.responseText;

        setTimeout(function () {
          var div = document.getElementById("Respuesta");
          div.style.display = "none";
        }, 5000);

        cargarGet();
      }
      else {
        // Si la petición no fue exitosa, mostramos el mensaje de error correspondiente
        document.getElementById("Respuesta").style.display = 'block';
        document.getElementById("Respuesta").innerHTML = "Error en la petición. Código de estado: " + xhr.status;

        setTimeout(function () {
          var div = document.getElementById("Respuesta");
          div.style.display = "none";
        }, 5000);
      }
    }



  } catch (error) {
    document.getElementById("Respuesta").style.display = 'block';
    document.getElementById("Respuesta").innerHTML = xhr.responseText;
  }

  xhr.send(JSON.stringify(datos));


}

function agregarDatosTabla(datos) {
  const tabla = document.getElementById("resultado").getElementsByTagName('tbody')[0];

  for (let i = 0; i < datos.length; i++) {
    // Verifica si los datos ya se encuentran en la variable global

    const datosString = JSON.stringify(datos[i]);
    const datosAgregadosString = datosAgregados.map(dato => JSON.stringify(dato));


    if (!datosAgregadosString.includes(datosString)) {

      const fila = tabla.insertRow(i);

      const celdaId = fila.insertCell(0);
      celdaId.innerHTML = datos[i].id;

      const celdaNombre = fila.insertCell(1);
      celdaNombre.innerHTML = datos[i].brand;

      const celdaDescripcion = fila.insertCell(2);
      celdaDescripcion.innerHTML = datos[i].model;

      const celdaValor = fila.insertCell(3);
      celdaValor.innerHTML = datos[i].category_id;


      const celdaBoton = fila.insertCell(4);
      const boton = document.createElement('button');
      boton.classList.add('btn');
      boton.classList.add('btn-danger');
      boton.classList.add('text-uppercase');
      boton.classList.add('font-weight-bold');
      boton.classList.add('btn-sm');
      boton.id = datos[i].id;
      boton.textContent = 'Eliminar';

      boton.addEventListener('click', function () {
        eliminarDelete(this.id);
      });
      celdaBoton.appendChild(boton);

      // Agrega los datos a la variable global
      datosAgregados.push(datos[i]);
    }
  }
}

function eliminarDatosTabla(datos) {
  const tabla = document.getElementById("resultado").getElementsByTagName('tbody')[0];

  for (let i = 0; i < datos.length; i++) {
    // Verifica si los datos ya se encuentran en la variable global

    const datosString = JSON.stringify(datos[i]);
    const datosAgregadosString = datosAgregados.map(dato => JSON.stringify(dato));


    if (!datosAgregadosString.includes(datosString)) {
      const filasTabla = tabla.getElementsByTagName('tr');
      for (let j = 0; j < filasTabla.length; j++) {
        const fila = filasTabla[j];
        if (fila.cells[0].innerHTML === datos[i].idProducto) {
          tabla.deleteRow(j);
          break;
        }
      }
      datosAgregados.push(datos[i]);
    }
  }
}

function eliminarDelete(id) {
  event.preventDefault();

  console.log(id)

  var idparse = parseInt(id);

  const tabla = document.getElementById("resultado").getElementsByTagName('tbody')[0];

  const filasTabla = tabla.getElementsByTagName('tr');
  var filaEncontrada = false;
  for (let i = 0; i < filasTabla.length; i++) {
    const fila = filasTabla[i];
    if (fila.cells[0].innerHTML === id.toString()) {
      tabla.deleteRow(i);
      filaEncontrada = true;
      break;
    }
  }

  if (!filaEncontrada) {
    console.log("La fila no existe");
    return;
  }

  var datos = {
    id: idparse,
  }

  console.log(JSON.stringify(datos));

  var xhr = new XMLHttpRequest();
  xhr.open('DELETE', 'https://g3834a8f0c0ab9b-car.adb.us-chicago-1.oraclecloudapps.com/ords/admin/car/car', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {

      document.getElementById("Respuesta").style.display = 'block';
      document.getElementById("Respuesta").innerHTML = xhr.responseText;

      setTimeout(function () {
        var div = document.getElementById("Respuesta");
        div.style.display = "none";
      }, 5000);

      cargarGet();
    } else {
      document.getElementById("Respuesta").style.display = 'block';
      document.getElementById("Respuesta").innerHTML = "Error en la petición. Código de estado: " + xhr.status;

      setTimeout(function () {
        var div = document.getElementById("Respuesta");
        div.style.display = "none";
      }, 5000);
    }
  }
  xhr.send(JSON.stringify(datos));
}

function enviarPut() {
  event.preventDefault();

  var idCarros = parseInt(document.getElementById("idCarros").value);
  var Marca = document.getElementById("Marca").value;
  var Modelo = document.getElementById("Modelo").value;
  var Categoria_id = parseInt(document.getElementById("Categoria_id").value);


  // Actualizar la fila correspondiente en la tabla
  const tabla = document.getElementById("resultado").getElementsByTagName('tbody')[0];
  const filasTabla = tabla.getElementsByTagName('tr');
  for (let i = 0; i < filasTabla.length; i++) {
    const fila = filasTabla[i];
    if (fila.cells[0].innerHTML == idCarros) {
      fila.cells[1].innerHTML = Marca;
      fila.cells[2].innerHTML = Modelo;
      fila.cells[3].innerHTML = Categoria_id;
      break;
    }
  }

  var datos = {
    id: idCarros,
    brand: Marca,
    model: Modelo,
    category_id: Categoria_id
  }

  console.log(JSON.stringify(datos));

  try {
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', 'https://g3834a8f0c0ab9b-car.adb.us-chicago-1.oraclecloudapps.com/ords/admin/car/car', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var respuesta = xhr.responseText;




        document.getElementById("idCarros").value = '';
        document.getElementById("Marca").value = '';
        document.getElementById("Modelo").value = '';
        document.getElementById("Categoria_id").value = '';

        document.getElementById("Respuesta").style.display = 'block';
        document.getElementById("Respuesta").innerHTML = xhr.responseText;

        setTimeout(function () {
          var div = document.getElementById("Respuesta");
          div.style.display = "none";
        }, 5000);
      }
      else {
        // Si la petición no fue exitosa, mostramos el mensaje de error correspondiente
        document.getElementById("Respuesta").style.display = 'block';
        document.getElementById("Respuesta").innerHTML =

          document.getElementById("Respuesta").style.display = 'block';
        document.getElementById("Respuesta").innerHTML = "Error en la petición. Código de estado: " + xhr.status;

        setTimeout(function () {
          var div = document.getElementById("Respuesta");
          div.style.display = "none";
        }, 5000);
      }
    }



  } catch (error) {
    document.getElementById("Respuesta").style.display = 'block';
    document.getElementById("Respuesta").innerHTML = xhr.responseText;

    setTimeout(function () {
      var div = document.getElementById("Respuesta");
      div.style.display = "none";
    }, 5000);
  }

  xhr.send(JSON.stringify(datos));


}



