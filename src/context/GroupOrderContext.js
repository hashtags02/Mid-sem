import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { io as createSocket } from 'socket.io-client';
import { groupOrdersAPI } from '../services/api';
import { useAuth } from './AuthContext';

const GroupOrderContext = createContext();
export { GroupOrderContext };

export const useGroupOrder = () => {
  const context = useContext(GroupOrderContext);
  if (!context) {
    throw new Error('useGroupOrder must be used within a GroupOrderProvider');
  }
  return context;
};

export const GroupOrderProvider = ({ children }) => {
  const { user } = useAuth();
  const [group, setGroup] = useState(null);
  const socketRef = useRef(null);
  const [connecting, setConnecting] = useState(false);

  const apiBase = (typeof window !== 'undefined' && window.__API_BASE__) || process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

  const ensureSocket = () => {
    if (socketRef.current) return socketRef.current;
    const socket = createSocket(apiBase.replace('/api', ''));
    socketRef.current = socket;
    return socket;
  };

  // Join socket room whenever we have a code
  useEffect(() => {
    const socket = ensureSocket();
    if (group?.code) {
      socket.emit('join_group', { code: group.code });
    }
    const handleUpdate = (updated) => {
      if (updated?.code === group?.code) setGroup(updated);
    };
    socket.on('group:update', handleUpdate);
    return () => {
      socket.off('group:update', handleUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group?.code]);

  // Restore group from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('group_code');
    if (saved) {
      setConnecting(true);
      groupOrdersAPI.getByCode(saved)
        .then((g) => setGroup(g))
        .catch(() => localStorage.removeItem('group_code'))
        .finally(() => setConnecting(false));
    }
  }, []);

  const startGroup = async ({ restaurantId, restaurantName } = {}) => {
    const g = await groupOrdersAPI.create({ restaurantId, restaurantName });
    setGroup(g);
    localStorage.setItem('group_code', g.code);
    ensureSocket().emit('join_group', { code: g.code });
    return g;
  };

  const joinGroup = async (code) => {
    const g = await groupOrdersAPI.join(code);
    setGroup(g);
    localStorage.setItem('group_code', g.code);
    ensureSocket().emit('join_group', { code: g.code });
    return g;
  };

  const leaveGroup = () => {
    setGroup(null);
    localStorage.removeItem('group_code');
  };

  const addItem = async (item) => {
    if (!group?.code) return null;
    const payload = {
      name: item.name,
      price: item.price,
      quantity: item.quantity || 1,
      photo: item.image || item.photo,
      notes: item.notes,
      dishId: item.id || item.dishId,
      restaurantId: item.restaurantId,
    };
    const g = await groupOrdersAPI.addItem(group.code, payload);
    setGroup(g);
    return g;
  };

  const updateItem = async (itemId, updates) => {
    if (!group?.code) return null;
    const g = await groupOrdersAPI.updateItem(group.code, itemId, updates);
    setGroup(g);
    return g;
  };

  const removeItem = async (itemId) => {
    if (!group?.code) return null;
    const g = await groupOrdersAPI.removeItem(group.code, itemId);
    setGroup(g);
    return g;
  };

  const setPaymentMode = async (mode) => {
    if (!group?.code) return null;
    const g = await groupOrdersAPI.setPaymentMode(group.code, mode);
    setGroup(g);
    return g;
  };

  const checkout = async () => {
    if (!group?.code) return null;
    const g = await groupOrdersAPI.checkout(group.code);
    setGroup(g);
    return g;
  };

  const isHost = useMemo(() => {
    if (!group || !user) return false;
    return group.host === user._id || group.members?.some(m => m.isHost && (m.user?._id === user._id || m.user === user._id));
  }, [group, user]);

  const value = {
    group,
    connecting,
    isHost,
    startGroup,
    joinGroup,
    leaveGroup,
    addItem,
    updateItem,
    removeItem,
    setPaymentMode,
    checkout,
  };

  return (
    <GroupOrderContext.Provider value={value}>
      {children}
    </GroupOrderContext.Provider>
  );
};

