var btnGet = document.getElementById('GET');
var btnPost = document.getElementById('POST');
var btnDelete = document.getElementById('DELETE');
var btnPut = document.getElementById('PUT');


btnGet.addEventListener('click', cargarGet);
btnPost.addEventListener('click', enviarPost);
  btnPut.addEventListener('click', enviarPut);



let datosAgregados = [];

function alert() {
  alert('prueba');
}

function cargarGet() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://g3834a8f0c0ab9b-car.adb.us-chicago-1.oraclecloudapps.com/ords/admin/message/message', true);
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
        } else
          document.getElementById("miDiv").style.display = 'block';
      } catch (error) {
        document.getElementById("miDiv").style.display = 'block';
      }
    }
  }
  xhr.send();
}

function cargarGetId(id) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://g3834a8f0c0ab9b-car.adb.us-chicago-1.oraclecloudapps.com/ords/admin/message/message/' + id, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      try {
        // alert("Metodo Get");
        // document.getElementById('resultado').innerHTML = xhr.responseText;
        const datos = JSON.parse(this.responseText);
        if (datos.items.length > 0) {
          agregarDatosTablaID(datos.items);
          console.log(datos.items);
          document.getElementById("miDiv").style.display = 'none';
        } else
          document.getElementById("miDiv").style.display = 'block';
      } catch (error) {
        document.getElementById("miDiv").style.display = 'block';
      }
    }
  }
  xhr.send();
}

function enviarPost() {

  var idMensajes = parseInt(document.getElementById("idMensajes").value);
  var Mensaje = document.getElementById("Mensaje").value;



  var datos = {
    id: idMensajes,
    messagetext: Mensaje,
  
  }

  console.log(JSON.stringify(datos));

  try {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://g3834a8f0c0ab9b-car.adb.us-chicago-1.oraclecloudapps.com/ords/admin/message/message', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 201) {
        var respuesta = xhr.responseText;

        agregarDatosTabla(datos)


        document.getElementById("idMensajes").value = '';
        document.getElementById("Mensaje").value = '';
   
        document.getElementById("Respuesta").style.display = 'block';
        document.getElementById("Respuesta").innerHTML = "Insertado Correctamente";

        setTimeout(function () {
          var div = document.getElementById("Respuesta");
          div.style.display = "none";
        }, 6000);

        cargarGet();
      }
      else {
        // Si la petición no fue exitosa, mostramos el mensaje de error correspondiente
        document.getElementById("Respuesta").style.display = 'block';
        document.getElementById("Respuesta").innerHTML = "Error al instertar, codigo " + xhr.status;

        setTimeout(function () {
          var div = document.getElementById("Respuesta");
          div.style.display = "none";
        }, 6000);
      }
    }



  } catch (error) {
    document.getElementById("Respuesta").style.display = 'block';
    document.getElementById("Respuesta").innerHTML = xhr.responseText;
  }

  xhr.send(JSON.stringify(datos));


}

function agregarDatosTablaID(datos) {
  const tabla = document.getElementById("resultado_model").getElementsByTagName('tbody')[0];

  const datosString = JSON.stringify(datos[0]);

  if (!datosAgregados.includes(datosString)) {
    const fila = tabla.insertRow(0);

    const celdaId = fila.insertCell(0);
    celdaId.innerHTML = datos[0].id;

    const celdaNombre = fila.insertCell(1);
    celdaNombre.innerHTML = datos[0].messagetext;

    datosAgregados.push(datosString);
  }
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
      celdaNombre.innerHTML = datos[i].messagetext;


      const BotonDetalles = fila.insertCell(2);
      const button = document.createElement('button');
      button.setAttribute('type', 'button');
      button.setAttribute('class', 'btn btn-primary btn-sm ');
      button.setAttribute('data-bs-toggle', 'modal');
      button.setAttribute('data-bs-target', '#miModal');
      button.setAttribute('id', datos[i].id);
      button.textContent = 'DETALLES';

      $('#miModal').on('shown.bs.modal', function (event) {
        const button = event.relatedTarget;
        const iddetalle = button.getAttribute('id');
        cargarGetId(iddetalle);
      });

      BotonDetalles.appendChild(button);



      const celdaBoton = fila.insertCell(3);
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
  xhr.open('DELETE', 'https://g3834a8f0c0ab9b-car.adb.us-chicago-1.oraclecloudapps.com/ords/admin/message/message', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 204) {

      document.getElementById("Respuesta").style.display = 'block';
      document.getElementById("Respuesta").innerHTML = "Eliminado Correctamente";

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

  var idMensajes = parseInt(document.getElementById("idMensajesm").value);
  var Mensaje = document.getElementById("Mensajem").value;





  // Actualizar la fila correspondiente en la tabla model
  const tabla = document.getElementById("resultado_model").getElementsByTagName('tbody')[0];
  const filasTabla = tabla.getElementsByTagName('tr');
  for (let i = 0; i < filasTabla.length; i++) {
    const fila = filasTabla[i];
    if (fila.cells[0].innerHTML == idMensajes) {
      fila.cells[1].innerHTML = Mensaje;
      break;
    }
  }

  // Actualizar la fila correspondiente en la tabla Total
  const tablat = document.getElementById("resultado").getElementsByTagName('tbody')[0];
  const filasTablat = tablat.getElementsByTagName('tr');
  for (let i = 0; i < filasTablat.length; i++) {
    const filas = filasTablat[i];
    if (filas.cells[0].innerHTML == idMensajes) {
      filas.cells[1].innerHTML = Mensaje;
      break;
    }
  }

  var datos = {
    id: idMensajes,
    messagetext: Mensaje
  }

  console.log(JSON.stringify(datos));

  try {
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', 'https://g3834a8f0c0ab9b-car.adb.us-chicago-1.oraclecloudapps.com/ords/admin/message/message', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 201) {
        var respuesta = xhr.responseText;

        document.getElementById("idMensajesm").value = '';
        document.getElementById("Mensajem").value = '';

        document.getElementById("Respuesta").style.display = 'block';
        document.getElementById("Respuesta").innerHTML = "Actualizado Correctamente";

        setTimeout(function () {
          var div = document.getElementById("Respuesta");
          div.style.display = "none";
        }, 5000);
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

    setTimeout(function () {
      var div = document.getElementById("Respuesta");
      div.style.display = "none";
    }, 5000);
  }

  xhr.send(JSON.stringify(datos));


}



