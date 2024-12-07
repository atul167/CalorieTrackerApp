import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config';
import NumberFlow from '@number-flow/react';
import { Line } from 'react-chartjs-2'; 
import dayjs from 'dayjs';

export default function Dashboard() {
  const [selectedOption, setSelectedOption] = useState('Breakfast');
  const [userdata, setUserdata] = useState({});
  const [error, setError] = useState('');
  const [foodName, setFoodName] = useState('');
  const [amount, setAmount] = useState('');
  const [dt, setDt] = useState('');
 
  const loadFromLocalStorage = () => {
    const savedDate = localStorage.getItem('savedDate');
    const today = dayjs().format('YYYY-MM-DD');

    // If no savedDate or it's a different day, clear localStorage
    if (!savedDate || savedDate !== today) {
      localStorage.removeItem('calorie');
      localStorage.removeItem('stats');
      localStorage.removeItem('mealData');
      localStorage.removeItem('savedDate');
      return {
        calorie: 0,
        stats: { protein: 0, carbs: 0, fats: 0, fiber: 0 },
        mealData: {
          Breakfast: [],
          Lunch: [],
          Evening: [],
          Dinner: [],
        },
      };
    }

    // Same day: load the data
    return {
      calorie: Number(localStorage.getItem('calorie')) || 0,
      stats: JSON.parse(localStorage.getItem('stats')) || { protein: 0, carbs: 0, fats: 0, fiber: 0 },
      mealData: JSON.parse(localStorage.getItem('mealData')) || {
        Breakfast: [],
        Lunch: [],
        Evening: [],
        Dinner: [],
      },
    };
  };

  const [calorie, setCalorie] = useState(() => {
    const data = loadFromLocalStorage();
    return data.calorie;
  });

  const [stats, setStats] = useState(() => {
    const data = loadFromLocalStorage();
    return data.stats;
  });

  const [mealData, setMealData] = useState(() => {
    const data = loadFromLocalStorage();
    return data.mealData;
  });

  const saveToLocalStorage = () => {
    const today = dayjs().format('YYYY-MM-DD');
    localStorage.setItem('calorie', calorie);
    localStorage.setItem('stats', JSON.stringify(stats));
    localStorage.setItem('mealData', JSON.stringify(mealData));
    localStorage.setItem('savedDate', today);
  };

  useEffect(() => {
    saveToLocalStorage();
  }, [calorie, stats, mealData]);

  useEffect(() => {
    setDt(dayjs().format('DD-MM-YYYY'));
  }
    , []);
  async function updateDailyCaloriesInDB(caloriesAdded, proteinAdded = 0, carbsAdded = 0, fatsAdded = 0, fiberAdded = 0) {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
      await axios.post(`${REACT_APP_API_BASE_URL}/api/calories/update`, {
        additionalCalories: caloriesAdded,
        additionalProtein: proteinAdded,
        additionalCarbs: carbsAdded,
        additionalFats: fatsAdded,
        additionalFiber: fiberAdded,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Error updating daily calories in DB:', error);
    }
  }

  //Uncomment this below code to see localstorage key
  // useEffect(() =>
  //   Object.keys(localStorage).forEach(key => {
  //     try {
  //       // Try to parse as JSON in case it's a stringified object
  //       const value = JSON.parse(localStorage.getItem(key));
  //       console.log(`${key}: `, value);
  //     } catch {
  //       // If not JSON, log as string
  //       console.log(`${key}: ${localStorage.getItem(key)}`);
  //     }
  //   }), []);
  
  const parseAndUpdateStatsFromText = (text) => {
    if (!text) return;
    const currentStats = {};
    text.split(',').forEach((item) => {
      const [key, value] = item.split(':').map((str) => str.trim());
      currentStats[key] = parseFloat(value);
    });

    const addedCalories = currentStats.calories || 0;
    setCalorie((prev) => {
      const newTotal = prev + addedCalories;
      updateDailyCaloriesInDB(addedCalories);
      return newTotal;
    });
    setStats((prev) => ({
      protein: (prev.protein || 0) + (currentStats.protein || 0),
      carbs: (prev.carbs || 0) + (currentStats.carbs || 0),
      fats: (prev.fats || 0) + (currentStats.fats || 0),
      fiber: (prev.fiber || 0) + (currentStats.fiber || 0),
    }));
  };

  async function runGenerativeAI(newFoodEntry) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in.');
        return;
      }
      const response = await axios.post(
        `${config.API_BASE_URL}/api/users/calculate-food-stats`,
        { name: newFoodEntry.name, amount: newFoodEntry.amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      parseAndUpdateStatsFromText(response.data.text);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const handleAddFood = () => {
    if (!foodName.trim() || !amount.trim()) {
      alert('Please enter both food name and amount.');
      return;
    }

    const newFoodEntry = { name: foodName, amount: amount };
    setMealData((prevData) => ({
      ...prevData,
      [selectedOption]: [...prevData[selectedOption], newFoodEntry],
    }));

    runGenerativeAI(newFoodEntry);
    setFoodName('');
    setAmount('');
  };

  useEffect(() => {
    async function getUserData() {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in.');
        return;
      }

      try {
        const response = await axios.get(`${config.API_BASE_URL}/api/users/get-user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserdata(response.data.user);
        setError('');
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch user data.');
      }
    } 
    getUserData();
  }, []);

  async function handleUpdateApiKey() {
    const newApiKey = prompt("Enter your new API key:");
    if (!newApiKey || newApiKey.trim() === "") {
      alert("API key cannot be empty.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }
      const response = await axios.post(
        `${config.API_BASE_URL}/api/users/update-api-key`,
        { geminiApiKey: newApiKey },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert("API key updated successfully.");
      } else {
        alert("Failed to update API key.");
      }
    } catch (error) {
      console.error("Error updating API key:", error.response?.data || error.message);
      alert("An error occurred while updating the API key.");
    }
  }

  return (
    <div className="min-h-screen bg-[#FFB9B9] flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Calorie Tracker</h1>
      <h3 className="text-2xl font-bold text-gray-800 mb-8">Today's date is {dt}</h3>
      <div className="bg-pink-100 p-8 rounded-lg shadow-lg max-w-4xl w-full grid grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Your Meal</h2>
          <select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            className="w-full p-3 bg-yellow-200 border border-yellow-300 rounded-lg text-gray-800"
          >
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Evening">Evening</option>
            <option value="Dinner">Dinner</option>
          </select>
          <p className="text-lg font-medium text-gray-700">Selected Meal: {selectedOption}</p>

          <div className="mb-4">
            <label htmlFor="foodName" className="block text-gray-700 text-sm font-bold mb-2">
              Meal/Food Name
            </label>
            <input
              type="text"
              id="foodName"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder="Enter food name (e.g., Dosa, Apple)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="amount" className="block text-gray-700 text-sm font-bold mb-2">
              Amount (with description and units)
            </label>
            <input
              type="text"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount (e.g., 200g or 1 plate)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
            />
          </div>

          <button
            onClick={handleAddFood}
            className="bg-teal-500 text-white px-4 py-2 rounded-lg w-full font-bold shadow-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            Add Food
          </button>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-48 h-48 flex items-center justify-center mb-6">
            <img src="./eathealthy.png" alt="Meal Illustration" className="rounded-full" />
          </div>
          <p className="text-lg font-medium text-gray-700 mb-2">NET CALORIES</p>
          <p className="text-3xl font-bold text-gray-900"><NumberFlow value={calorie} /></p>
          <button className="mt-6 bg-teal-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-teal-600" onClick={handleUpdateApiKey}>
            Update your API key here
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 m-4">
        <div className="bg-yellow-200 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800">Protein</h3>
          <p className="text-2xl font-bold text-gray-900"><NumberFlow value={stats.protein} /></p>
        </div>

        <div className="bg-yellow-200 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800">Carbs</h3>
          <p className="text-2xl font-bold text-gray-900"><NumberFlow value={stats.carbs} /></p>
        </div>

        <div className="bg-yellow-200 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800">Fiber</h3>
          <p className="text-2xl font-bold text-gray-900"><NumberFlow value={stats.fiber} /></p>
        </div>

        <div className="bg-yellow-200 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800">Fats</h3>
          <p className="text-2xl font-bold text-gray-900"><NumberFlow value={stats.fats} /></p>
        </div>
      </div>

      <p className="m-4 text-gray-800 text-lg">
        Welcome, <span className="font-semibold">{userdata.email || 'user@example.com'}</span>
      </p>
      <footer className="mt-8 text-center text-gray-600">
        &copy; 2024 AI powered Calorie Tracker. All rights reserved.
      </footer>
    </div>
  );
}
