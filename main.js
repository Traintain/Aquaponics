/**
 * ATRIBUTOS Y CONSTANTES
 */

let ronda = 1;

let dinero = 0;

let produccion = 0;
let comidaPiscicultura = 0;
let comidaAcuaponia = 0;
let silo = 0;
let campos = 100;

let biofiltro = false;
let bomba = false;

let vidaAcuaponia = 4;
let vidaPiscicultura = 3;

let infoRonda = {
  1: [3, "un huracán", 20],
  2: [4, "un terremoto", 20],
  3: [3, "una inundación", 20],
  4: [2, "una plaga", 40],
  5: [1, "una sequía", 0],
};

const idCama = {
  1: ["btnCama1", false],
  2: ["btnCama2", false],
  3: ["btnCama3", false],
};

const idPiscicola = {
  1: ["piscina1", false],
  2: ["piscina2", false],
  3: ["piscina3", false],
};

/**
 * COMPORTAMIENTO
 */

function verElemento(id, visible) {
  if (visible === true) {
    document.getElementById(id).style.visibility = "visible";
  } else {
    document.getElementById(id).style.visibility = "hidden";
  }
}

function jugar() {
  document.getElementById("campos").innerText = campos;
  document.getElementById("silo").innerText = silo;
  verElemento("btnJugar", false);
  verElemento("btnPaso1", true);
}

/**
 * Cobrar dinero
 */
function paso1() {
  monto = infoRonda[ronda][0];
  dinero = monto + dinero;
  document.getElementById("dinero").innerText = "$" + dinero;
  verElemento("btnPaso1", false);
  inicioPaso2();
}

/**
 * Construir filtro o bomba
 */
function inicioPaso2() {
  if (bomba === false) {
    verElemento("btnPaso2Bomba", true);
  }

  if (biofiltro === false) {
    verElemento("btnPaso2Biofiltro", true);
  }
  verElemento("btnPaso2", true);
}

/**
 * Construir bomba, parte del paso 2
 */
function comprarBomba() {
  if (dinero >= 1) {
    dinero -= 1;
    document.getElementById("dinero").innerText = "$" + dinero;
    bomba = true;
    verElemento("btnPaso2Bomba", false);
    document.getElementById("bomba").innerText =
      "Bomba comprada. Al recircular el agua tu producción aumenta";
  }
}

/**
 * Construir biofiltro, parte del paso 2
 */
function comprarBiofiltro() {
  if (dinero >= 1) {
    dinero -= 1;
    document.getElementById("dinero").innerText = "$" + dinero;
    biofiltro = true;
    verElemento("btnPaso2Biofiltro", false);

    document.getElementById("biofiltro").innerText =
      "Biofiltro comprado. Evita el deterioro";
  }
}

/**
 * Fin del paso 2
 */
function paso2() {
  verElemento("btnPaso2Bomba", false);
  verElemento("btnPaso2Biofiltro", false);
  verElemento("btnPaso2", false);

  inicioPaso3();
}

/**
 * Mostrar botones para sembrar y para comprar aluvines
 */
function inicioPaso3() {
  verElemento("btnPaso3", true);
  verElemento("btnCama1", true);
  verElemento("btnCama2", true);
  verElemento("btnCama3", true);
  verElemento("btnComprarAluvines", true);
}

/**
 * Establece el valor del boolean de la variable de cada cama
 * recibe la cama y el booleano que se debe asignarle
 */
function setCama(cama, valor) {
  idCama[cama][1] = valor;
}

/**
 * Sembrar plántulas, parte del paso 3
 */
function sembrar(cama) {
  if (dinero >= 1 && vidaAcuaponia > 0) {
    dinero -= 1;
    document.getElementById("dinero").innerText = "$" + dinero;
    idBtn = idCama[cama][0];
    document.getElementById(idBtn).innerText = "La planta está creciendo...";
    setCama(cama, true);
    document.getElementById(idBtn).disabled = true;
  }
}

/**
 * Muestra las imágenes de los peces que correspondan
 */
function mostrarAluvines() {
  for (let i = 1; i <= 3; i++) {
    if (idPiscicola[i][1] === true) {
      verElemento(idPiscicola[i][0], true);
    } else {
      verElemento(idPiscicola[i][0], false);
    }
  }
}

/**
 * Sembrar aluvines, parte del paso 3
 */
function comprarPeces() {
  if (dinero >= 1 && vidaPiscicultura > 0 && idPiscicola[1][1] === false) {
    dinero -= 1;
    document.getElementById("dinero").innerText = "$" + dinero;
    idPiscicola[1][1] = true;
    document.getElementById("btnComprarAluvines").innerText =
      "Los aluvines están creciendo...";
    mostrarAluvines();
    document.getElementById("btnComprarAluvines").disabled = true;
  }
}

/**
 * Desactiva los botones de las camas que no se compraron, parte del final del paso 3
 */
function desacivarCamasSinComprar() {
  for (let i = 1; i <= 3; i++) {
    console.log(idCama);
    console.log(i);
    if (idCama[i][1] === false) {
      verElemento(idCama[i][0], false);
    }
  }
}

