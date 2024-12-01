import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config';
import NumberFlow from '@number-flow/react'

export default function Dashboard() {
  const [selectedOption, setSelectedOption] = useState('Breakfast');
  const [userdata, setUserdata] = useState({});
  const [error, setError] = useState('');
  // console.log(userdata);
  const [calorie, setCalorie] = useState(() => {
    const savedCalorie = localStorage.getItem('calorie');
    return savedCalorie ? Number(savedCalorie) : 0;
  });

  const [stats, setStats] = useState(() => {
    const savedStats = localStorage.getItem('stats');
    return savedStats ? JSON.parse(savedStats) : { protein: 0, carbs: 0, fats: 0, fiber: 0 };
  });

  const [mealData, setMealData] = useState(() => {
    const savedMealData = localStorage.getItem('mealData');
    return savedMealData ? JSON.parse(savedMealData) : {
      Breakfast: [],
      Lunch: [],
      Evening: [],
      Dinner: [],
    };
  });
  const [foodName, setFoodName] = useState('');
  const [amount, setAmount] = useState('');


  // Save data to localStorage
  const saveToLocalStorage = () => {
    localStorage.setItem('calorie', calorie);
    localStorage.setItem('stats', JSON.stringify(stats));
    localStorage.setItem('mealData', JSON.stringify(mealData));
  };

  // Load data from localStorage
  const loadFromLocalStorage = () => {
    const savedCalorie = localStorage.getItem('calorie');
    const savedStats = localStorage.getItem('stats');
    const savedMealData = localStorage.getItem('mealData');

    if (savedCalorie !== null) setCalorie(Number(savedCalorie)); // Use Number() to convert string to number
    if (savedStats !== null) setStats(JSON.parse(savedStats));   // Parse JSON for stats
    if (savedMealData !== null) setMealData(JSON.parse(savedMealData)); // Parse JSON for mealData
  };

  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  useEffect(() => {
    saveToLocalStorage();
  }, [calorie, stats, mealData]);


  const parseAndUpdateStatsFromText = (text) => {
    if (!text) {
      console.error('Empty response text');
      return;
    }

    const currentStats = {};
    text.split(',').forEach((item) => {
      const [key, value] = item.split(':').map((str) => str.trim());
      currentStats[key] = parseFloat(value);
    });

    // Updating the states
    setCalorie((prevCalorie) => prevCalorie + currentStats.calories || 0);
    setStats((prevStats) => ({
      protein: (prevStats.protein || 0) + (currentStats.protein || 0),
      carbs: (prevStats.carbs || 0) + (currentStats.carbs || 0),
      fats: (prevStats.fats || 0) + (currentStats.fats || 0),
      fiber: (prevStats.fiber || 0) + (currentStats.fiber || 0),
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
        {
          headers: { Authorization: `Bearer ${token}` }, // Including token in headers
        }
      );
      const resultantText = response.data.text;
      parseAndUpdateStatsFromText(resultantText);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const handleAddFood = () => {
    if (!foodName.trim() || !amount.trim()) {
      alert('Please enter both food name and amount.');
      return;
    }

    // Create a new food entry
    const newFoodEntry = {
      name: foodName,
      amount: amount,
    };

    // Updating mealData with the new food entry under the selected meal type

    setMealData((prevData) => ({
      ...prevData,
      [selectedOption]: [...prevData[selectedOption], newFoodEntry],
    }));

    runGenerativeAI(newFoodEntry);
    // Clearing input fields
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
    // console.log(newApiKey);
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
  };

  return (
    <div className="min-h-screen bg-[#FFB9B9] flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Calorie Tracker</h1>

      <div className="bg-pink-100 p-8 rounded-lg shadow-lg max-w-4xl w-full grid grid-cols-2 gap-8">
        {/* Meal Selection Area */}
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

          {/* Food Name Input */}
          <div className="mb-4">
            <label htmlFor="foodName" className="block text-gray-700 text-sm font-bold mb-2">
              Food Name
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

          {/* Amount Input */}
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

          {/* Submit Button */}
          <button
            onClick={handleAddFood}
            className="bg-teal-500 text-white px-4 py-2 rounded-lg w-full font-bold shadow-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            Add Food
          </button>
        </div>


        {/* Calorie and API Key Section */}
        <div className="flex flex-col items-center">
          <div className="w-48 h-48 flex items-center justify-center mb-6">
            {/* Placeholder Image */}
            <img
              src="./eathealthy.png"
              alt="Meal Illustration"
              className="rounded-full"
            />
          </div>
          <p className="text-lg font-medium text-gray-700 mb-2">NET CALORIES</p>
          <p className="text-3xl font-bold text-gray-900"><NumberFlow value={calorie} /></p>
          <button className="mt-6 bg-teal-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-teal-600" onClick={handleUpdateApiKey}>
            Update your API key here
          </button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 m-4">
        {/* Protein */}
        <div className="bg-yellow-200 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800">Protein</h3>
          <p className="text-2xl font-bold text-gray-900"><NumberFlow value={stats.protein} />
          </p>
        </div>

        {/* Carbs */}
        <div className="bg-yellow-200 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800">Carbs</h3>
          <p className="text-2xl font-bold text-gray-900"><NumberFlow value={stats.carbs} /></p>
        </div>

        {/* Fiber */}
        <div className="bg-yellow-200 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800">Fiber</h3>
          <p className="text-2xl font-bold text-gray-900"><NumberFlow value={stats.fiber} /></p>
        </div>

        {/* Fat */}
        <div className="bg-yellow-200 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800">Fats</h3>
          <p className="text-2xl font-bold text-gray-900"><NumberFlow value={stats.fats} /></p>
        </div>
      </div>
      {/* Welcome Section */}
      <p className="m-4 text-gray-800 text-lg">
        Welcome, <span className="font-semibold">{userdata.email || 'user@example.com'}</span>
      </p>

      {/* Error Message */}
      {error && <p className="mt-4 text-red-500">{error}</p>}
      <footer className="mt-8 text-center text-gray-600">
        &copy; 2024 AI powered Calorie Tracker. All rights reserved.
      </footer>
    </div>

  );
}
