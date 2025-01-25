
import React, { useEffect } from 'react'
import { useState } from 'react';
import { ConditionalText } from '../components';
function Bmi() {
    const [weight, setWeight] = useState(0);
    const [height, setHeight] = useState(0);
    const [bmi, setBmi] = useState(0);
    const [color, setColor] = useState('#ffffff');
    function handleBMIcalc() {
        if (weight && height)
            setBmi(1.0 * weight / (height * height));
        
    }
    useEffect(() => {
        if (bmi < 18.5)
            setColor('#87CEEB');
        else if (bmi >= 18.5 && bmi <= 24.9)
            setColor('#90EE90');
        else if (bmi >= 25 && bmi <= 30)
            setColor('#FF6347');
        else
            setColor('#8B0000') 
    },[bmi])
    return (
        <div className="flex flex-col items-center justify-center mx-auto h-screen bg-gray-100">
            <div className="p-6  bg-white rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-4">BMI Calculator</h1>
                <div className="mb-4">
                    <label className="block text-gray-700">Weight (kg):</label>
                    <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="border rounded w-full py-2 px-3 text-gray-700"
                        placeholder="Enter your weight"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Height (m):</label>
                    <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="border rounded w-full py-2 px-3 text-gray-700"
                        placeholder="Enter your height"
                    />
                </div>
                <div className='flex flex-col items-center m-2   '>
                <button
                    onClick={handleBMIcalc}
                    className="bg-blue-500 text-white py-2 px-4  rounded hover:bg-blue-600 shadow-md"
                >
                    Calculate BMI
                </button>
                </div>
                
                {bmi>0 && (
                        <ConditionalText bmi={bmi} color={color} />
                )}
            </div>
        </div>
    );
}

export default Bmi;