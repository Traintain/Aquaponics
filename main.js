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

let vidaAcuaponia = 3;
let vidaPiscicultura = 2;

let recogioCampos = false;

let infoRonda = {
  1: [3, "un huracán", 20, ""],
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
  1: ["img-alevinos-1", false],
  2: ["img-alevinos-2", false],
  3: ["img-peces-3", false],
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

function inicio() {
  document.getElementById("inicio").hidden = true;
  document.getElementById("tablero").hidden = false;

  Swal.fire({
    title: "¡Bienvenido!",
    text: "Bienvenido a Aquaponics. Tu objetivo es alimentar a 100 personas cada ronda. Para lograrlo debes usar la comida que producen tus campos y la comida de tu sistema de acuaponía, que mezcla peces y plantas",
    confirmButtonText: "Iniciar la primera ronda",
    allowOutsideClick: false,
  }).then(() => {
    inicioPaso1();
  });
}

function inicioPaso1() {
  document.getElementById("silo").innerText = silo;

  Swal.fire({
    title: "Ronda " + ronda,
    text:
      "En esta ronda recibirás $" +
      infoRonda[ronda][0] +
      ". Además, " +
      infoRonda[ronda][1] +
      " se aproxima. Estimamos que luego de que pase los campos solo podrán alimentar a " +
      (campos - infoRonda[ronda][2]) +
      " personas",
    confirmButtonText: "Continuar",
    allowOutsideClick: false,
  }).then(() => {
    verElemento("marco-dinero", true);
    document.getElementById("marco-dinero").className =
      "marco-clickeable d-flex align-items-center";
    verElemento("btnContinuar", false);
  });
}

/**
 * Cobrar dinero
 */
function paso1() {
  monto = infoRonda[ronda][0];
  dinero = monto + dinero;
  document.getElementById("dinero").innerText = "$" + dinero;
  document.getElementById("marco-dinero").className =
    "marco-transparente d-flex align-items-center";
  inicioPaso2();
}

/**
 * Construir filtro o bomba
 */
function inicioPaso2() {
  if (bomba === false) {
    verElemento("marco-bomba", true);
  }

  if (biofiltro === false) {
    verElemento("marco-biofiltro", true);
  }
  verElemento("btnContinuar", true);
  document.getElementById("btnContinuar").setAttribute("onClick", "paso2()");
}

/**
 * Construir bomba, parte del paso 2
 */
function comprarBomba() {
  if (dinero >= 1) {
    dinero -= 1;
    document.getElementById("dinero").innerText = "$" + dinero;
    bomba = true;
    verElemento("marco-bomba", false);
    verElemento("img-bomba", true);
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
    verElemento("marco-biofiltro", false);
    verElemento("img-biofiltro", true);
  }
}

/**
 * Fin del paso 2
 */
function paso2() {
  verElemento("marco-bomba", false);
  verElemento("marco-biofiltro", false);

  inicioPaso3();
}

/**
 * Mostrar botones para sembrar y para comprar alevines
 */
function inicioPaso3() {
  document.getElementById("btnContinuar").setAttribute("onClick", "paso3()");

  if (vidaAcuaponia > 0) {
    verElemento("btnCama1", true);
    verElemento("btnCama2", true);
    verElemento("btnCama3", true);
  }

  if (vidaPiscicultura > 0) {
    verElemento("btnComprarAlevines", true);
  }
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
  if (dinero >= 1) {
    dinero -= 1;
    document.getElementById("dinero").innerText = "$" + dinero;
    idBtn = idCama[cama][0];
    verElemento(idBtn, false);
    verElemento("img-plantula-" + cama, true);
    setCama(cama, true);
  }
}

/**
 * Muestra las imágenes de los peces que correspondan
 */
function mostrarAlevines() {
  for (let i = 1; i <= 3; i++) {
    if (idPiscicola[i][1] === true) {
      verElemento(idPiscicola[i][0], true);
    } else {
      verElemento(idPiscicola[i][0], false);
    }
  }
}

/**
 * Comprar alevines, parte del paso 3
 */
function comprarAlevines() {
  if (dinero >= 1 && vidaPiscicultura > 0 && idPiscicola[1][1] === false) {
    dinero -= 1;
    document.getElementById("dinero").innerText = "$" + dinero;
    idPiscicola[1][1] = true;
    mostrarAlevines();
    verElemento("btnComprarAlevines", false);
  }
}

/**
 * Desactiva los botones de las camas que no se compraron, parte del final del paso 3
 */
function desacivarCamasSinComprar() {
  for (let i = 1; i <= 3; i++) {
    verElemento(idCama[i][0], false);
  }
}

/**
 * Fin del paso 3
 */
function paso3() {
  desacivarCamasSinComprar();
  verElemento("btnComprarAlevines", false);
  inicioPaso4();
}

/**
 * Muestra botón para continuar luego del desastre y ocurre el desastre
 */
function inicioPaso4() {
  campos -= infoRonda[ronda][2];

  Swal.fire({
    title: "¡Desastre natural!",
    icon: "warning",
    text:
      "Sucedió " +
      infoRonda[ronda][1] +
      ", pierdes " +
      infoRonda[ronda][2] +
      " campos",
    confirmButtonText: "Continuar",
    allowOutsideClick: false,
  }).then(() => {
    if (ronda !== 5) {
      verElemento("img-desastre-" + ronda, true);
    }

    if (ronda === 4) {
      verElemento("img-desastre-5", true);
    }
    inicioPaso5();
  });
}

/**
 * Revisa si hay camas de cultivo o peces por recoger
 */
function hayRecursosPorRecoger() {
  hayRecursosPendientes = false;
  if (idPiscicola[3][1] === true && vidaPiscicultura > 0) {
    hayRecursosPendientes = true;
  } else if (campos !== 0 && !recogioCampos) {
    hayRecursosPendientes = true;
  } else {
    if (vidaAcuaponia > 0) {
      for (let i = 1; i <= 3 && !hayRecursosPendientes; i++) {
        if (idCama[i][1] === true) {
          hayRecursosPendientes = true;
        }
      }
    }
  }
  hayRecursosPendientes
    ? verElemento("btnContinuar", false)
    : verElemento("btnContinuar", true);
}

/**
 * Habilita opciones para avanzar cultivos y peces
 */
function inicioPaso5() {
  document.getElementById("btnContinuar").setAttribute("onClick", "paso5()");
  calcularDeterioro();
  avanzarRecursos();
}

/**
 * Avanza el deterioro en caso de que no haya biofiltro
 */
function calcularDeterioro() {
  if (biofiltro === false) {
    if (vidaAcuaponia !== 0) {
      vidaAcuaponia -= 1;
      verElemento("vida-hidro-" + vidaAcuaponia, true);
    }

    if (vidaPiscicultura !== 0) {
      vidaPiscicultura -= 1;
      verElemento("vida-tanque-" + vidaPiscicultura, true);
    }
  }
}

/**
 * Avanza las plántulas y los alevines en caso de que aún haya vida
 */
function avanzarRecursos() {
  if (vidaPiscicultura > 0) {
    if (idPiscicola[2][1] === true) {
      idPiscicola[2][1] = false;
      idPiscicola[3][1] = true;
    }

    if (idPiscicola[1][1] === true) {
      idPiscicola[1][1] = false;
      idPiscicola[2][1] = true;
    }
    mostrarAlevines();
  }

  if (vidaAcuaponia > 0) {
    for (let i = 1; i <= 3; i++) {
      if (idCama[i][1] === true) {
        verElemento("img-planta-" + i, true);
        verElemento("img-plantula-" + i, false);
      }
    }
  }

  if (campos !== 0) {
    verElemento("marco-terreno", true);
  }
  hayRecursosPorRecoger();
}

/**
 * Al cosechar una cama se suman sus ganancias a la comida de la ronda
 * Se establece la variable de la cama en false
 */
function cosechar(cama) {
  verElemento("img-planta-" + cama, false);
  bomba ? (comidaAcuaponia += 15) : (comidaAcuaponia += 10);

  //Establece la vaiable de la cama en false para que se pueda comprar en la siguiente ronda
  setCama(cama, false);

  document.getElementById("totalHidroponia").innerText = comidaAcuaponia;
  //Antes de seguir se debe comprobar que se hayan recogido todas las plantas y los alevines
  hayRecursosPorRecoger();
}

/**
 * Al recoger los peces se suman sus ganancias al silo
 * Se estima el deterioro de piscicola
 */
function recolectarPeces() {
  bomba ? (comidaPiscicultura += 70) : (comidaPiscicultura += 50);

  idPiscicola[3][1] = false;

  document.getElementById("totalPiscicola").innerText = comidaPiscicultura;

  //Antes de seguir se debe comprobar que se hayan recogido todas las plantas y los alevines
  mostrarAlevines();
  hayRecursosPorRecoger();
}

/**
 *
 */
function recogerCultivos() {
  verElemento("marco-terreno", false);
  document.getElementById("totalCampos").innerText = campos;
  recogioCampos = true;
  hayRecursosPorRecoger();
}

/**
 * Ya se recogieron todos los recursos disponibles
 */

function paso5() {
  document.getElementById("totalSilo").innerText = silo;
  document.getElementById("silo").innerText = 0;

  produccion = comidaAcuaponia + comidaPiscicultura + silo + campos;
  document.getElementById("totalPuntos").innerText = produccion;
  document
    .getElementById("btnContinuar")
    .setAttribute("onClick", "alimentar()");
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
    inicioPaso7();
  } else {
    // La persona perdió
    Swal.fire({
      icon: "warning",
      title: "¡¡Oh no!!!",
      text: "No cuentas con suficiete comida",
      confirmButtonText: "Jugar de Nuevo",
      allowOutsideClick: false,
    }).then(() => {
      reiniciarVariables();
    });
  }
}

