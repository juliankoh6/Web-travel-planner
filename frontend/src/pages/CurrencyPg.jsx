// frontend/src/pages/CurrencyPg.jsx
import React, { useState, useEffect } from 'react';
import { // import helper function
  convertCurrency,
  saveConversion,
  getSavedConversions,
  updateConversion,
  deleteConversion
} from '../api/currencyAPI';
import './CurrencyPg.css';

const CurrencyPg = () => { //store local state
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState(1);
  const [note, setNote] = useState('');
  const [currencies, setCurrencies] = useState([]);
  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editNote, setEditNote] = useState('');

  const userID = localStorage.getItem("userID"); //read from localStorage

  useEffect(() => {
    fetchCurrencies();
    fetchSaved();
  }, []);

  const fetchCurrencies = async () => { //fetch available currency codes to populate the dropdowns
    try {
      const res = await fetch('https://web-travel-planner.onrender.com');
      const data = await res.json();
      const codes = [...new Set(data)].sort();
      setCurrencies(codes);
      setFrom('USD');
      setTo('MYR');
    } catch (err) {
      console.error('Failed to fetch currencies');
    }
  };

  const fetchSaved = async () => { //fetch saved conversion
    if (!userID) return;
    const records = await getSavedConversions(userID);
    setSaved(records);
  };

  const handleConvert = async () => { //send request to backend API to get conversion result
    if (!from || !to || !amount) return alert('Missing input');
    const data = await convertCurrency(from, to, amount);
    if (data) setResult(data);
  };

  const handleSave = async () => { //includes userid + saves conversion to db
    if (!result) return alert('Convert first before saving!');
    const data = {
      userID,
      from,
      to,
      amount,
      convertedAmount: result.converted,
      note
    };
    await saveConversion(data);
    setNote('');
    setResult(null);
    fetchSaved();
  };


  const handleDelete = async (id) => { //confirm deletion, removes card + call backend to delete from db
  const confirmDelete = window.confirm("Are you sure you want to delete this saved conversion?");
  if (!confirmDelete) return;

  await deleteConversion(id);
  fetchSaved();
};


  const handleEdit = (item) => { //edit selected saved conversion
    setEditId(item._id);
    setEditNote(item.note || '');
  };

  const handleUpdate = async (item) => { //press ok button + call backend update new notes to db
    await updateConversion(item._id, { ...item, note: editNote });
    setEditId(null);
    setEditNote('');
    fetchSaved();
  };

  return (
    <div className="currency-page-wrapper">
      <div className="currency-container">
        <h2>💱 Currency Converter</h2>
        <div style={{ marginBottom: '20px' }}>
          <input
            type="number"
            value={amount}
            min="0"
            onChange={(e) => setAmount(e.target.value)}
            style={{ padding: '8px', width: '80px', marginRight: '10px' }}
          />
          <select value={from} onChange={(e) => setFrom(e.target.value)} style={{ padding: '8px', marginRight: '10px' }}>
            <option value="">From</option>
            {currencies.map((cur) => (
              <option key={cur} value={cur}>{cur}</option>
            ))}
          </select>
          <select value={to} onChange={(e) => setTo(e.target.value)} style={{ padding: '8px', marginRight: '10px' }}>
            <option value="">To</option>
            {currencies.map((cur) => (
              <option key={cur} value={cur}>{cur}</option>
            ))}
          </select>
          <button onClick={handleConvert} style={{ padding: '8px 15px' }}>Convert</button>
        </div>

        {result && (
          <div style={{ marginBottom: '20px' }}>
            <p><strong>{amount} {from}</strong> = <strong>{result.converted} {to}</strong></p>
            <p>Rate: 1 {from} = {result.rate} {to}</p>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note"
              style={{ padding: '6px', width: '60%', marginRight: '10px' }}
            />
            <button onClick={handleSave}>Save</button>
          </div>
        )}
      </div>

      <div className="saved-section">
        <h3>📒 Saved Conversions</h3>
        <div className="currency-card-container">
          {saved.length === 0 ? (
            <p>No saved conversions</p>
          ) : (
            saved.map((item) => ( //display cards
              <div key={item._id} className="currency-card">
                <h4>{item.from} → {item.to}</h4>
                <p>{item.amount} {item.from} = {item.convertedAmount} {item.to}</p>
                <p><strong>Notes:</strong></p>
                {editId === item._id ? (
                  <>
                    <textarea
                      value={editNote}
                      onChange={(e) => setEditNote(e.target.value)}
                    />
                    <button onClick={() => handleUpdate(item)} style={{ background: 'green', color: 'white' }}>OK</button>
                  </>
                ) : (
                  <p>{item.note || 'No notes added.'}</p>
                )}
                <div className="button-group">
                  {editId !== item._id && (
                    <button onClick={() => handleEdit(item)} className="edit-btn">Edit</button>
                  )}
                  <button onClick={() => handleDelete(item._id)} className="delete-btn">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrencyPg;
