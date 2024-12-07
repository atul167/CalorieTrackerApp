import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config';

export default function Profile() {
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in.');
      return;
    }

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in.');
      return;
    }

    // Convert numeric fields properly
    const payload = {
      name: profile.name,
      age: profile.age ? Number(profile.age) : undefined,
      gender: profile.gender,
      height: profile.height ? Number(profile.height) : undefined,
      weight: profile.weight ? Number(profile.weight) : undefined
    };

    axios.post(`${config.API_BASE_URL}/api/users/profile`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      alert('Profile updated successfully!');
    })
    .catch(err => {
      console.error('Error updating profile:', err);
      setError('Failed to update profile.');
    });
  };

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-md mx-auto my-8 p-4 bg-white shadow-lg rounded-md">
      <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Name
          </label>
          <input 
            type="text" 
            name="name" 
            value={profile.name} 
            onChange={handleChange} 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Age
          </label>
          <input 
            type="number" 
            name="age" 
            value={profile.age} 
            onChange={handleChange} 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Gender
          </label>
          <input 
            type="text" 
            name="gender" 
            value={profile.gender} 
            onChange={handleChange} 
            placeholder="e.g. male, female, other"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Height (cm)
          </label>
          <input 
            type="number" 
            name="height" 
            value={profile.height} 
            onChange={handleChange} 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Weight (kg)
          </label>
          <input 
            type="number" 
            name="weight" 
            value={profile.weight} 
            onChange={handleChange} 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button 
          onClick={handleSave} 
          className="mt-4 bg-teal-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-teal-600"
        >
          Save
        </button>
      </div>
    </div>
  );
}
