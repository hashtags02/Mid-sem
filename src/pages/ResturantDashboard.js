import React, { useMemo, useState } from 'react';

// Simple pie chart using CSS conic-gradient (no external deps)
const PieChart = ({ segments = [], size = 140, innerSize = 70 }) => {
	const total = segments.reduce((sum, s) => sum + (s.value || 0), 0) || 1;
	let current = 0;
	const gradientStops = segments.map((s) => {
		const start = (current / total) * 360;
		const end = ((current + s.value) / total) * 360;
		current += s.value;
		return `${s.color} ${start}deg ${end}deg`;
	}).join(', ');

	const containerStyle = {
		width: size,
		height: size,
		borderRadius: '50%',
		background: `conic-gradient(${gradientStops})`,
		position: 'relative',
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center'
	};

	const innerStyle = {
		width: innerSize,
		height: innerSize,
		borderRadius: '50%',
		background: '#fff'
	};

	return (
		<div style={containerStyle}>
			<div style={innerStyle} />
		</div>
	);
};

const cardStyle = {
	background: '#fff',
	borderRadius: 16,
	padding: 16,
	boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
};

const badge = (text, color) => (
	<span style={{
		background: color,
		color: '#fff',
		padding: '4px 10px',
		borderRadius: 999,
		fontSize: 12,
		fontWeight: 600
	}}>{text}</span>
);

