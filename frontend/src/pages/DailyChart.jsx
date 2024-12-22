import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2'; 
import { Chart as ChartJS } from 'chart.js/auto';
import config from '../config';
import dayjs from 'dayjs';
export default function MultiChart() {
  const [dailyData, setDailyData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in.');
      return;
    }

    axios.get(`${config.API_BASE_URL}/api/calories/getData`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(response => {
      // Assuming response.data.userCaloriedata is the array
      setDailyData(response.data.userCaloriedata);
    })
    .catch(err => {
      console.error('Error fetching daily data:', err);
      setError('Failed to fetch daily calorie data.');
    });
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!dailyData || dailyData.length === 0) return <p>No daily calorie data available.</p>;

  // Sort the data by date
  const sortedData = [...dailyData].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Format dates as "DD-MM-YYYY"
  const labels = sortedData.map(entry => dayjs(entry.date, 'YYYY-MM-DD').format('DD-MM-YYYY')).slice(-7);

  const caloriesData = sortedData.map(entry => entry.totalCalories).slice(-7);
  const proteinData = sortedData.map(entry => entry.protein || 0).slice(-7);
  const carbsData = sortedData.map(entry => entry.carbs || 0).slice(-7);
  const fatsData = sortedData.map(entry => entry.fats || 0).slice(-7);
  const fiberData = sortedData.map(entry => entry.fiber || 0).slice(-7);

  // Utility function to create chart data objects with custom colors
  const createChartData = (dataArr, labelText, borderColor, bgColor) => ({
    labels: labels,
    datasets: [
      {
        label: labelText,
        data: dataArr,
        borderColor: borderColor,
        backgroundColor: bgColor,
        fill: false,
      },
    ],
  });

  const baseOptions = (titleText) => ({
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: titleText },
    },
    scales: {
      x: { title: { display: true, text: 'Date' } },
      y: {
        beginAtZero: true, title: { display: true, text: titleText } },
    },
  });

  return (
    <div className="max-w-5xl mx-auto my-8 p-4  shadow-lg rounded-md space-y-8">
      <h1 className="text-3xl font-bold mb-4 text-center">Daily Nutrient & Calorie Trends</h1>

      {/* Calories Chart  */}
      <div className="bg-[#f8ffe7]">
        <h2 className="text-xl font-bold mb-2">Calories Over Time</h2>
        <Line 
          data={createChartData(caloriesData, 'Calories', 'rgba(255, 99, 132, 1)', 'rgba(255, 99, 132, 0.2)')} 
          options={baseOptions('Calories')} 
        />
      </div>

      {/* Protein Chart  */}
      <div className="bg-[#f8ffe7]">
        <h2 className="text-xl font-bold mb-2">Protein Over Time</h2>
        <Line 
          data={createChartData(proteinData, 'Protein (g)', 'rgba(54, 162, 235, 1)', 'rgba(54, 162, 235, 0.2)')} 
          options={baseOptions('Protein (g)')} 
        />
      </div>

      {/* Carbs Chart  */}
      <div className="bg-[#f8ffe7]">
        <h2 className="text-xl font-bold mb-2">Carbs Over Time</h2>
        <Line 
          data={createChartData(carbsData, 'Carbs (g)', 'rgba(255, 206, 86, 1)', 'rgba(255, 206, 86, 0.2)')} 
          options={baseOptions('Carbs (g)')} 
        />
      </div>

      {/* Fats Chart  */}
      <div className="bg-[#f8ffe7]">
        <h2 className="text-xl font-bold mb-2">Fats Over Time</h2>
        <Line 
          data={createChartData(fatsData, 'Fats (g)', 'rgba(75, 192, 192, 1)', 'rgba(75, 192, 192, 0.2)')} 
          options={baseOptions('Fats (g)')} 
        />
      </div>

      {/* Fiber Chart */}
      <div className="bg-[#f8ffe7]">
        <h2 className="text-xl font-bold mb-2">Fiber Over Time</h2>
        <Line 
          data={createChartData(fiberData, 'Fiber (g)', 'rgba(153, 102, 255, 1)', 'rgba(153, 102, 255, 0.2)')} 
          options={baseOptions('Fiber (g)')} 
        />
      </div>
    </div>
  );
}
