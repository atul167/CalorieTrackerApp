import { compare } from 'bcryptjs';
import React from 'react'
import axios from 'axios';
import config from '../config';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
function Tracker() {
    const [dailyData, setDailyData] = useState([]);
    const [error, setError] = useState('');
    const [text, setText] = useState('');
    const [profile, setProfile] = useState(null);  

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

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found. Please log in.');
            return;
        }

        // Fetch profile data
        axios.get(`${config.API_BASE_URL}/api/users/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            const { profile } = response.data;
            if (profile) {
                setProfile({
                    name: profile.name || '',
                    age: profile.age || '',
                    gender: profile.gender || '',
                    height: profile.height || '',
                    weight: profile.weight || ''
                });
            }
        })
        .catch(err => {
            console.error('Error fetching profile data:', err);
            setError('Failed to fetch profile data.');
        });

    }, []);

    const getDayLabel = (index, totalDays) => {
        const reversedIndex = totalDays - 1 - index;
        switch (reversedIndex) {
            case 0:
                return 'Today';
            case 1:
                return 'Yesterday';
            default:
                return `${reversedIndex} days ago`;
        }
    };

    if (error) return <p className="text-red-500">{error}</p>;
    if (!dailyData || dailyData.length === 0) return <p>No daily calorie data available.</p>;

    // Sort the data by date
    const sortedData = [...dailyData].sort((a, b) => new Date(a.date) - new Date(b.date));

    // Get the last 7 days (or less) of data
    const recentData = sortedData.slice(-1 * (Math.min(7, sortedData.length)));
    const caloriesData = recentData.map(entry => entry.totalCalories);

    const sum = caloriesData.reduce((acc, curr) => acc + curr, 0);
    const avg = sum / caloriesData.length;
    async function runAnalysis(avg) {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No token found. Please log in.');
                return;
            }
            const response = await axios.post(
                `${config.API_BASE_URL}/api/users/tracker`,
                {
                    avg,
                    profile
                },  
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = response.data.text;
            setText(data);
        } catch (error) {
            console.error("Error:", error);
        }
    }
    const handleAnalyzer = () => {
        runAnalysis(avg,profile);
    };
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Calorie Tracker Analysis</h2>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-700">Recent Calorie History</h3>
                    <div className="grid gap-3">
                        {caloriesData.map((calories, index) => (
                            <div
                                key={index}
                                className={`p-3 rounded-md flex justify-between items-center ${calories > 2500 ? 'bg-red-50' :
                                        calories >= 1500 && calories <= 2500 ? 'bg-yellow-50' :
                                            'bg-green-50'
                                    }`}
                            >
                                <span className="text-gray-600">{getDayLabel(index, caloriesData.length)}</span>
                                <span className="font-medium text-gray-800">{calories} calories</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className={`flex justify-between items-center p-4 rounded-md ${avg > 2500 ? 'bg-red-200' :
                            avg >= 1500 && avg <= 2500 ? 'bg-yellow-200' :
                                'bg-green-200'
                        }`}>
                        <span className="text-black font-medium">Average Daily Calories:</span>
                        <span className="text-black font-bold">{Math.round(avg)} calories</span>
                    </div>

                    <button
                        onClick={handleAnalyzer}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-md transition duration-200 ease-in-out"
                    >
                        Analyze My Intake Pattern
                    </button>

                    {text && (
                        <div className="mt-4 p-4 bg-green-50 rounded-md">
                            <h4 className="font-semibold text-green-800 mb-2">Analysis Result:</h4>
                            <p className="text-green-700">{text}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-6 p-4 border rounded-md">
                <h4 className="font-semibold text-gray-800 mb-3">Color Guide:</h4>
                <div className="space-y-2">
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-red-300 rounded mr-2"></div>
                        <span className="text-sm text-gray-600">Above 2500 calories - High intake</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-yellow-300 rounded mr-2"></div>
                        <span className="text-sm text-gray-600">1500-2500 calories - Moderate intake</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-green-300 rounded mr-2"></div>
                        <span className="text-sm text-gray-600">Below 1500 calories - Low intake</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Tracker

