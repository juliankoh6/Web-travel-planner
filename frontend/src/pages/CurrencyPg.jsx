import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CurrencyPg.css';

const CurrencyPg = () => {
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');
  const [amount, setAmount] = useState(1);
  const [result, setResult] = useState(null);
  const [currencyList, setCurrencyList] = useState([]);

  // Load currency codes on mount
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const res = await axios.get('/api/currency/list');
        setCurrencyList(res.data);
      } catch (err) {
        console.error('Failed to load currency list', err);
      }
    };

    fetchCurrencies();
  }, []);

  const handleConvert = async () => {
    try {
      const res = await axios.get('/api/currency', {
        params: { from, to }
      });

      const rate = res.data.rate;
      const converted = (amount * rate).toFixed(2);

      setResult({
        amount,
        from,
        to,
        rate,
        converted
      });
    } catch (err) {
      console.error('Conversion failed:', err);
      alert('Conversion failed');
    }
  };

  return (
    <div className="currency-container">
      <h2>💱 Currency Converter</h2>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="number"
          value={amount}
          min="0"
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          style={{ padding: '8px', marginRight: '10px' }}
        />

        <select value={from} onChange={(e) => setFrom(e.target.value)} style={{ padding: '8px', marginRight: '10px' }}>
          {currencyList.map((code) => (
            <option key={code} value={code}>{code}</option>
          ))}
        </select>

        <select value={to} onChange={(e) => setTo(e.target.value)} style={{ padding: '8px', marginRight: '10px' }}>
          {currencyList.map((code) => (
            <option key={code} value={code}>{code}</option>
          ))}
        </select>

        <button onClick={handleConvert} style={{ padding: '8px 15px' }}>Convert</button>
      </div>

      {result && (
        <div>
          <p><strong>{result.amount} {result.from}</strong> = <strong>{result.converted} {result.to}</strong></p>
          <p>Rate: 1 {result.from} = {result.rate} {result.to}</p>
        </div>
      )}
    </div>
  );
};

export default CurrencyPg;
