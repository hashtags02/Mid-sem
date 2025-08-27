import React, { useEffect, useMemo, useState } from 'react';
import { ordersAPI } from '../services/api';

export default function AdminDashboard() {
	const [orders, setOrders] = useState([]);
	const [filter, setFilter] = useState('all');

	useEffect(() => {
		const base = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api');
		const ev = new EventSource(base + '/orders/events');
		const upsert = (order) => {
			setOrders(prev => {
				const idx = prev.findIndex(o => o.id === order.id);
				if (idx === -1) return [order, ...prev];
				const copy = [...prev];
				copy[idx] = { ...copy[idx], ...order };
				return copy;
			});
		};
		ev.addEventListener('order_created', e => { try { upsert(JSON.parse(e.data)); } catch(_){} });
		ev.addEventListener('order_updated', e => { try { upsert(JSON.parse(e.data)); } catch(_){} });
		ev.addEventListener('order_confirmed', e => { try { upsert(JSON.parse(e.data)); } catch(_){} });
		ev.addEventListener('order_assigned', e => { try { upsert(JSON.parse(e.data)); } catch(_){} });
		ev.addEventListener('order_reassigned', e => { try { upsert(JSON.parse(e.data)); } catch(_){} });
		return () => ev.close();
	}, []);

	const filtered = useMemo(() => orders.filter(o => filter === 'all' ? true : o.status === filter), [orders, filter]);

	const confirm = async (id) => { await ordersAPI.updateStatus(id, 'confirmed'); };
	const cancel = async (id) => { await ordersAPI.updateStatus(id, 'cancelled'); };
	const markDelivered = async (id) => { await ordersAPI.updateStatus(id, 'delivered'); };
	const reassign = async (id) => {
		const name = prompt('Enter driver name');
		await ordersAPI.reassignDriver(id, { driverName: name || 'Reassigned Driver' });
	};

	const cell = { padding: '10px 8px', borderBottom: '1px solid #eee' };

	return (
		<div style={{ padding: 24 }}>
			<h2>Admin Dashboard</h2>
			<div style={{ marginBottom: 12 }}>
				<select value={filter} onChange={e => setFilter(e.target.value)}>
					<option value="all">All</option>
					<option value="pending">Placed</option>
					<option value="confirmed">Accepted by Restaurant</option>
					<option value="out_for_delivery">Assigned to Delivery</option>
					<option value="delivered">Completed</option>
					<option value="cancelled">Cancelled</option>
				</select>
			</div>
			<div style={{ overflowX: 'auto' }}>
				<table style={{ width: '100%', borderCollapse: 'collapse' }}>
					<thead>
						<tr style={{ background: '#fafafa' }}>
							<th style={cell}>Order ID</th>
							<th style={cell}>Restaurant</th>
							<th style={cell}>Items</th>
							<th style={cell}>Address</th>
							<th style={cell}>Status</th>
							<th style={cell}>Actions</th>
						</tr>
					</thead>
					<tbody>
						{filtered.map(o => (
							<tr key={o.id}>
								<td style={cell}>{o.id}</td>
								<td style={cell}>{o.restaurantName || o.restaurantId}</td>
								<td style={cell}>{(o.items || []).map(i => `${i.name} x${i.quantity}`).join(', ')}</td>
								<td style={cell}>{typeof o.deliveryAddress === 'string' ? o.deliveryAddress : [o.deliveryAddress?.street, o.deliveryAddress?.city].filter(Boolean).join(', ')}</td>
								<td style={cell}>{o.status}</td>
								<td style={cell}>
									<button onClick={() => confirm(o.id)} disabled={o.status !== 'pending'}>Accept</button>
									<button onClick={() => cancel(o.id)} disabled={o.status === 'delivered'} style={{ marginLeft: 6 }}>Cancel</button>
									<button onClick={() => reassign(o.id)} disabled={o.status === 'delivered'} style={{ marginLeft: 6 }}>Reassign</button>
									<button onClick={() => markDelivered(o.id)} disabled={o.status !== 'out_for_delivery'} style={{ marginLeft: 6 }}>Mark Delivered</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}