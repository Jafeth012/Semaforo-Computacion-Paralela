// semaforoWorker.js -> Coordinador de Fases e Infracciones

let timer = null;
let faseActual = 0;
let tVerde = 5, tAmarillo = 2, tRojo = 5;
let simulacionActiva = true;

const FASES = {
  0: { norte: 'VERDE',    sur: 'ROJO',     este: 'ROJO',     oeste: 'ROJO' },
  1: { norte: 'AMARILLO', sur: 'ROJO',     este: 'ROJO',     oeste: 'ROJO' },
  2: { norte: 'ROJO',     sur: 'VERDE',    este: 'ROJO',     oeste: 'ROJO' },
  3: { norte: 'ROJO',     sur: 'AMARILLO', este: 'ROJO',     oeste: 'ROJO' },
  4: { norte: 'ROJO',     sur: 'ROJO',     este: 'VERDE',    oeste: 'ROJO' },
  5: { norte: 'ROJO',     sur: 'ROJO',     este: 'AMARILLO', oeste: 'ROJO' },
  6: { norte: 'ROJO',     sur: 'ROJO',     este: 'ROJO',     oeste: 'VERDE' },
  7: { norte: 'ROJO',     sur: 'ROJO',     este: 'ROJO',     oeste: 'AMARILLO' },
};

self.onmessage = function (e) {
  const { accion, tiempoVerde, tiempoAmarillo, tiempoRojo } = e.data;

  if (accion === 'ACTUALIZAR') {
    tVerde = tiempoVerde;
    tAmarillo = tiempoAmarillo;
    tRojo = tiempoRojo;
    if (simulacionActiva && !timer) ejecutarCiclo();
  }

  if (accion === 'REANUDAR') {
    simulacionActiva = true;
    faseActual = (faseActual + 1) % 8;
    ejecutarCiclo();
  }
};

function ejecutarCiclo() {
  if (!simulacionActiva) return;

  const lucesActuales = FASES[faseActual];
  
  const esFaseVerde = faseActual % 2 === 0;
  const provovarAccidente = esFaseVerde && Math.random() < 0.25;

  if (provovarAccidente) {

    let pistaImprudente = 'este';
    if (faseActual === 2) pistaImprudente = 'norte';
    if (faseActual === 4) pistaImprudente = 'oeste';
    if (faseActual === 6) pistaImprudente = 'sur';


    self.postMessage({
      tipo: 'PROXIMO_IMPRUDENTE',
      luces: lucesActuales,
      pistaImprudente: pistaImprudente
    });

    simulacionActiva = false;
    if (timer) clearTimeout(timer);
    return;
  }

  self.postMessage({ tipo: 'CAMBIO_LUCES', luces: lucesActuales });

  let tiempoEspera = (faseActual % 2 === 0) ? tVerde : tAmarillo;
  if (faseActual % 2 !== 0) tiempoEspera += (tRojo / 4);

  timer = setTimeout(() => {
    faseActual = (faseActual + 1) % 8;
    ejecutarCiclo();
  }, Math.floor(tiempoEspera) * 1000);
}