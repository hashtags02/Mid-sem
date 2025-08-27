import React, { useEffect, useMemo, useState } from 'react';
import { ordersAPI } from '../services/api';
import './AdminDashboard.css';

export default function AdminDashboard() {
	const [orders, setOrders] = useState([]);
	const [filter, setFilter] = useState('all');

	// Load existing orders on mount so the table isn't empty if admin opens late
	useEffect(() => {
		let alive = true;
		(async () => {
			try {
				const list = await ordersAPI.getAll();
				if (alive && Array.isArray(list)) {
					setOrders(prev => {
						// Merge unique by id, prefer newest from server
						const map = new Map();
						[...list, ...prev].forEach(o => map.set(o.id, o));
						return Array.from(map.values());
					});
				}
			} catch (_) {}
		})();
		return () => { alive = false; };
	}, []);

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

	const statusBadge = (s) => (
		<span className={`badge ${s==='pending'?'b-pending':s==='confirmed'?'b-confirmed':s==='out_for_delivery'?'b-assigned':s==='delivered'?'b-delivered':'b-cancelled'}`}>{
			s==='pending'?'Placed':s==='confirmed'?'Accepted':s==='out_for_delivery'?'Assigned':s==='delivered'?'Delivered':'Cancelled'
		}</span>
	);

	return (
		<div className="admin-page">
			<div className="admin-header">
				<h2 className="admin-title">Admin Dashboard</h2>
				<div className="admin-filters">
					<select value={filter} onChange={e => setFilter(e.target.value)}>
						<option value="all">All</option>
						<option value="pending">Placed</option>
						<option value="confirmed">Accepted by Restaurant</option>
						<option value="out_for_delivery">Assigned to Delivery</option>
						<option value="delivered">Completed</option>
						<option value="cancelled">Cancelled</option>
					</select>
				</div>
			</div>

			<div className="admin-card">
				<table className="admin-table">
					<thead>
						<tr>
							<th className="admin-th">Order</th>
							<th className="admin-th">Restaurant</th>
							<th className="admin-th">Items</th>
							<th className="admin-th">Address</th>
							<th className="admin-th">Status</th>
							<th className="admin-th">Actions</th>
						</tr>
					</thead>
					<tbody>
						{filtered.map(o => (
							<tr className="admin-row" key={o.id}>
								<td className="admin-td">{o.id}</td>
								<td className="admin-td">{o.restaurantName || o.restaurantId}</td>
								<td className="admin-td">{(o.items || []).map(i => `${i.name} x${i.quantity}`).join(', ')}</td>
								<td className="admin-td">{typeof o.deliveryAddress === 'string' ? o.deliveryAddress : [o.deliveryAddress?.street, o.deliveryAddress?.city].filter(Boolean).join(', ')}</td>
								<td className="admin-td">{statusBadge(o.status)}</td>
								<td className="admin-td">
									<div className="admin-actions">
										<button className="btn btn-accept" onClick={() => confirm(o.id)} disabled={o.status !== 'pending'}>Accept</button>
										<button className="btn btn-cancel" onClick={() => cancel(o.id)} disabled={o.status === 'delivered'}>Cancel</button>
										<button className="btn btn-reassign" onClick={() => reassign(o.id)} disabled={o.status === 'delivered'}>Reassign</button>
										<button className="btn btn-delivered" onClick={() => markDelivered(o.id)} disabled={o.status !== 'out_for_delivery'}>Mark Delivered</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}