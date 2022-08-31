let ronda = 1;
let paso = 1;
let silo = 0;
let dinero = 0;
let campos = 100;
let perder = false;
let biofiltro = false;
let bomba = false;
let vidaAcuaponia = 4;
let vidaPiscicultura = 3;
let sebradaCama1 = false;

let infoRonda = {
  1: [3, "un huracán", 20],
  2: [4, "un terremoto", 20],
  3: [3, "una inundación", 20],
  4: [2, "una plaga", 40],
  5: [1, "una sequía", 0],
};

const idCama = {
  1: "btnCama1",
  2: "btnCama2",
  3: "btnCama3",
};

function jugar() {
  document.getElementById("campos").innerText = campos;
  document.getElementById("silo").innerText = silo;
  document.getElementById("btnJugar").hidden = true;
  document.getElementById("btnPaso1").hidden = false;
}

/**
 * Cobrar dinero
 */
function paso1() {
  monto = infoRonda[ronda][0];
  dinero = monto + dinero;
  document.getElementById("dinero").innerText = "$" + dinero;
  paso += 1;
  document.getElementById("btnPaso1").hidden = true;
  inicioPaso2();
}

/**
 * Construir filtro o bomba
 */
function inicioPaso2() {
  if (bomba === false) {
    document.getElementById("btnPaso2Bomba").hidden = false;
  }

  if (biofiltro === false) {
    document.getElementById("btnPaso2Biofiltro").hidden = false;
  }

  document.getElementById("btnPaso2").hidden = false;
}

/**
 * Construir bomba
 */
function comprarBomba() {
  if (dinero >= 1) {
    dinero -= 1;
    document.getElementById("dinero").innerText = "$" + dinero;
    bomba = true;
    document.getElementById("btnPaso2Bomba").hidden = true;

    document.getElementById("bomba").innerText =
      "Bomba comprada. Al recircular el agua tu producción aumenta";
  }
}

/**
 * Construir biofiltro
 */
function comprarBiofiltro() {
  if (dinero >= 1) {
    dinero -= 1;
    document.getElementById("dinero").innerText = "$" + dinero;
    biofiltro = true;
    document.getElementById("btnPaso2Biofiltro").hidden = true;

    document.getElementById("biofiltro").innerText =
      "Biofiltro comprado. Evita el deterioro";
  }
}

/**
 * Fin del paso 2
 */
function paso2() {
  paso += 1;
  document.getElementById("btnPaso2Bomba").hidden = true;
  document.getElementById("btnPaso2Biofiltro").hidden = true;
  document.getElementById("btnPaso2").hidden = true;

  inicioPaso3();
}

/**
 * Mostrar botones para sembrar y para comprar aluvines
 */
function inicioPaso3() {
  document.getElementById("btnPaso3").hidden = false;
  document.getElementById("btnCama1").hidden = false;
  document.getElementById("btnCama2").hidden = false;
  document.getElementById("btnCama3").hidden = false;
  document.getElementById("btnComprarAluvines").hidden = false;
}

/**
 * Sembrar plántulas
 */
function sembrar(cama) {
  if (dinero >= 1) {
    dinero -= 1;
    document.getElementById("dinero").innerText = "$" + dinero;
    idBtn = idCama[cama];
    document.getElementById(idBtn).innerText = "La planta está creciendo...";
    document.getElementById(idBtn).disabled = true;
  }
}

/**
 * Sembrar aluvines
 */
function comprarPeces() {
  if (dinero >= 1) {
    dinero -= 1;
    document.getElementById("dinero").innerText = "$" + dinero;
    document.getElementById("btnComprarAluvines").innerText =
      "Los aluvines están creciendo...";
    document.getElementById("btnComprarAluvines").disabled = true;
  }
}

/**
 * Fin del paso 3
 */
function paso3() {
  paso += 1;
  document.getElementById("btnPaso3").hidden = true;

  inicioPaso4();
}

/**
 * Muestra botón para continuar luego del desastre y ocurre el desastre
 */
function inicioPaso4() {
  document.getElementById("btnPaso4").hidden = false;
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
 * Ocurre desastre natural
 */
function paso4() {
  paso += 1;
  document.getElementById("btnPaso4").hidden = true;

  inicioPaso5();
}

/**
 * TODO
 */
function inicioPaso5() {}

/**
 * TODO
 */
function paso5() {}

/**
 * TODO
 */
function inicioPaso6() {}

/**
 * TODO
 */
function paso6() {}

/**
 * TODO
 */
function inicioPaso7() {}

/**
 * TODO
 */
function paso7() {
  document.getElementById("btnJugar").hidden = false;
}
