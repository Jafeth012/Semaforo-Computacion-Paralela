import React, { useState, useEffect, useRef } from 'react';
import Semaforo from './components/Semaforo';
import ControlPanel from './components/ControlPanel';
import Vehiculo from './components/Vehiculo';

export default function App() {
  const [luces, setLuces] = useState({ norte: 'ROJO', sur: 'ROJO', este: 'ROJO', oeste: 'ROJO' });
  const [tiempoVerde, setTiempoVerde] = useState('5');
  const [tiempoAmarillo, setTiempoAmarillo] = useState('2');
  const [tiempoRojo, setTiempoRojo] = useState('5');
  
  const [pistaImprudente, setPistaImprudente] = useState(null);
  const [huboAccidente, setHuboAccidente] = useState(false);

  const workerRef = useRef(null);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('./semaforoWorker.js', import.meta.url),
      { type: 'module' }
    );

    workerRef.current.onmessage = (e) => {
      const { tipo, luces: nuevasLuces, pistaImprudente: pistaPeligrosa } = e.data;
      
      if (tipo === 'CAMBIO_LUCES') {
        setLuces(nuevasLuces);
      } else if (tipo === 'PROXIMO_IMPRUDENTE') {
        setLuces(nuevasLuces);
        setPistaImprudente(pistaPeligrosa);
      }
    };

    return () => {
      if (workerRef.current) workerRef.current.terminate();
    };
  }, []);

  useEffect(() => {
    if (workerRef.current && !huboAccidente && !pistaImprudente) {
      workerRef.current.postMessage({
        accion: 'ACTUALIZAR',
        tiempoVerde: parseInt(tiempoVerde, 10) || 1,
        tiempoAmarillo: parseInt(tiempoAmarillo, 10) || 1,
        tiempoRojo: parseInt(tiempoRojo, 10) || 1,
      });
    }
  }, [tiempoVerde, tiempoAmarillo, tiempoRojo, huboAccidente, pistaImprudente]);

  const manejarImpactoFisico = () => {
    setHuboAccidente(true);
  };

  const reanudarTrafico = () => {
    setHuboAccidente(false);
    setPistaImprudente(null); 
    if (workerRef.current) {
      workerRef.current.postMessage({ accion: 'REANUDAR' });
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}> Cruce Cieneguita</h2>

      <ControlPanel 
        tiempoVerde={tiempoVerde} setTiempoVerde={setTiempoVerde}
        tiempoAmarillo={tiempoAmarillo} setTiempoAmarillo={setTiempoAmarillo}
        tiempoRojo={tiempoRojo} setTiempoRojo={setTiempoRojo}
      />

      {pistaImprudente && <div id="alerta-imprudente" style={{ display: 'none' }} />}

      {huboAccidente && (
        <div style={styles.alertaAccidente}>
          <span style={styles.textoAlerta}> ¡IMPRUDENTE! Un vehículo ignoró el alto y provocó un accidente.</span>
          <button style={styles.botonReanudar} onClick={reanudarTrafico}>
            Remover Colisión y Continuar Tránsito
          </button>
        </div>
      )}

      <div style={{ ...styles.interseccion, border: huboAccidente ? '4px solid #ff3b30' : '4px solid #333' }}>
        <div style={styles.autopistaVertical}>
          <div style={styles.lineaDivisoriaVertical} />
        </div>

        <div style={styles.autopistaHorizontal}>
          <div style={styles.lineaDivisoriaHorizontal} />
        </div>

        <Vehiculo pista="norte" luzSemaforo={luces.norte} huboAccidente={huboAccidente} esImprudente={pistaImprudente === 'norte'} alChocar={manejarImpactoFisico} />
        <Vehiculo pista="sur" luzSemaforo={luces.sur} huboAccidente={huboAccidente} esImprudente={pistaImprudente === 'sur'} alChocar={manejarImpactoFisico} />
        <Vehiculo pista="oeste" luzSemaforo={luces.oeste} huboAccidente={huboAccidente} esImprudente={pistaImprudente === 'oeste'} alChocar={manejarImpactoFisico} />
        <Vehiculo pista="este" luzSemaforo={luces.este} huboAccidente={huboAccidente} esImprudente={pistaImprudente === 'este'} alChocar={manejarImpactoFisico} />

        <div style={{ ...styles.posicionSemaforo, top: '15px', left: '50%', transform: 'translateX(-50%)' }}>
          <Semaforo titulo="Pista Norte" luz={luces.norte} />
        </div>
        <div style={{ ...styles.posicionSemaforo, bottom: '15px', left: '50%', transform: 'translateX(-50%)' }}>
          <Semaforo titulo="Pista Sur" luz={luces.sur} />
        </div>
        <div style={{ ...styles.posicionSemaforo, left: '15px', top: '50%', transform: 'translateY(-50%)' }}>
          <Semaforo titulo="Pista Oeste" luz={luces.oeste} />
        </div>
        <div style={{ ...styles.posicionSemaforo, right: '15px', top: '50%', transform: 'translateY(-50%)' }}>
          <Semaforo titulo="Pista Este" luz={luces.este} />
        </div>


        <div style={{ 
          ...styles.centroCruce, 
          backgroundColor: huboAccidente ? 'rgba(255, 59, 48, 0.6)' : '#333' 
        }}>
          {huboAccidente && <span style={{ fontSize: '28px' }}>💥</span>}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { fontFamily: 'Arial, sans-serif', backgroundColor: '#ebeb63', padding: '15px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', boxSizing: 'border-box' },
  header: { fontSize: '20px', fontWeight: 'bold', marginBottom: '15px', color: '#fff' },
  alertaAccidente: { backgroundColor: '#ff3b30', padding: '12px', borderRadius: '8px', marginBottom: '15px', width: '100%', maxWidth: '460px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(255,59,48,0.4)', zIndex: 100 },
  textoAlerta: { color: '#fff', fontWeight: 'bold', fontSize: '13px', textAlign: 'center' },
  botonReanudar: { backgroundColor: '#fff', color: '#ff3b30', border: 'none', padding: '6px 14px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' },
  interseccion: { position: 'relative', width: '360px', height: '360px', backgroundColor: '#2db01c', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' },
  autopistaVertical: { position: 'absolute', left: '35%', width: '30%', height: '100%', backgroundColor: '#333', display: 'flex', justifyContent: 'center' },
  autopistaHorizontal: { position: 'absolute', top: '35%', width: '100%', height: '30%', backgroundColor: '#333', display: 'flex', alignItems: 'center' },
  lineaDivisoriaVertical: { width: '2px', height: '100%', borderLeft: '2px dashed #ffcc00' },
  lineaDivisoriaHorizontal: { width: '100%', height: '2px', borderTop: '2px dashed #ffcc00' },
  centroCruce: { position: 'absolute', top: '35%', left: '35%', width: '30%', height: '30%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  posicionSemaforo: { position: 'absolute', zIndex: 20 },
};