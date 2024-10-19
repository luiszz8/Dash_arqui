"use client"; // Asegúrate de agregar esto al principio del archivo

import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [barData, setBarData] = useState({
    labels: [],
    datasets: [],
  });

  const [lineData, setLineData] = useState({
    labels: [],
    datasets: [],
  });

  const [co2LineData, setCo2LineData] = useState({
    labels: [],
    datasets: [],
  });

  const [lightAreaData, setLightAreaData] = useState({
    labels: [],
    datasets: [],
  });

  const [dias, setDias] = useState(3); // Estado para almacenar la cantidad de días
  const [prediccionData, setPrediccionData] = useState([]); // Para almacenar los datos de predicción

  // Función para consumir la API de predicción y actualizar las gráficas
  const fetchPrediccionData = async () => {
    try {
      // Consumir la API para obtener la predicción
      const diasInt = parseInt(dias, 10);
      const response = await fetch('https://valid-perfectly-crayfish.ngrok-free.app/prediccion_climatica', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'dias':diasInt }), // Mandar el número de días
      });

      if (!response.ok) {
        throw new Error('Error en la API de predicción climática');
      }

      // Consumir la API para obtener las predicciones y graficar
      const prediccionResponse = await fetch('https://valid-perfectly-crayfish.ngrok-free.app/ver_predicciones');
      const prediccionData = await prediccionResponse.json();
      setPrediccionData(prediccionData); // Guardar los datos de predicción
      updateChartData(prediccionData); // Actualizar las gráficas con los datos de predicción

    } catch (error) {
      console.error('Error al obtener los datos de predicción:', error);
    }
  };

  const updateChartData = (data) => {
    const labels = data.map(item => item.fecha);
    const humedad = data.map(item => item.humedad_prediccion);
    const temperatura = data.map(item => item.temperatura_prediccion);
    const co2 = data.map(item => item.co2_prediccion);
    const luz = data.map(item => item.luz_prediccion);

    // Actualizar datos de la gráfica de barras (Humedad y Temperatura)
    setBarData({
      labels,
      datasets: [
        {
          label: 'Humedad',
          data: humedad,
          backgroundColor: 'rgba(54, 162, 235, 0.2)', // Color para humedad
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
        {
          label: 'Temperatura',
          data: temperatura,
          backgroundColor: 'rgba(255, 99, 132, 0.2)', // Color para temperatura
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    });

    // Actualizar datos de la gráfica de línea (CO2)
    setCo2LineData({
      labels,
      datasets: [
        {
          label: 'CO2',
          data: co2,
          fill: false,
          borderColor: 'rgba(153, 102, 255, 1)',
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          tension: 0.1, // Para suavizar la línea
        },
      ],
    });

    // Actualizar datos de la gráfica de área (Luz)
    setLightAreaData({
      labels,
      datasets: [
        {
          label: 'Luz',
          data: luz,
          fill: true,
          backgroundColor: 'rgba(255, 206, 86, 0.2)', // Color semitransparente para el área
          borderColor: 'rgba(255, 206, 86, 1)', // Color de la línea
          tension: 0.3, // Para suavizar la curva
        },
      ],
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard de Predicción Climática</h1>

      {/* Formulario para ingresar los días y obtener predicciones */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchPrediccionData();
        }}
        style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <label>
          Días de predicción:
          <input
            type="number"
            value={dias}
            onChange={(e) => setDias(e.target.value)}
            required
            style={{ color: 'black', marginLeft: '10px' }}
          />
        </label>
        <button type="submit" style={{ marginLeft: '10px' }}>Obtener Predicción</button>
      </form>

      <div style={{ width: '80%', margin: '0 auto' }}>
        {/* Gráfica de Barras para Humedad y Temperatura */}
        <Bar
          data={barData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              title: { display: true, text: 'Predicciones de Temperatura y Humedad' },
            },
            scales: {
              x: {
                grid: { color: '#e0e0e0' }, // Color de las líneas del eje X
                ticks: { display: false },  // Ocultar etiquetas en el eje X
              },
              y: { grid: { color: '#e0e0e0' } }, // Color de las líneas del eje Y
            },
          }}
        />
      </div>

      {/* Gráfica de Línea para el CO2 */}
      <div style={{ width: '80%', margin: '0 auto', marginTop: '50px' }}>
        <Line
          data={co2LineData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              title: { display: true, text: 'Predicciones de CO2' },
            },
            scales: {
              x: {
                grid: { color: '#e0e0e0' }, // Color de las líneas del eje X
                ticks: { display: false },  // Ocultar etiquetas en el eje X
              },
              y: { grid: { color: '#e0e0e0' } }, // Color de las líneas del eje Y
            },
          }}
        />
      </div>

      {/* Gráfica de Área para la Luz */}
      <div style={{ width: '80%', margin: '0 auto', marginTop: '50px' }}>
        <Line
          data={lightAreaData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              title: { display: true, text: 'Predicciones de Luz' },
            },
            scales: {
              x: {
                grid: { color: '#e0e0e0' }, // Color de las líneas del eje X
                ticks: { display: false },  // Ocultar etiquetas en el eje X
              },
              y: { grid: { color: '#e0e0e0' } }, // Color de las líneas del eje Y
            },
          }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
