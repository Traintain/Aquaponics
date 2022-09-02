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


//let sebradaCama1 = false;

let cama1 = false;
let cama2 = false;
let cama3 = false;

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

const idPiscicula = {
  1: false,
  2: false,
  3: false
}

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
 * Establece el valor del boolean de la variable de cada cama
 * recibe la cama y el booleano que se debe asignarle
 */
function setCama(cama, valor){
  id = idCama[cama]
  if(id === "btnCama1"){
    cama1 = valor;
  }
  if(id === "btnCama2"){
    cama2 = valor;
  }
  if(id === "btnCama3"){
    cama3 = valor;
  }
}


/**
 * Sembrar plántulas
 */
function sembrar(cama) {
  if (dinero >= 1 && vidaAcuaponia > 0) {
    dinero -= 1;
    document.getElementById("dinero").innerText = "$" + dinero;
    idBtn = idCama[cama];
    document.getElementById(idBtn).innerText = "La planta está creciendo...";
    setCama(cama, true);
    document.getElementById(idBtn).setAttribute("onClick", "avanzarPlantas()");
    document.getElementById(idBtn).disabled = true;
  }
}

/**
 * Sembrar aluvines
 */
function comprarPeces() {
  if (dinero >= 1 && vidaPiscicultura > 0 && idPiscicula[1] === false) {
    dinero -= 1;
    document.getElementById("dinero").innerText = "$" + dinero;
    idPiscicula[0] = true;
    document.getElementById("btnComprarAluvines").innerText =
      "Los aluvines están creciendo...";
    document.getElementById("btnComprarAluvines").onclick = function() {avanzarPeces()};
    document.getElementById("btnComprarAluvines").disabled = true;
  }
}

/**
 * Desactiva los botones de las camas que no se compraron
 */
function desacivarCamasSinComprar(){
  if(cama1 === false){
    document.getElementById("btnCama1").hidden = true;
  }
  if(cama2 === false){
    document.getElementById("btnCama2").hidden = true;
  }
  if(cama3 === false){
    document.getElementById("btnCama3").hidden = true;
  }
}

/**
 * Fin del paso 3
 */
function paso3() {
  paso += 1;
  document.getElementById("btnPaso3").hidden = true;
  desacivarCamasSinComprar();
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
 * Fin del paso 4
 */
function paso4() {
  paso += 1;
  document.getElementById("btnPaso4").hidden = true;

  inicioPaso5();
}

/**
 * Habilita opciones para avanzar cultivos y peces
 */
function inicioPaso5() {
  document.getElementById("btnPaso5").hidden = false;
  document.getElementById("btnComprarAluvines").disabled = false;
  
  if(cama1 === true){
    document.getElementById("btnCama1").disabled = false;
    document.getElementById("btnCama1").innerText = "¡Planta lista!";
    document.getElementById("btnCama1").setAttribute("onClick", "cosechar()");
  }
  if(cama2 === true){
    document.getElementById("btnCama2").disabled = false;
    document.getElementById("btnCama2").innerText = "¡Planta lista!";
    document.getElementById("btnCama2").setAttribute("onClick", "cosechar()");
  }
  if(cama3 === true){
    document.getElementById("btnCama3").disabled = false;
    document.getElementById("btnCama3").innerText = "¡Planta lista!";
    document.getElementById("btnCama3").setAttribute("onClick", "cosechar()");
  }

  avanzarPlantas(cama1);
  avanzarPlantas(cama2);
  avanzarPlantas(cama3);

  avanzarPeces();
}

/**
 * TODO - revisar disabled en boton comprar aluvines, ¿si se deshabilitan al avanzar nuevos a etapa dos, como se recogen los que avanzan de etapa dos a tres?
 */
function avanzarPeces() {
  if(idPiscicula[2] === true) {
    document.getElementById("btnComprarAluvines").innerText = 
    "¡Pescados listos!";
    idPiscicula[2] = false;
    idPiscicula[3] = true;
    document.getElementById("btnComprarAluvines").disabled = true;
  }

  if(idPiscicula[1] === true) {
    document.getElementById("btnComprarAluvines").innerText = 
    "Aluvines en etapa 2 de crecimiento...";
    idPiscicula[1] = false;
    idPiscicula[2] = true;
    document.getElementById("btnComprarAluvines").disabled = true;
  }
}



/**
 * Fin del Paso 5
 */
function paso5() {
  paso += 1;
  document.getElementById("btnPaso5").hidden = true;

  inicioPaso6();
}

/**
 * TODO
 */
function inicioPaso6() {
  document.getElementById("btnPaso6").hidden = false;
}


/**
 * Al cosechar una cama se suman sus ganancias al silo
 * Se estima el deterioro de acuaponia
 * Se establece la variable de la cama en false
 */
function cosechar(cama){
  id = idCama[cama]
  
  comida = 10
  if(bomba === true){ comida += 5}
  
  document.getElementById(id).innerText = "Sembrar plántulas $1";
  //Establece la vaiable de la cama en false para que se pueda comprar en la siguiente ronda
  setCama(cama, false);
  //Reduce la barra de vida
  if(biofiltro === false){document.getElementById("vidaAcuaponia").ariaValueNow = "75";}

  document.getElementById("silo").innerText = silo + comida;
}

/**
 * Al recoger los peces se suman sus ganancias al silo
 * Se estima el deterioro de piscicola
 * TODO - Verificar cuantos peces se pueden tener al tiempo
 */
function recolectar(){
  comida = 50
  if(bomba === true){ comida += 20}
  
  document.getElementById(id).innerText = "Comprar aluvines $1";
  //Reduce la barra de vida
  if(biofiltro === false){document.getElementById("vidaPiscicultura").ariaValueNow = "66";}

  document.getElementById("silo").innerText = silo + comida;
}


//Mandar alimento a Puntaje, no a Silo



/**
 * Fin del paso 6
 */
function paso6() {
  paso += 1;

  document.getElementById("btnPaso6").hidden = true;
  inicioPaso7();
}

/**
 * Inicio paso 7, alimentar personas
 */
function inicioPaso7() {
  document.getElementById("btnPaso7").hidden = false;
}

/**
 * TODO - agregar boton para reinicial el juego al haber perdido
 *        con id: btnPerdiste
 */
function alimentar(){
  if(silo < 100){
    document.getElementById("btnPerdiste").hidden = false;
    document.getElementById("btnPerdiste").innerText = "¡¡Oh no!! \n No cuentas con suficiete comida :C";
    perder = true;
  }
  else{
    silo = silo - 100;
  }

}

/**
 * Paso 8: iniciar siguiente ronda
 */
function paso8() {
  document.getElementById("btnJugar").hidden = false;
}