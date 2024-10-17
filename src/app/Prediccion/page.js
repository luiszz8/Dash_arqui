"use client"; // Asegúrate de agregar esto al principio del archivo

import React, { useState } from 'react';
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

  const [dias, setDias] = useState(1); // Estado para almacenar los días ingresados
  const [data, setData] = useState([]); // Para almacenar los datos de predicciones

  // Función para consumir la API de predicciones con el valor de días
  const fetchPredictions = async () => {
    try {
      /*const response = await fetch('https://valid-perfectly-crayfish.ngrok-free.app/prediccion_climatica', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dias }), // Enviar los días como parte del cuerpo de la solicitud
      });

      const apiData = await response.json();
      setData(apiData); // Guardar los datos recibidos
      updateChartData(apiData); // Actualizar las gráficas con los nuevos datos
        */
      // Ahora consumimos la segunda API
      fetchPredictionResults();
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  // Función para consumir la segunda API de predicciones
  const fetchPredictionResults = async () => {
    try {
      const response = await fetch('https://valid-perfectly-crayfish.ngrok-free.app/ver_predicciones');
      const predictionData = await response.json();
      updatePredictionChartData(predictionData); // Actualizamos las gráficas con los nuevos datos
    } catch (error) {
      console.error('Error al obtener los datos de predicción:', error);
    }
  };

  // Función para actualizar las gráficas con los datos de la primera API
  const updateChartData = (apiData) => {
    const labels = apiData.map(item => item.fecha);
    const humedad = apiData.map(item => item.humedad);
    const temperatura = apiData.map(item => item.temperatura);
    const distancia = apiData.map(item => item.distancia);
    const co2 = apiData.map(item => item.co2);
    const luz = apiData.map(item => item.luz);

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

    // Actualizar datos de la gráfica de línea (Distancia)
    setLineData({
      labels,
      datasets: [
        {
          label: 'Distancia',
          data: distancia,
          fill: false,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1, // Para suavizar la línea
        },
      ],
    });

    // Actualizar datos de la gráfica de línea transparente (CO2)
    setCo2LineData({
      labels,
      datasets: [
        {
          label: 'CO2',
          data: co2,
          fill: false, // No llenar debajo de la línea
          borderColor: 'rgba(0, 0, 0, 0)', // Hacer la línea transparente
          backgroundColor: 'rgba(153, 102, 255, 1)', // Color para los puntos de CO2
          pointBorderColor: 'rgba(153, 102, 255, 1)', // Color de los bordes de los puntos
          pointBackgroundColor: 'rgba(153, 102, 255, 1)', // Color de los puntos
          pointRadius: 5, // Tamaño de los puntos
          pointHoverRadius: 7, // Tamaño al pasar el mouse
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
          fill: true, // Rellenar el área debajo de la línea
          backgroundColor: 'rgba(255, 206, 86, 0.2)', // Color semitransparente para el área
          borderColor: 'rgba(255, 206, 86, 1)', // Color de la línea
          tension: 0.3, // Para suavizar la curva
        },
      ],
    });
  };

  // Función para actualizar las gráficas con los datos de la segunda API
  const updatePredictionChartData = (predictionData) => {
    const labels = predictionData.map(item => item.fecha);
    const co2 = predictionData.map(item => item.co2_prediccion);
    const humedad = predictionData.map(item => item.humedad_prediccion);
    const temperatura = predictionData.map(item => item.temperatura_prediccion);
    const luz = predictionData.map(item => item.luz_prediccion);

    // Actualizar la gráfica de barras con las predicciones de temperatura y humedad
    setBarData(prevData => ({
      ...prevData,
      datasets: [
        ...prevData.datasets,
        {
          label: 'Humedad Predicción',
          data: humedad,
          backgroundColor: 'rgba(75, 192, 192, 0.2)', // Color para predicción de humedad
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
        {
          label: 'Temperatura Predicción',
          data: temperatura,
          backgroundColor: 'rgba(255, 159, 64, 0.2)', // Color para predicción de temperatura
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 1,
        },
      ],
    }));

    // Actualizar la gráfica de CO2 con las predicciones
    setCo2LineData(prevData => ({
      ...prevData,
      datasets: [
        ...prevData.datasets,
        {
          label: 'CO2 Predicción',
          data: co2,
          fill: false,
          borderColor: 'rgba(255, 159, 64, 1)',
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          pointBorderColor: 'rgba(255, 159, 64, 1)',
          pointBackgroundColor: 'rgba(255, 159, 64, 1)',
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    }));

    // Actualizar la gráfica de luz con las predicciones
    setLightAreaData(prevData => ({
      ...prevData,
      datasets: [
        ...prevData.datasets,
        {
          label: 'Luz Predicción',
          data: luz,
          fill: true,
          backgroundColor: 'rgba(255, 206, 86, 0.2)', // Color semitransparente para el área de predicción
          borderColor: 'rgba(255, 206, 86, 1)',
          tension: 0.3,
        },
      ],
    }));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard de Predicciones</h1>

      {/* Formulario para ingresar el número de días */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchPredictions();
        }}
        style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <label>
          Días:
          <input
            type="number"
            value={dias}
            onChange={(e) => setDias(e.target.value)}
            required
            style={{ color: 'black', marginLeft: '10px' }}
          />
        </label>
        <button type="submit" style={{ marginLeft: '10px' }}>Obtener Predicciones</button>
      </form>

      <div style={{ width: '80%', margin: '0 auto' }}>
        {/* Gráfica de Barras para Humedad y Temperatura */}
        <Bar
          data={barData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              title: { display: true, text: 'Lecturas de Temperatura y Humedad' },
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

      {/* Gráfica de Línea para la distancia */}
      <div style={{ width: '80%', margin: '0 auto', marginTop: '50px' }}>
        <Line
          data={lineData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              title: { display: true, text: 'Lecturas de Distancia' },
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

      {/* Gráfica de Línea transparente para CO2 */}
      <div style={{ width: '80%', margin: '0 auto', marginTop: '50px' }}>
        <Line
          data={co2LineData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              title: { display: true, text: 'Lecturas de CO2' },
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

      {/* Nueva gráfica de área para la luz */}
      <div style={{ width: '80%', margin: '0 auto', marginTop: '50px' }}>
        <Line
          data={lightAreaData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              title: { display: true, text: 'Lecturas de Luz' },
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
