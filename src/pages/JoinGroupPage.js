import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGroupOrder } from '../context/GroupOrderContext';

const JoinGroupPage = () => {
  const { code: codeParam } = useParams();
  const [code, setCode] = useState(codeParam || '');
  const navigate = useNavigate();
  const { joinGroup } = useGroupOrder();

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    try {
      await joinGroup(code.trim());
      navigate('/cart');
    } catch (e) {
      alert('Failed to join group. Check the code and try again.');
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '40px auto', padding: 20 }}>
      <h2>Join Group Order</h2>
      <form onSubmit={handleJoin}>
        <input
          type="text"
          placeholder="Enter group code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ddd' }}
        />
        <button type="submit" className="checkout-btn" style={{ marginTop: 12 }}>
          Join
        </button>
      </form>
    </div>
  );
};

export default JoinGroupPage;

