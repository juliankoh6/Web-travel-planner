import React from 'react';

const SavedList = ({ saved, onDelete }) => {
  return (
    <div style={{ marginTop: '40px' }}>
      <h2>📌 Saved Destinations</h2>
      {saved.length === 0 && <p>No saved destinations.</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {saved.map((place) => (
          <div
            key={place._id}
            style={{
              width: '300px',
              border: '1px solid #aaa',
              padding: '15px',
              borderRadius: '10px',
              backgroundColor: '#f9f9f9',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <h3>{place.title}</h3>
            <p style={{ fontSize: '14px', color: '#444' }}>{place.description}</p>
            {place.image && (
              <img
                src={place.image}
                alt={place.title}
                width="200"
                style={{ borderRadius: '6px', marginTop: '10px' }}
              />
            )}
            <button
              onClick={() => onDelete(place._id)}
              style={{
                marginTop: '12px',
                padding: '6px 12px',
                backgroundColor: '#dc3545',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              🗑️ Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedList;