/**
 * Fin del paso 3
 */
function paso3() {
  verElemento("btnPaso3", false);
  desacivarCamasSinComprar();
  verElemento("btnComprarAluvines", false);
  document.getElementById("btnComprarAluvines").innerText =
    "Comprar aluvines $1";
  document.getElementById("btnComprarAluvines").disabled = false;
  inicioPaso4();
}

/**
 * Muestra botón para continuar luego del desastre y ocurre el desastre
 */
function inicioPaso4() {
  verElemento("btnPaso4", true);
  campos -= infoRonda[ronda][2];
  document.getElementById("campos").innerText = campos;
  document.getElementById("desastre").innerText =
    "Sucedió " +
    infoRonda[ronda][1] +
    ", pierdes " +
    infoRonda[ronda][2] +
    " campos";
}

/**
 * Fin del paso 4
 */
function paso4() {
  verElemento("btnPaso4", false);
  verElemento("btnComprarAluvines", false);
  inicioPaso5();
}

/**
 * Revisa si hay camas de cultivo o peces por recoger
 */
function hayRecursosPorRecoger() {
  puedeRecoger = false;
  if (idPiscicola[3][1] === true) {
    puedeRecoger = true;
  } else {
    for (let i = 1; i <= 3 && !puedeRecoger; i++) {
      if (idCama[i][1] === true) {
        puedeRecoger = true;
      }
    }
  }
  return puedeRecoger;
}

/**
 * Habilita opciones para avanzar cultivos y peces
 */
function inicioPaso5() {
  verElemento("btnPaso5", true);
  if (hayRecursosPorRecoger()) {
    document.getElementById("btnPaso5").disabled = true;
    for (let i = 1; i <= 3; i++) {
      if (idCama[i][1] === true) {
        document.getElementById(idCama[i][0]).disabled = false;
        document.getElementById(idCama[i][0]).innerText = "¡Planta lista!";
        document.getElementById(idCama[i][0]).className = "btn btn-success";
        document
          .getElementById(idCama[i][0])
          .setAttribute("onClick", "cosechar(" + i + ")");
      }
    }
  } else {
    document.getElementById("btnPaso5").disabled = false;
  }
  calcularDeterioro();
  avanzarPeces();
}

/**
 * Al cosechar una cama se suman sus ganancias a la comida de la ronda
 * Se establece la variable de la cama en false
 * TODO: Si las camas no tienen vida, NO se puede recoger
 */
function cosechar(cama) {
  id = idCama[cama][0];

  if (bomba === true) {
    comidaAcuaponia += 15;
  } else {
    comidaAcuaponia += 10;
  }

  document.getElementById(id).innerText = "Sembrar plántulas $1";
  document.getElementById(id).className = "btn btn-warning";
  verElemento(id, false);
  //Establece la vaiable de la cama en false para que se pueda comprar en la siguiente ronda
  setCama(cama, false);

  document.getElementById("totalHidroponia").innerText = comidaAcuaponia;
  document.getElementById(id).setAttribute("onClick", "sembrar(" + cama + ")");
  //Antes de seguir se debe comprobar que se hayan recogido todas las plantas y los aluvines
  if (!hayRecursosPorRecoger()) {
    document.getElementById("btnPaso5").disabled = false;
  }
}

/**
 *
 */
function avanzarPeces() {
  if (idPiscicola[2][1] === true) {
    document.getElementById("btnComprarAluvines").innerText =
      "¡Pescados listos!";
    idPiscicola[2][1] = false;
    idPiscicola[3][1] = true;
    verElemento("btnComprarAluvines", true);
    document.getElementById("btnComprarAluvines").disabled = false;
    document.getElementById("btnComprarAluvines").innerText =
      "Recoger pescados";
    document
      .getElementById("btnComprarAluvines")
      .setAttribute("onClick", "recolectar()");
  }

  if (idPiscicola[1][1] === true) {
    idPiscicola[1][1] = false;
    idPiscicola[2][1] = true;
  }
  mostrarAluvines();
}

/**
 * Al recoger los peces se suman sus ganancias al silo
 * Se estima el deterioro de piscicola
 * TODO - Si ya no hay vida los peces NO se pueden recoger
 */
function recolectar() {
  comidaPiscicultura = 50;
  if (bomba === true) {
    comidaPiscicultura += 20;
  }
  document.getElementById("btnComprarAluvines").innerText =
    "Comprar aluvines $1";
  verElemento("btnComprarAluvines", false);
  document
    .getElementById("btnComprarAluvines")
    .setAttribute("onClick", "comprarPeces()");
  idPiscicola[3][1] = false;

  document.getElementById("totalPiscicola").innerText = comidaPiscicultura;

  //Antes de seguir se debe comprobar que se hayan recogido todas las plantas y los aluvines
  if (!hayRecursosPorRecoger()) {
    document.getElementById("btnPaso5").disabled = false;
  }
  mostrarAluvines();
}

