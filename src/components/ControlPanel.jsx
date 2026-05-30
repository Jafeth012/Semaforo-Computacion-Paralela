import React from 'react';

export default function ControlPanel({ 
  tiempoVerde, setTiempoVerde, 
  tiempoAmarillo, setTiempoAmarillo,
  tiempoRojo, setTiempoRojo 
}) {
  
  const validarEntrada = (valor, asignarEstado) => {
    // Permite vacío para que el usuario pueda borrar con el teclado
    if (valor === '') {
      asignarEstado('');
      return;
    }

    // Valida enteros positivos y prohíbe ceros a la izquierda (permite '0' pero no '02')
    if (/^(0|[1-9]\d*)$/.test(valor)) {
      const numero = parseInt(valor, 10);
      // Número de segundos máximo - 10 segundos
      if (numero <= 10) {
        asignarEstado(valor);
      }
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.title}> Configuración del Cruce de Cieneguita </div>
      <p style={styles.subtext}> Solo números enteros positivos (Máx 10s). </p>
      
      <div style={styles.flexInputs}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Tiempo Verde (s):</label>
          <input
            style={{ ...styles.input, borderLeft: '4px solid #4cd964' }}
            type="text"
            inputMode="numeric"
            value={tiempoVerde}
            onChange={(e) => validarEntrada(e.target.value, setTiempoVerde)}
          />
        </div>
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>Tiempo Amarillo (s):</label>
          <input
            style={{ ...styles.input, borderLeft: '4px solid #ffcc00' }}
            type="text"
            inputMode="numeric"
            value={tiempoAmarillo}
            onChange={(e) => validarEntrada(e.target.value, setTiempoAmarillo)}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Tiempo Rojo (s):</label>
          <input
            style={{ ...styles.input, borderLeft: '4px solid #ff3b30' }}
            type="text"
            inputMode="numeric"
            value={tiempoRojo}
            onChange={(e) => validarEntrada(e.target.value, setTiempoRojo)}
          />
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: { backgroundColor: '#2a2a35', padding: '15px', borderRadius: '10px', marginBottom: '15px', width: '100%', maxWidth: '460px', boxSizing: 'border-box', border: '1px solid #3a3a45' },
  title: { fontWeight: 'bold', fontSize: '16px', color: '#fff' },
  subtext: { color: '#ffcc00', fontSize: '11px', margin: '2px 0 12px 0' },
  flexInputs: { display: 'flex', gap: '12px' },
  inputGroup: { flex: 1 },
  label: { color: '#aaa', fontSize: '11px', display: 'block', marginBottom: '4px' },
  input: { backgroundColor: '#3a3a45', color: '#fff', border: '1px solid #555', padding: '8px', borderRadius: '5px', width: '100%', boxSizing: 'border-box', textAlign: 'center', fontSize: '14px', outline: 'none' },
};
