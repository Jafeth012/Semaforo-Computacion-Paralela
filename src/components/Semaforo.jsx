import React from 'react';

export default function Semaforo({ titulo, luz }) {
  return (
    <div style={styles.container}>
      <div style={styles.titulo}>{titulo}</div>
      <div style={styles.caja}>
        <div style={{ ...styles.foco, ...(luz === 'ROJO' ? styles.focoRojo : {}) }} />
        <div style={{ ...styles.foco, ...(luz === 'AMARILLO' ? styles.focoAmarillo : {}) }} />
        <div style={{ ...styles.foco, ...(luz === 'VERDE' ? styles.focoVerde : {}) }} />
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '5px', zIndex: 10 },
  titulo: { fontWeight: 'bold', marginBottom: '4px', fontSize: '12px', color: '#fff', backgroundColor: '#111', padding: '2px 6px', borderRadius: '4px' },
  caja: { backgroundColor: '#1a1a1a', padding: '8px', borderRadius: '8px', width: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', border: '2px solid #444' },
  foco: { width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#222', transition: 'all 0.2s' },
  focoRojo: { backgroundColor: '#ff3b30', boxShadow: '0 0 14px #ff3b30' },
  focoAmarillo: { backgroundColor: '#ffcc00', boxShadow: '0 0 14px #ffcc00' },
  focoVerde: { backgroundColor: '#4cd964', boxShadow: '0 0 14px #4cd964' },
};