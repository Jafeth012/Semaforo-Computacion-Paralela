import React, { useEffect, useState } from 'react';

export default function Vehiculo({ pista, luzSemaforo, huboAccidente, esImprudente, alChocar }) {
  const [posicion, setPosicion] = useState(-40);
  const [puedeAvanzarEnVerde, setPuedeAvanzarEnVerde] = useState(false);

  // El tiempo de reacción de los vehículos es 0.5 segundos de retraso al cambiar a verde para que no se toquen los vehiculos
  useEffect(() => {
    if (luzSemaforo === 'VERDE' && !huboAccidente) {
      const timerReaccion = setTimeout(() => {
        setPuedeAvanzarEnVerde(true);
      }, 500); // 500 ms = 0.5s
      return () => clearTimeout(timerReaccion);
    } else {
      setPuedeAvanzarEnVerde(false);
    }
  }, [luzSemaforo, huboAccidente]);

  // Reinicia el carro si el accidente se limpia y reaparece al inicio
  useEffect(() => {
    if (!huboAccidente && posicion > 120 && posicion < 200) {
      setPosicion(-40);
    }
  }, [huboAccidente]);

  useEffect(() => {
    if (huboAccidente) return; 

    const intervalo = setInterval(() => {
      setPosicion((posPrev) => {
        const enLineaDeParada = posPrev >= 85 && posPrev <= 95;
        const enPuntoDeChoque = posPrev >= 135 && posPrev <= 145;

        //  Detecta si hubo una colisión en el centro de la pista
        if (enPuntoDeChoque && esImprudente) {
          clearInterval(intervalo);
          alChocar(); 
          return posPrev;
        }
        
        // Si lleva la vía y el imprudente se le estrella en el centro
        if (enPuntoDeChoque && luzSemaforo === 'VERDE' && document.getElementById('alerta-imprudente')) {
          clearInterval(intervalo);
          return posPrev;
        }

        // Este es el control del semáforo normal
        if (luzSemaforo === 'ROJO' && enLineaDeParada && !esImprudente) {
          return posPrev;
        }

        // Valida que si el semáforo está en verde pero no ha cumplido el tiempo de reacción, no avanza de la línea
        if (luzSemaforo === 'VERDE' && enLineaDeParada && !puedeAvanzarEnVerde && !esImprudente) {
          return posPrev;
        }

        if (posPrev > 380) {
          return -40; // Reaparecer de forma infinita
        }

        return posPrev + 5; // Velocidad de avance
      });
    }, 30);

    return () => clearInterval(intervalo);
  }, [luzSemaforo, huboAccidente, esImprudente, puedeAvanzarEnVerde]);

  const obtenerEstilosEstáticos = () => {
    const colorCarro = esImprudente ? '#ff0055' : 
                       (pista === 'norte' ? '#3498db' : 
                        pista === 'sur' ? '#e67e22' : 
                        pista === 'oeste' ? '#9b59b6' : '#1abc9c');

    switch (pista) {
      case 'norte': return { top: `${posicion}px`, left: '42%', width: '16px', height: '28px', backgroundColor: colorCarro };
      case 'sur':   return { bottom: `${posicion}px`, right: '42%', width: '16px', height: '28px', backgroundColor: colorCarro };
      case 'oeste': return { left: `${posicion}px`, top: '42%', width: '28px', height: '16px', backgroundColor: colorCarro };
      case 'este':  return { right: `${posicion}px`, bottom: '42%', width: '28px', height: '16px', backgroundColor: colorCarro };
      default: return {};
    }
  };

  return (
    <div style={{ ...styles.carro, ...obtenerEstilosEstáticos() }}>
      <div style={{
        ...styles.parabrisas,
        ...(pista === 'norte' && { top: '4px', width: '100%', height: '4px' }),
        ...(pista === 'sur' && { bottom: '4px', width: '100%', height: '4px' }),
        ...(pista === 'oeste' && { right: '4px', height: '100%', width: '4px' }),
        ...(pista === 'este' && { left: '4px', height: '100%', width: '4px' }),
      }} />
      {esImprudente && <span style={styles.badgeImprudente}>⚡</span>}
    </div>
  );
}

const styles = {
  carro: { position: 'absolute', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.4)', boxShadow: '0 3px 6px rgba(0,0,0,0.3)', zIndex: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  parabrisas: { position: 'absolute', backgroundColor: '#fff', opacity: 0.8 },
  badgeImprudente: { fontSize: '10px', color: '#fff', fontWeight: 'bold', zIndex: 16 }
};