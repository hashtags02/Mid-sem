import React, { useMemo, useState } from 'react';
import './DeliveryDashboard.css';

const initialOrders = [
	{ id: 'ORD-1001', customerName: 'Aman Gupta', address: '221B Baker Street, Delhi', status: 'Pending' },
	{ id: 'ORD-1002', customerName: 'Neha Sharma', address: 'MG Road, Bengaluru', status: 'Pending' },
	{ id: 'ORD-1003', customerName: 'Rohit Verma', address: 'Park Street, Kolkata', status: 'Picked Up' },
	{ id: 'ORD-1004', customerName: 'Priya Singh', address: 'FC Road, Pune', status: 'Pending' },
];

export default function DeliveryDashboard() {
	const [orders, setOrders] = useState(initialOrders);
	const [filter, setFilter] = useState('All');

	const filteredOrders = useMemo(() => {
		if (filter === 'All') return orders;
		return orders.filter(o => o.status === filter);
	}, [orders, filter]);

	const updateStatus = (orderId, newStatus) => {
		setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
	};

	return (
		<div className="dd-container">
			<header className="dd-header">
				<h1 className="dd-title">Delivery Dashboard</h1>
				<div className="dd-filters">
					<label className="dd-filter-label">Filter:</label>
					<select className="dd-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
						<option>All</option>
						<option>Pending</option>
						<option>Picked Up</option>
						<option>Delivered</option>
					</select>
				</div>
			</header>

			<div className="dd-card">
				<div className="dd-table-header">
					<div>Order ID</div>
					<div>Customer</div>
					<div>Address</div>
					<div>Status</div>
					<div>Actions</div>
				</div>

				{filteredOrders.map(order => (
					<div key={order.id} className="dd-row">
						<div className="dd-col-id">{order.id}</div>
						<div className="dd-col-customer">{order.customerName}</div>
						<div className="dd-col-address">{order.address}</div>
						<div className={`dd-status ${order.status === 'Delivered' ? 'dd-status-delivered' : order.status === 'Picked Up' ? 'dd-status-picked' : 'dd-status-pending'}`}>{order.status}</div>
						<div className="dd-actions">
							<button
								className="dd-btn dd-btn-pick"
								onClick={() => updateStatus(order.id, 'Picked Up')}
								disabled={order.status === 'Delivered' || order.status === 'Picked Up'}
							>
								Picked Up
							</button>
							<button
								className="dd-btn dd-btn-deliver"
								onClick={() => updateStatus(order.id, 'Delivered')}
								disabled={order.status === 'Delivered'}
							>
								Delivered
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}