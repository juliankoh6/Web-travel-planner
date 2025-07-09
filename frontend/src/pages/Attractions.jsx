import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Attractions = ({ country }) => {
  const [attractions, setAttractions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        const res = await axios.get(`https://web-travel-planner.onrender.com/api/attractions?country=${country}`);
        const sights = res.data.sights.slice(0, 6); // Only 6 results
        setAttractions(sights);
      } catch (err) {
        console.error('Failed to fetch attractions:', err.message);
        setError('Failed to load attractions');
      }
    };

    if (country) fetchAttractions();
  }, [country]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (attractions.length === 0) return <p>Loading attractions...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {attractions.map((item, i) => (
        <div key={i} className="bg-white shadow-md rounded-xl overflow-hidden">
          <img
            src={item.thumbnail || 'https://via.placeholder.com/300'}
            alt={item.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-bold">{item.title}</h3>
            <p className="text-sm text-gray-600">
              Rating: {item.rating || 'N/A'} — Reviews: {item.reviews || 'N/A'}
            </p>
            <p className="text-sm text-gray-600">{item.address || 'No address'}</p>
            {/* Optional Save Button */}
            {/* <button className="mt-2 bg-blue-500 text-white px-4 py-1 rounded">Save</button> */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Attractions;
