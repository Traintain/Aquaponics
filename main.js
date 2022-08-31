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

let infoRonda = {
  1: [3, "Huracán", 20],
  2: [4, "Terremoto", 20],
  3: [3, "Inundación", 40],
  4: [2, "Plaga", 20],
  5: [1, "Sequía", 0],
};

const idCama = {
  1: "btnCama1",
  2: "btnCama2",
  3: "btnCama3",
};

function jugar() {
  document.getElementById("campos").innerText = campos;
  document.getElementById("btnJugar").hidden = true;
  btnPaso1 = document.getElementById("btnPaso1");
  btnPaso1.hidden = false;
}

/**
 * Cobrar dinero
 */
function paso1() {
  monto = infoRonda[ronda][0];
  dinero = monto + dinero;
  document.getElementById("dinero").innerText = "$" + dinero;
  paso += 1;
  btnPaso1 = document.getElementById("btnPaso1");
  btnPaso1.hidden = true;
  inicioPaso2();
}

/**
 * Construir filtro o bomba
 */
function inicioPaso2() {
  if (bomba === false) {
    btnBomba = document.getElementById("btnPaso2Bomba");
    btnBomba.hidden = false;
  }

  if (biofiltro === false) {
    btnBiofiltro = document.getElementById("btnPaso2Biofiltro");
    btnBiofiltro.hidden = false;
  }

  btnContinuar = document.getElementById("btnPaso2");
  btnContinuar.hidden = false;
}

/**
 * Construir bomba
 */
function comprarBomba() {
  if (dinero >= 1) {
    dinero -= 1;
    document.getElementById("dinero").innerText = "$" + dinero;
    bomba = true;
    btnBomba = document.getElementById("btnPaso2Bomba");
    btnBomba.hidden = true;

    icono = document.getElementById("bomba");
    icono.innerText = "Bomba comprada";
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
    btnBiofiltro = document.getElementById("btnPaso2Biofiltro");
    btnBiofiltro.hidden = true;

    icono = document.getElementById("biofiltro");
    icono.innerText = "Biofiltro comprado";
  }
}

/**
 * Fin del paso 2
 */
function paso2() {
  paso += 1;
  btnBomba = document.getElementById("btnPaso2Bomba");
  btnBomba.hidden = true;
  btnBiofiltro = document.getElementById("btnPaso2Biofiltro");
  btnBiofiltro.hidden = true;
  btnContinuar = document.getElementById("btnPaso2");
  btnContinuar.hidden = true;

  inicioPaso3();
}

/**
 * Mostrar botones para sembrar y para comprar aluvines
 */
function inicioPaso3() {
  btnContinuar = document.getElementById("btnPaso3");
  btnContinuar.hidden = false;
  btnCama1 = document.getElementById("btnCama1");
  btnCama1.hidden = false;
  btnCama2 = document.getElementById("btnCama2");
  btnCama2.hidden = false;
  btnCama3 = document.getElementById("btnCama3");
  btnCama3.hidden = false;
  btnAluvines = document.getElementById("btnComprarAluvines");
  btnAluvines.hidden = false;
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
 * Sembrar aluvines
 */
function paso3() {
  paso += 1;
  btnContinuar = document.getElementById("btnPaso3");
  btnContinuar.hidden = true;

  inicioPaso4();
}

/**
 * Muestra botón para continuar luego del desastre y ocurre el desastre
 */
function inicioPaso4() {
  btnContinuar = document.getElementById("btnPaso4");
  btnContinuar.hidden = false;
  campos -= infoRonda[ronda][2];
  document.getElementById("campos").innerText = campos;
  document.getElementById("desastre").innerText =
    "Sucedió un " +
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
  btnContinuar = document.getElementById("btnPaso4");
  btnContinuar.hidden = true;

  inicioPaso5();
}

/**
 * Muestra botón para continuar luego del desastre y ocurre el desastre
 */
function inicioPaso5() {
  btnContinuar = document.getElementById("btnPaso5");
  btnContinuar.hidden = false;
}

/**
 * Avanzar luego de que pasa el desastre natural
 */
function paso5() {
  paso += 1;
  btnContinuar = document.getElementById("btnPaso5");
  btnContinuar.hidden = true;

  inicioPaso5();
}

/**
 * Actualiza botones para cosechar y baja la vida si se usaron las camas hidropónicas y los tanques de piscicultura
 */
function inicioPaso6() {
  btnContinuar = document.getElementById("btnPaso5");
  btnContinuar.hidden = false;
}

/**
 * Ocurre desastre natural
 */
function paso6() {
  paso += 1;
  btnContinuar = document.getElementById("btnPaso5");
  btnContinuar.hidden = true;

  inicioPaso7();
}
