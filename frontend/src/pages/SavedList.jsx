import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SavedList = ({ saved, onDelete }) => {
  const [notesMap, setNotesMap] = useState({});
  const [editingNoteId, setEditingNoteId] = useState(null);

  // Sync notes from saved data
  useEffect(() => {
    const initialNotes = {};
    saved.forEach((place) => {
      initialNotes[place._id] = place.notes || '';
    });
    setNotesMap(initialNotes);
  }, [saved]);

  const handleNoteChange = (id, text) => {
    setNotesMap((prev) => ({ ...prev, [id]: text }));
  };

  const handleEditClick = (id) => {
    setEditingNoteId(id);
  };

  const handleSaveNote = async (id) => {
    try {
      await axios.patch(`https://web-travel-planner.onrender.com/api/destinations/saved/${id}/notes`, {
        notes: notesMap[id] || ''
      });
      setEditingNoteId(null);
      console.log('✅ Note saved to DB:', id);
    } catch (err) {
      console.error('❌ Failed to update note:', err.message);
    }
  };

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

            {/* Notes Section */}
            <div style={{ marginTop: '10px', width: '100%' }}>
              <strong>📝 Notes:</strong>
              {editingNoteId === place._id ? (
                <div>
                  <textarea
                    rows={3}
                    value={notesMap[place._id] || ''}
                    onChange={(e) => handleNoteChange(place._id, e.target.value)}
                    style={{ width: '100%', marginTop: '6px' }}
                  />
                  <button
                    onClick={() => handleSaveNote(place._id)}
                    style={{
                      marginTop: '5px',
                      padding: '4px 10px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    OK
                  </button>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                    {notesMap[place._id] || 'No notes added.'}
                  </p>
                  <button
                    onClick={() => handleEditClick(place._id)}
                    style={{
                      marginTop: '5px',
                      padding: '4px 10px',
                      backgroundColor: '#ffc107',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>

            {/* Delete Button */}
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