const ResturantDashboard = () => {
	const [orders, setOrders] = useState([
		{ id: 'ORD-1001', customerName: 'Aarav Shah', address: '12, Alkapuri, Vadodara', restaurantName: "Domino's Pizza", status: 'Pending', date: '2025-08-19' },
		{ id: 'ORD-1002', customerName: 'Diya Patel', address: '33, Gotri Road, Vadodara', restaurantName: 'Le Privé', status: 'Picked Up', date: '2025-08-19' },
		{ id: 'ORD-1003', customerName: 'Kabir Mehta', address: '7, OP Road, Vadodara', restaurantName: 'South Cafe', status: 'Delivered', date: '2025-08-18' },
		{ id: 'ORD-1004', customerName: 'Isha Desai', address: 'Sun Pharma Road, Vadodara', restaurantName: 'Urban Bites', status: 'Pending', date: '2025-08-19' },
		{ id: 'ORD-1005', customerName: 'Rohan Gupta', address: 'Ellora Park, Vadodara', restaurantName: 'Punjabi Dhaba', status: 'Delivered', date: '2025-08-01' }
	]);

	const today = new Date().toISOString().slice(0, 10);
	const totalToday = useMemo(() => orders.filter(o => o.date === today).length, [orders, today]);
	const totalLifetime = orders.length;
	const stats = useMemo(() => ({
		pending: orders.filter(o => o.status === 'Pending').length,
		picked: orders.filter(o => o.status === 'Picked Up').length,
		delivered: orders.filter(o => o.status === 'Delivered').length
	}), [orders]);

	const updateStatus = (id, nextStatus) => {
		setOrders(prev => prev.map(o => o.id === id ? { ...o, status: nextStatus } : o));
	};

	const pageStyle = {
		minHeight: '100vh',
		background: 'linear-gradient(135deg, #ff7e30, #ff9f3f 40%, #ffb54c)',
		padding: 24,
		fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif'
	};

	const grid = {
		display: 'grid',
		gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
		gap: 16
	};

	return (
		<div style={pageStyle}>
			<div style={{ maxWidth: 1200, margin: '0 auto' }}>
				<header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
					<h2 style={{ color: '#fff', margin: 0 }}>CraveCart • Resturant Dashboard</h2>
					<input placeholder="Search orders…" style={{ width: 320, borderRadius: 12, border: 'none', padding: '10px 14px' }} />
				</header>

				<div style={grid}>
					<div style={cardStyle}>
						<div style={{ color: '#6b7280', fontSize: 12, fontWeight: 600 }}>Total Today</div>
						<div style={{ fontSize: 28, fontWeight: 800 }}>{totalToday}</div>
					</div>
					<div style={cardStyle}>
						<div style={{ color: '#6b7280', fontSize: 12, fontWeight: 600 }}>Total Lifetime</div>
						<div style={{ fontSize: 28, fontWeight: 800 }}>{totalLifetime}</div>
					</div>
					<div style={cardStyle}>
						<div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
							<PieChart
								size={120}
								innerSize={60}
								segments={[
									{ value: stats.delivered, color: '#16a34a' },
									{ value: stats.picked, color: '#3b82f6' },
									{ value: stats.pending, color: '#f59e0b' }
								]}
							/>
							<div>
								<div style={{ fontWeight: 700, marginBottom: 8 }}>Order Status</div>
								<div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
									<span style={{ width: 10, height: 10, background: '#16a34a', borderRadius: 999 }} />
									<span style={{ fontSize: 12, color: '#374151' }}>Delivered: {stats.delivered}</span>
								</div>
								<div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
									<span style={{ width: 10, height: 10, background: '#3b82f6', borderRadius: 999 }} />
									<span style={{ fontSize: 12, color: '#374151' }}>Picked Up: {stats.picked}</span>
								</div>
								<div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
									<span style={{ width: 10, height: 10, background: '#f59e0b', borderRadius: 999 }} />
									<span style={{ fontSize: 12, color: '#374151' }}>Pending: {stats.pending}</span>
								</div>
							</div>
						</div>
					</div>

				<section style={{ marginTop: 24 }}>
					<div style={{ ...cardStyle, overflow: 'hidden' }}>
						<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
							<h3 style={{ margin: 0 }}>Live Orders</h3>
							<div style={{ display: 'flex', gap: 8 }}>
								{badge('Today ' + totalToday, '#0ea5e9')}
								{badge('Lifetime ' + totalLifetime, '#ef4444')}
							</div>
						</div>
						<div style={{ width: '100%', overflowX: 'auto' }}>
							<table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
								<thead>
									<tr style={{ textAlign: 'left', color: '#6b7280', fontSize: 12 }}>
										<th style={{ padding: '12px 8px' }}>Order ID</th>
										<th style={{ padding: '12px 8px' }}>Customer</th>
										<th style={{ padding: '12px 8px' }}>Address</th>
										<th style={{ padding: '12px 8px' }}>Resturant</th>
										<th style={{ padding: '12px 8px' }}>Status</th>
										<th style={{ padding: '12px 8px' }}>Actions</th>
									</tr>
								</thead>
								<tbody>
									{orders.map((o, idx) => (
										<tr key={o.id} style={{ background: idx % 2 === 0 ? '#fff' : '#fafafa' }}>
											<td style={{ padding: '12px 8px', fontWeight: 600 }}>{o.id}</td>
											<td style={{ padding: '12px 8px' }}>{o.customerName}</td>
											<td style={{ padding: '12px 8px' }}>{o.address}</td>
											<td style={{ padding: '12px 8px' }}>{o.restaurantName}</td>
											<td style={{ padding: '12px 8px' }}>
												{badge(o.status, o.status === 'Delivered' ? '#16a34a' : o.status === 'Picked Up' ? '#3b82f6' : '#f59e0b')}
											</td>
											<td style={{ padding: '12px 8px' }}>
												<div style={{ display: 'flex', gap: 8 }}>
													<button
														onClick={() => updateStatus(o.id, 'Picked Up')}
														style={{
															padding: '8px 10px', borderRadius: 10, border: 'none', fontWeight: 700,
															background: '#3b82f6', color: '#fff', cursor: 'pointer', opacity: o.status === 'Delivered' ? 0.5 : 1
														}}
														disabled={o.status === 'Delivered'}
													>
														Picked Up
													</button>
													<button
														onClick={() => updateStatus(o.id, 'Delivered')}
														style={{
															padding: '8px 10px', borderRadius: 10, border: 'none', fontWeight: 700,
															background: '#16a34a', color: '#fff', cursor: 'pointer'
														}}
													>
														Delivered
													</button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
};

export default ResturantDashboard;


