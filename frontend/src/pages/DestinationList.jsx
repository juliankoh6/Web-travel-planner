import React, { useState } from 'react';

const DestinationList = ({ destinations, onSave, onLearn }) => {
  const [learnInfo, setLearnInfo] = useState({});
  const [openInfoIndex, setOpenInfoIndex] = useState(null);

  const handleLearnClick = async (place, idx) => {
    if (openInfoIndex === idx) {
      setOpenInfoIndex(null);
      return;
    }

    try {
      const snippet = await onLearn(place.title);
      setLearnInfo(prev => ({ ...prev, [idx]: snippet }));
      setOpenInfoIndex(idx);
    } catch (err) {
      setLearnInfo(prev => ({ ...prev, [idx]: 'Failed to load more info.' }));
      setOpenInfoIndex(idx);
    }
  };

  const topSix = destinations.slice(0, 6);
  if (!topSix.length) {
    return <p style={{ marginTop: '20px', color: 'gray' }}>No search results yet.</p>;
  }

  return (
    <div style={{ marginTop: '40px' }}>
      <h2>✨ Top Attractions</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {topSix.map((place, idx) => (
          <div
            key={idx}
            style={{
              width: '300px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '10px',
              backgroundColor: '#fff',
              position: 'relative'
            }}
          >
            <img
              src={place.image || place.thumbnail || 'https://via.placeholder.com/300x200?text=No+Image'}
              alt={place.title}
              style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '6px' }}
            />
            <h3>{place.title}</h3>
            <p>{place.description}</p>
            {place.rating && (
              <p style={{ fontSize: '14px' }}>
                ⭐ <strong>{place.rating}</strong> ({place.reviews || '0'} reviews)
              </p>
            )}
            {place.price && (
              <p style={{ fontSize: '14px', color: '#333' }}>💰 {place.price}</p>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
              <button
                onClick={() => onSave(place)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#007bff',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >
                Save
              </button>

              <button
                onClick={() => handleLearnClick(place, idx)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#28a745',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >
                {openInfoIndex === idx ? 'Hide' : 'Learn'}
              </button>
            </div>

            {openInfoIndex === idx && (
              <div
                style={{
                  marginTop: '10px',
                  padding: '10px',
                  backgroundColor: '#f9f9f9',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              >
                {learnInfo[idx]}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DestinationList;
