import { compare } from 'bcryptjs';
import React from 'react'
import axios from 'axios';
import config from '../config';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
function Tracker() {
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
    
    // Get the last 7 days (or less) of data
    const recentData = sortedData.slice(-1*(Math.min(7, sortedData.length)));
    const caloriesData = recentData.map(entry => entry.totalCalories);

    const sum = caloriesData.reduce((acc, curr) => acc + curr, 0);
    const avg = sum / caloriesData.length;

  return (
    <div>
      {caloriesData.map((calories, index) => (
        <div key={index}>
              <p>Calories: {calories}</p>
          </div>
      ))}
          
    </div>
  )
}

export default Tracker

