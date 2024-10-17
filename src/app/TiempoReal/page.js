"use client"; // Asegúrate de que React funcione en modo cliente
import React, { useEffect, useState } from 'react';
import mqtt from 'mqtt'; // Usa la sintaxis de importación de ES6

const Dashboard = () => {
  const [latestData, setLatestData] = useState({}); // Para almacenar el último dato
  const [client, setClient] = useState(null); // Para almacenar la instancia del cliente MQTT

  useEffect(() => {
    // Configuración del cliente MQTT
    const url = 'wss://broker.emqx.io:8084/mqtt'; // WebSocket seguro (wss)
    const options = {
      clean: true,
      connectTimeout: 4000,
      clientId: 'mqttx_' + Math.random().toString(16).substr(2, 8), // Generar un clientId único
    };

    // Conectar al broker MQTT
    const mqttClient = mqtt.connect(url, options);
    setClient(mqttClient); // Guardar el cliente en el estado

    mqttClient.on('connect', () => {
      console.log('Conectado al broker MQTT');
      // Suscribirse al tópico
      mqttClient.subscribe('g7/f3/sensores', (err) => {
        if (!err) {
          console.log('Suscrito al tópico g7/f3/sensores');
        }
      });
    });

    // Manejar los mensajes recibidos
    mqttClient.on('message', (topic, message) => {
      console.log('Mensaje recibido:', message.toString());
      // Aquí actualizamos el estado con los datos recibidos del mensaje
      const parsedData = JSON.parse(message.toString());
      setLatestData(parsedData); // Actualizar el estado con el último dato recibido
    });

    // Limpiar la conexión MQTT cuando se desmonte el componente
    return () => {
      if (mqttClient) {
        mqttClient.end();
      }
    };
  }, []); // Solo ejecuta este efecto una vez al montar el componente

  // Función para publicar un mensaje al tópico 'g7/f3/control'
  const publishMessage = () => {
    if (client) {
      const message = { comando: 'luz' }; // El mensaje que queremos enviar
      client.publish('g7/f3/control', JSON.stringify(message), (err) => {
        if (!err) {
          console.log('Mensaje publicado:', message);
        }
      });
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: 'white' }}>Lecturas en Tiempo Real</h1>

      {/* Sección de datos en tiempo real */}
      {latestData && (
        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px', color: 'black' }}>
          <div style={{ padding: '20px', backgroundColor: '#ff9999', borderRadius: '10px', textAlign: 'center', minWidth: '120px' }}>
            <h3 style={{ color: 'white' }}>Temperatura</h3>
            <p style={{ color: 'white', fontSize: '20px' }}>{latestData.temperatura} °C</p>
          </div>
          <div style={{ padding: '20px', backgroundColor: '#99ccff', borderRadius: '10px', textAlign: 'center', minWidth: '120px' }}>
            <h3 style={{ color: 'white' }}>Humedad</h3>
            <p style={{ color: 'white', fontSize: '20px' }}>{latestData.humedad} %</p>
          </div>
          <div style={{ padding: '20px', backgroundColor: '#99ff99', borderRadius: '10px', textAlign: 'center', minWidth: '120px' }}>
            <h3 style={{ color: 'white' }}>Distancia</h3>
            <p style={{ color: 'white', fontSize: '20px' }}>{latestData.distancia} cm</p>
          </div>
          <div style={{ padding: '20px', backgroundColor: '#ffcc66', borderRadius: '10px', textAlign: 'center', minWidth: '120px' }}>
            <h3 style={{ color: 'white' }}>CO2</h3>
            <p style={{ color: 'white', fontSize: '20px' }}>{latestData.co2} ppm</p>
          </div>
          <div style={{ padding: '20px', backgroundColor: '#cccccc', borderRadius: '10px', textAlign: 'center', minWidth: '120px' }}>
            <h3 style={{ color: 'white' }}>Luz</h3>
            <p style={{ color: 'white', fontSize: '20px' }}>{latestData.luz} lx</p>
          </div>
        </div>
      )}

      {/* Botón para publicar un mensaje */}
      <button
        onClick={publishMessage}
        style={{
          backgroundColor: '#4CAF50', /* Color de fondo */
          color: 'white', /* Color del texto */
          padding: '15px 32px', /* Espaciado interno */
          fontSize: '16px', /* Tamaño de la fuente */
          border: 'none', /* Sin borde */
          borderRadius: '12px', /* Bordes redondeados */
          cursor: 'pointer', /* Cambia el cursor al pasar sobre el botón */
          marginTop: '20px', /* Margen superior */
        }}
      >
        Control de Luz
      </button>
    </div>
  );
};

export default Dashboard;
