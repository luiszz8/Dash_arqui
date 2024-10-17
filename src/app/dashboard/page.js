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

  const [data, setData] = useState([]); // Para almacenar todos los datos sin filtrar
  const [filteredData, setFilteredData] = useState([]); // Para almacenar los datos filtrados
  const [startDate, setStartDate] = useState(''); // Estado para la fecha de inicio
  const [endDate, setEndDate] = useState(''); // Estado para la fecha de fin

  // Función para consumir la API y actualizar los datos
  const fetchData = async () => {
    try {
      const response = await fetch('https://valid-perfectly-crayfish.ngrok-free.app/historial');
      const apiData = await response.json();
      setData(apiData); // Guardar los datos sin filtrar

      // Si ya hay un filtro aplicado, volver a aplicar el filtro
      if (startDate && endDate) {
        applyFilter(apiData); // Aplica el filtro a los nuevos datos
      } else {
        updateChartData(apiData); // Si no hay filtro, actualiza con todos los datos
      }
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    // Configurar el intervalo para que se ejecute cada 2 segundos
    const intervalId = setInterval(fetchData, 2000);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, [startDate, endDate]); // El efecto dependerá de las fechas de inicio y fin

  const updateChartData = (filteredData) => {
    const labels = filteredData.map(item => item.fecha);
    const humedad = filteredData.map(item => item.humedad);
    const temperatura = filteredData.map(item => item.temperatura);
    const distancia = filteredData.map(item => item.distancia);
    const co2 = filteredData.map(item => item.co2);
    const luz = filteredData.map(item => item.luz);

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

  // Función para filtrar los datos según el rango de fechas
  const handleFilter = (e) => {
    e.preventDefault();
    applyFilter(data);
  };

  const applyFilter = (dataToFilter) => {
    // Filtrar datos por rango de fechas
    const filteredData = dataToFilter.filter((item) => {
      const itemDate = new Date(item.fecha.split(' ')[0].split('-').reverse().join('-')); // Convertir fecha a formato Date
      const start = new Date(startDate);
      const end = new Date(endDate);

      return itemDate >= start && itemDate <= end;
    });

    setFilteredData(filteredData);
    updateChartData(filteredData);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard de Sensores</h1>

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

      {/* Formulario para filtrar por rango de fechas */}
      <form onSubmit={handleFilter} style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <label>
          Fecha de inicio:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            style={{ color: 'black' }}
          />
        </label>
        <label style={{ marginLeft: '10px' }}>
          Fecha de fin:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            style={{ color: 'black' }}
          />
        </label>
        <button type="submit" style={{ marginLeft: '10px' }}>Filtrar</button>
      </form>

    </div>
  );
};

export default Dashboard;