/**
 * Avanza el deterioro en caso de que no haya biofiltro
 */
function calcularDeterioro() {
  if (biofiltro === false && hayRecursosPorRecoger()) {
    vidaAcuaponia !== 0 ? (vidaAcuaponia -= 1) : 1;
    vidaPiscicultura !== 0 ? (vidaPiscicultura -= 1) : 1;
    document.getElementById("vidaAcuaponia").style =
      "width: " + (vidaAcuaponia / 4) * 100 + "%";
    document.getElementById("vidaPiscicultura").style =
      "width: " + (vidaPiscicultura / 3) * 100 + "%";
  }
}

/**
 * Fin del Paso 5
 */

function paso5() {
  verElemento("btnPaso5", false);
  document.getElementById("totalCampos").innerText = campos;
  document.getElementById("totalSilo").innerText = silo;

  inicioPaso6();
}

/**
 * Se establece la producción de la ronda y se alimenta a las personas
 */
function inicioPaso6() {
  produccion = comidaAcuaponia + comidaPiscicultura + silo + campos;
  document.getElementById("totalPuntos").innerText = produccion;
  verElemento("btnPaso6", true);
  document.getElementById("btnPaso6").disabled = true;
  verElemento("alimentarPerder", true);
}

/**
 * Calcula los valores de la produccion de comida y alimenta a la poblacion (-100)
 *  Si no se cuenta con una produccion suficiente (>= 100) notifica al usuario que ha perdido
 */
function alimentar() {
  if (produccion >= 100) {
    // La persona puede avanzar a la siguiente ronda
    produccion -= 100;
    comidaAcuaponia = 0;
    comidaPiscicultura = 0;
    document.getElementById("totalPuntos").innerText = produccion;
    document.getElementById("totalPiscicola").innerText = comidaPiscicultura;
    document.getElementById("totalHidroponia").innerText = comidaAcuaponia;
    document.getElementById("totalSilo").innerText = 0;
    document.getElementById("totalCampos").innerText = 0;
  } else {
    // La persona perdió
    reiniciar();
  }
  document.getElementById("btnPaso6").disabled = false;
  document.getElementById("alimentarPerder").disabled = true;
}

/**
 * Al perder, notifica al usuario y le brinda la opcion de volver a jugar y reestablece los valores del juego
 */
function reiniciar() {
  Swal.fire({
    icon: "warning",
    title: "¡¡Oh no!!!",
    text: "No cuentas con suficiete comida",
    confirmButtonText: "Jugar de Nuevo",
    allowOutsideClick: false,
  }).then((result) => {
    reiniciarVariables();
  });
}

/**
 *
 */
function paso6() {
  verElemento("btnPaso6", false);
  verElemento("alimentarPerder", false);
  document.getElementById("alimentarPerder").disabled = false;
  inicioPaso7();
}

/**
 * Almacena los recursos excedentes en Silo
 */
function inicioPaso7() {
  verElemento("btnPaso7", true);
}

function paso7() {
  silo = produccion;
  produccion = 0;
  document.getElementById("silo").innerText = silo;
  produccion = 0;
  document.getElementById("totalPuntos").innerText = produccion;
  ronda += 1;
  verElemento("btnPaso7", false);
  verElemento("btnJugar", true);

  if (ronda === 6) {
    Swal.fire({
      icon: "success",
      title: "¡Felicidades!",
      text: "¡Ganaste!",
      confirmButtonText: "Jugar de Nuevo",
      allowOutsideClick: false,
    }).then((result) => {
      reiniciarVariables();
    });
  }
}

/**
 * Se ponen las variables de nuevo en ceros
 */
function reiniciarVariables() {
  document.getElementById("totalPuntos").innerText = 0;
  document.getElementById("totalPiscicola").innerText = 0;
  document.getElementById("totalHidroponia").innerText = 0;
  document.getElementById("totalSilo").innerText = 0;
  document.getElementById("totalCampos").innerText = 0;
  document.getElementById("dinero").innerText = 0;
  document.getElementById("silo").innerText = 0;
  document.getElementById("campos").innerText = 0;
  document.getElementById("desastre").innerText = "";
  document.getElementById("bomba").innerText = "Comprar bomba $1";
  document.getElementById("biofiltro").innerText = "Comprar biofiltro $1";

  biofiltro = false;
  bomba = false;
  produccion = 0;
  comidaAcuaponia = 0;
  comidaPiscicultura = 0;
  silo = 0;
  campos = 100;
  dinero = 0;
  vidaAcuaponia = 4;
  vidaPiscicultura = 3;

  document.getElementById("vidaAcuaponia").style =
    "width: " + (vidaAcuaponia / 4) * 100 + "%";
  document.getElementById("vidaPiscicultura").style =
    "width: " + (vidaPiscicultura / 3) * 100 + "%";

  verElemento("alimentarPerder", false);
  document.getElementById("alimentarPerder").disabled = false;
  verElemento("btnJugar", true);

  for (let i = 1; i <= 3; i++) {
    idPiscicola[i][1] = false;
  }
  mostrarAluvines();
}
