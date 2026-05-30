import React from 'react';

function ControlPanel({ iniciarSimulacion, detenerSimulacion, estaCorriendo, velocidad, cambiarVelocidad }) {
  return (
    <div className="control-panel" style={{ padding: '20px', background: '#222', borderRadius: '8px', color: '#fff' }}>
      <h2>Panel de Control</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <button 
          onClick={iniciarSimulacion} 
          disabled={estaCorriendo}
          style={{ marginRight: '10px', padding: '10px 20px', cursor: estaCorriendo ? 'not-allowed' : 'pointer' }}
        >
          Iniciar
        </button>
        <button 
          onClick={detenerSimulacion} 
          disabled={!estaCorriendo}
          style={{ padding: '10px 20px', cursor: !estaCorriendo ? 'not-allowed' : 'pointer' }}
        >
          Detener
        </button>
      </div>

      <div>
        <label>Velocidad de Simulación: </label>
        <input 
          type="range" 
          min="1" 
          max="5" 
          value={velocidad} 
          onChange={(e) => cambiarVelocidad(Number(e.target.value))} 
        />
        <span style={{ marginLeft: '10px' }}>{velocidad}x</span>
      </div>
    </div>
  );
}

export default ControlPanel;
