import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import io from 'socket.io-client';

const VADODARA_RESTAURANT = [22.3072, 73.1812];

export default function LeafletTracking({ orderId }) {
  const [order, setOrder] = useState(null);
  const [driverPos, setDriverPos] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const socketRef = useRef(null);

  const apiBase = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api');
  const socketBase = useMemo(() => apiBase.replace('/api', ''), [apiBase]);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch(`${apiBase}/orders/${orderId}`);
        const data = await res.json();
        if (!alive) return;
        setOrder(data);
      } catch (_) {}
    };
    load();
    const socket = io(socketBase, { transports: ['websocket'] });
    socketRef.current = socket;
    socket.emit('join_order', { orderId });
    socket.on('driver_location', (p) => {
      if (p?.orderId === orderId && typeof p.lat === 'number' && typeof p.lng === 'number') {
        setDriverPos([p.lat, p.lng]);
        setLastUpdate(new Date());
      }
    });
    return () => { alive = false; socketRef.current?.disconnect(); };
  }, [apiBase, socketBase, orderId]);

  const customerLatLng = order?.customerLocation && typeof order.customerLocation.lat === 'number'
    ? [order.customerLocation.lat, order.customerLocation.lng]
    : null;

  return (
    <div style={{ width: '100%', height: 420 }}>
      <MapContainer center={VADODARA_RESTAURANT} zoom={14} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
        <Marker position={VADODARA_RESTAURANT} />
        {customerLatLng && <Marker position={customerLatLng} />}
        {driverPos && <Marker position={driverPos} />}
        {customerLatLng && <Polyline positions={[VADODARA_RESTAURANT, customerLatLng]} color="#0077ff" />}
      </MapContainer>
      {lastUpdate && (
        <div style={{ marginTop: 8, fontSize: 12 }}>Last updated: {lastUpdate.toLocaleTimeString()}</div>
      )}
    </div>
  );
}

