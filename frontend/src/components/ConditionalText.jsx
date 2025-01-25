import React from 'react';

function ConditionalText({ bmi, color }) {
    return (
        <div
            className="text-center p-4 m-2rounded-lg"
            style={{ backgroundColor: color || '#ffffff' }} 
        >
            <h2 className="text-xl font-bold">Your BMI: {bmi}</h2>
            <p>
                {bmi < 18.5
                    ? 'Underweight'
                    : bmi >= 18.5 && bmi <= 24.9
                    ? 'Healthy weight'
                    : bmi >= 25 && bmi <= 30
                    ? 'Overweight'
                    : 'Obese'}
            </p>
        </div>
    );
}

export default ConditionalText;