/**
 * Se almacena el excedente, si lo hay, en el silo luego de alimentar
 */
function inicioPaso7() {
  if (produccion === 0) {
    paso7();
  } else {
    console.log("Inicio paso 7");
    silo = produccion;
    produccion = 0;
    document.getElementById("marco-silo").className =
      "marco-clickeable d-flex align-items-center";
    document.getElementById("marco-silo").setAttribute("onClick", "paso7()");
  }
}

/**
 * Se almacena el excedente en el silo y se inicia la siguiente ronda
 */
function paso7() {
  document.getElementById("totalPuntos").innerText = produccion;
  document.getElementById("marco-silo").className =
    "marco-transparente d-flex align-items-center";
  document
    .getElementById("btnContinuar")
    .setAttribute("onClick", "inicioPaso1()");
  document.getElementById("silo").innerText = silo;
  ronda += 1;

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
  } else {
    inicioPaso1();
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

  biofiltro = false;
  verElemento("img-biofiltro", false);
  bomba = false;
  verElemento("img-bomba", false);
  produccion = 0;
  comidaAcuaponia = 0;
  comidaPiscicultura = 0;
  silo = 0;
  campos = 100;
  dinero = 0;
  vidaAcuaponia = 3;
  vidaPiscicultura = 2;
  for (let i = 0; i < 2; i++) {
    verElemento("vida-hidro-" + i, false);
    verElemento("vida-tanque-" + i, false);
  }

  for (let i = 0; i <= 5; i++) {
    verElemento("img-desastre-" + i, false);
  }

  verElemento("vida-hidro-2", false);

  verElemento("btnContinuar", false);

  for (let i = 1; i <= 3; i++) {
    idPiscicola[i][1] = false;
  }
  mostrarAlevines();
  inicio();
}
