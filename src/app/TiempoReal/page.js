"use client"; // Garantiza que React se ejecute en modo cliente
import React, { useEffect, useState } from 'react';
import mqtt from 'mqtt'; // Uso de ES6 para la importación

const Dashboard = () => {
  const [latestData, setLatestData] = useState({}); // Almacena el último dato recibido
  const [client, setClient] = useState(null); // Almacena la instancia del cliente MQTT

  useEffect(() => {
    // Configuración del cliente MQTT
    const mqttURL = 'wss://broker.emqx.io:8084/mqtt'; // Conexión WebSocket segura
    const mqttOptions = {
      clean: true,
      connectTimeout: 4000,
      clientId: `mqttx_${Math.random().toString(16).substr(2, 8)}`, // ID de cliente único
    };

    // Conectar al broker MQTT
    const mqttClient = mqtt.connect(mqttURL, mqttOptions);
    setClient(mqttClient); // Guardar el cliente en el estado

    mqttClient.on('connect', () => {
      console.log('Conectado al broker MQTT');
      mqttClient.subscribe('g7/f3/sensores', (err) => {
        if (!err) {
          console.log('Suscrito al tópico g7/f3/sensores');
        } else {
          console.error('Error al suscribirse:', err);
        }
      });
    });

    // Manejar mensajes recibidos
    mqttClient.on('message', (topic, message) => {
      console.log(`Mensaje recibido en ${topic}:`, message.toString());
      const parsedData = JSON.parse(message.toString());
      setLatestData(parsedData); // Actualizar estado con los datos recibidos
    });

    // Limpiar conexión cuando el componente se desmonte
    return () => {
      if (mqttClient) mqttClient.end();
    };
  }, []); // Efecto que solo se ejecuta una vez al montar el componente

  const EncenderLuz = () => {
    if (client) {
      //const message = { comando: 'luz' }; // Mensaje a enviar
      const message = 'encender'; // Mensaje a enviar
      client.publish('parqueo/luces', JSON.stringify(message), (err) => {
        if (!err) {
          console.log('Mensaje publicado:', message);
        } else {
          console.error('Error al publicar mensaje:', err);
        }
      });
    }
  };

  const ApagarLuz = () => {
    if (client) {
      //const message = { comando: 'luz' }; // Mensaje a enviar
      const message = 'apagar'; // Mensaje a enviar
      client.publish('parqueo/luces', JSON.stringify(message), (err) => {
        if (!err) {
          console.log('Mensaje publicado:', message);
        } else {
          console.error('Error al publicar mensaje:', err);
        }
      });
    }
  };

  const Talanquera = () => {
    if (client) {
      //const message = { comando: 'luz' }; // Mensaje a enviar
      const message = 'abrir'; // Mensaje a enviar
      client.publish('parqueo/acceso', JSON.stringify(message), (err) => {
        if (!err) {
          console.log('Mensaje publicado:', message);
        } else {
          console.error('Error al publicar mensaje:', err);
        }
      });
    }
  };

  const DataCard = ({ label, value, bgColor, borderColor }) => (
    <div
      style={{
        padding: '20px',
        backgroundColor: bgColor,
        borderRadius: '10px',
        textAlign: 'center',
        minWidth: '120px',
        border: `4px solid ${borderColor}`, // Borde del color más oscuro
      }}
    >
      <h3 style={{ color: 'black' }}>{label}</h3>
      <p style={{ color: 'black', fontSize: '20px' }}>{value}</p>
    </div>
  );

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: 'white', marginBottom: '30px' }}>Lecturas en Tiempo Real</h1> {/* Margen inferior para separar el título */}

      {latestData && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            marginBottom: '20px',
            color: 'black',
          }}
        >
          <DataCard label="Temperatura" value={`${latestData.temperatura} °C`} bgColor="#ff9999" borderColor="#cc6666" />
          <DataCard label="Humedad" value={`${latestData.humedad} %`} bgColor="#99ccff" borderColor="#6699cc" />
          <DataCard label="Distancia" value={`${latestData.distancia} cm`} bgColor="#99ff99" borderColor="#66cc66" />
          <DataCard label="CO2" value={`${latestData.co2} ppm`} bgColor="#ffcc66" borderColor="#cc9933" />
          <DataCard label="Luz" value={`${latestData.luz} lx`} bgColor="#cccccc" borderColor="#999999" />
        </div>
      )}

      <div style={{ textAlign: 'center' }}> {/* Centra el botón */}
        <button
          onClick={EncenderLuz}
          style={{
            backgroundColor: '#4CAF50', // Color de fondo
            color: 'white', // Color del texto
            padding: '15px 32px', // Espaciado interno
            fontSize: '16px', // Tamaño de fuente
            border: '5px solid #388E3C', // Borde del botón con un tono más oscuro de verde
            borderRadius: '12px', // Bordes redondeados
            cursor: 'pointer', // Cambia el cursor al pasar sobre el botón
            marginTop: '20px', // Margen superior
          }}
        >
          Encender de Luz
        </button>
      </div>

      <div style={{ textAlign: 'center' }}> {/* Centra el botón */}
        <button
          onClick={ApagarLuz}
          style={{
            backgroundColor: '#4CAF50', // Color de fondo
            color: 'white', // Color del texto
            padding: '15px 32px', // Espaciado interno
            fontSize: '16px', // Tamaño de fuente
            border: '5px solid #388E3C', // Borde del botón con un tono más oscuro de verde
            borderRadius: '12px', // Bordes redondeados
            cursor: 'pointer', // Cambia el cursor al pasar sobre el botón
            marginTop: '20px', // Margen superior
          }}
        >
          Apagar Luz
        </button>
      </div>

      <div style={{ textAlign: 'center' }}> {/* Centra el botón */}
        <button
          onClick={Talanquera}
          style={{
            backgroundColor: '#3b1ee0', // Color de fondo
            color: 'white', // Color del texto
            padding: '15px 32px', // Espaciado interno
            fontSize: '16px', // Tamaño de fuente
            border: '5px solid #000084', // Borde del botón con un tono más oscuro de verde
            borderRadius: '12px', // Bordes redondeados
            cursor: 'pointer', // Cambia el cursor al pasar sobre el botón
            marginTop: '20px', // Margen superior
          }}
        >
          Parqueo
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
