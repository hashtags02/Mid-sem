import React, { useMemo, useState, useEffect } from 'react';
import './DeliveryDashboard.css';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../services/api';
import { ordersAPI } from '../services/api';

const initialAvailable = [];

export default function DeliveryDashboard() {
	const { user, updateUser } = useAuth();
	const [isOnline, setIsOnline] = useState(true);
	const [availableOrders, setAvailableOrders] = useState(initialAvailable);
	const [activeOrder, setActiveOrder] = useState(null);
	const [completedOrders, setCompletedOrders] = useState([]);
	const [showProfile, setShowProfile] = useState(false);
	const [profile, setProfile] = useState({
		avatarUrl: '',
		name: 'Your Name',
		bikeNumber: ''
	});
	const [saving, setSaving] = useState(false);
	const [saveError, setSaveError] = useState('');

	useEffect(() => {
		if (user) {
			setProfile(prev => ({
				...prev,
				name: user.name || 'Your Name',
				avatarUrl: user.avatar || '',
				bikeNumber: user.bikeNumber || ''
			}));
		}
	}, [user]);

	const dailyEarnings = useMemo(() => {
		return completedOrders.reduce((sum, o) => sum + (o.payoutAmount || 0), 0);
	}, [completedOrders]);

	const weeklyEarnings = dailyEarnings; // For demo purposes, same as daily

	const acceptOrder = async (orderId) => {
		if (!isOnline || activeOrder) return;
		const order = availableOrders.find(o => o.id === orderId);
		if (!order) return;
		try {
			const assigned = await ordersAPI.assign(orderId);
			setActiveOrder({ ...assigned, status: 'Assigned' });
			setAvailableOrders(prev => prev.filter(o => o.id !== orderId));
		} catch (e) {
			console.error('Failed to accept order', e);
		}
	};

	const updateActiveStatus = async (newStatus) => {
		if (!activeOrder) return;
		try {
			if (newStatus === 'Picked Up') {
				// Backend status remains out_for_delivery once assigned
				setActiveOrder(prev => ({ ...prev, status: 'Picked Up' }));
				return;
			}
			if (newStatus === 'Delivered') {
				await ordersAPI.updateStatus(activeOrder.id, 'delivered');
				setActiveOrder(prev => ({ ...prev, status: 'Delivered' }));
				setCompletedOrders(prev => [{ ...activeOrder, status: 'Delivered' }, ...prev]);
				setActiveOrder(null);
			}
		} catch (e) {
			console.error('Failed to update status', e);
		}
	};

	const handleProfileSave = async (e) => {
		e.preventDefault();
		setSaving(true);
		setSaveError('');
		try {
			const payload = {
				name: profile.name,
				bikeNumber: profile.bikeNumber,
				avatar: profile.avatarUrl
			};
			const updated = await usersAPI.updateProfile(payload);
			localStorage.setItem('user', JSON.stringify(updated));
			updateUser?.(updated);
			setShowProfile(false);
		} catch (err) {
			setSaveError(err?.message || 'Failed to save profile');
		} finally {
			setSaving(false);
		}
	};

	const handleAvatarFile = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setSaving(true);
		setSaveError('');
		try {
			const { url } = await usersAPI.uploadAvatar(file);
			setProfile(prev => ({ ...prev, avatarUrl: url }));
		} catch (err) {
			setSaveError(err?.message || 'Failed to upload image');
		} finally {
			setSaving(false);
		}
	};

	useEffect(() => {
		let mounted = true;
		const load = async () => {
			try {
				let list = await ordersAPI.getAvailable();
				if ((!Array.isArray(list) || list.length === 0)) {
					try {
						const all = await ordersAPI.getAll();
						list = (all || []).filter(o => ['pending','confirmed','preparing'].includes(o.status));
					} catch (_) {}
				}
				if (mounted) setAvailableOrders(list || []);
			} catch (e) {
				if (mounted) setAvailableOrders([]);
			}
		};
		load();
		const id = setInterval(load, 10000);
		const ev = new EventSource((process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api') + '/orders/events');
		const refresh = () => load();
		ev.addEventListener('order_created', refresh);
		ev.addEventListener('order_confirmed', refresh);
		ev.addEventListener('order_updated', refresh);
		ev.addEventListener('order_assigned', refresh);
		return () => { mounted = false; clearInterval(id); ev.close(); };
	}, []);

	return (
		<div className="dd-container">
			<header className="dd-header">
				<div className="dd-left">
					<button className={'dd-hamburger'} aria-label="Open Profile" onClick={() => setShowProfile(true)}>
						<span></span>
						<span></span>
						<span></span>
					</button>
					<h1 className="dd-title">Delivery Dashboard</h1>
				</div>
				<div className="dd-status-toggle">
					<span className={isOnline ? 'dd-dot dd-online' : 'dd-dot dd-offline'}></span>
					<span className="dd-status-text">{isOnline ? 'Online' : 'Offline'}</span>
					<button
						className={`dd-btn ${isOnline ? 'dd-btn-offline' : 'dd-btn-pick'}`}
						onClick={() => setIsOnline(v => !v)}
					>
						{isOnline ? 'Go Offline' : 'Go Online'}
					</button>
				</div>
			</header>

			{showProfile && (
				<div className="dd-profile-modal">
					<div className="dd-profile-card">
						<div className="dd-profile-header">
							<h3>Update Profile</h3>
							<button className="dd-close" onClick={() => setShowProfile(false)}>×</button>
						</div>
						<div className="dd-profile-preview">
							<div className="dd-avatar dd-avatar-large" style={{ backgroundImage: profile.avatarUrl ? `url(${profile.avatarUrl})` : 'none' }}>
								{!profile.avatarUrl && <span className="dd-avatar-fallback">{profile.name?.[0] || 'D'}</span>}
							</div>
							<div className="dd-profile-name">{profile.name || 'Your Name'}</div>
						</div>
						<form onSubmit={handleProfileSave} className="dd-profile-form">
							<div className="dd-avatar-row">
								<div className="dd-inputs">
									<input type="file" accept="image/*" onChange={handleAvatarFile} />
									<input type="url" placeholder="Profile Image URL" value={profile.avatarUrl} onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })} />
									<input type="text" placeholder="Full Name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} required />
									<input type="text" placeholder="Bike Number (e.g., MH12 AB 1234)" value={profile.bikeNumber} onChange={(e) => setProfile({ ...profile, bikeNumber: e.target.value.toUpperCase() })} required />
									<input type="tel" value={user?.phone || ''} readOnly />
									<div className="dd-hint">Contact number is your login phone and used for tracking.</div>
									{saveError && <div className="dd-hint" style={{ color: '#ef4444' }}>{saveError}</div>}
								</div>
							</div>
							<div className="dd-profile-actions">
								<button type="button" className="dd-btn dd-btn-offline" onClick={() => setShowProfile(false)}>Cancel</button>
								<button type="submit" className="dd-btn dd-btn-pick" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
							</div>
						</form>
					</div>
				</div>
			)}

			<div className="dd-grid">
				<section className="dd-section">
					<div className="dd-section-header">
						<h2>Available Orders</h2>
						<span className="dd-chip">{availableOrders.length}</span>
					</div>
					{availableOrders.length === 0 ? (
						<div className="dd-empty">No available orders right now.</div>
					) : (
						<div className="dd-list">
							{availableOrders.map(order => (
								<div key={order.id} className="dd-order-card">
									<div className="dd-order-top">
										<div className="dd-order-id">{order.id}</div>
										<div className={`dd-status ${'dd-status-pending'}`}>{order.paymentType}</div>
									</div>
									<div className="dd-order-body">
										<div className="dd-rowline"><span className="dd-key">Pickup:</span> <span className="dd-val">{order.restaurantName} — {order.pickupAddress}</span></div>
										<div className="dd-rowline"><span className="dd-key">Drop:</span> <span className="dd-val">{order.dropAddress}</span></div>
										<div className="dd-rowline"><span className="dd-key">Customer:</span> <span className="dd-val">{order.customerName} ({order.customerPhone})</span></div>
									</div>
									<div className="dd-order-actions">
										<div className="dd-payout">₹{order.payoutAmount}</div>
										<button
											className="dd-btn dd-btn-pick"
											onClick={() => acceptOrder(order.id)}
											disabled={!isOnline || !!activeOrder}
										>
											Accept
										</button>
									</div>
								</div>
							))}
						</div>
					)}
				</section>

				<section className="dd-section">
					<div className="dd-section-header">
						<h2>Current Active Order</h2>
					</div>
					{!activeOrder ? (
						<div className="dd-empty">No active order. Accept an order to start.</div>
					) : (
						<div className="dd-card dd-active">
							<div className="dd-active-top">
								<div className="dd-order-id">{activeOrder.id}</div>
								<div className={`dd-status ${activeOrder.status === 'Delivered' ? 'dd-status-delivered' : activeOrder.status === 'Picked Up' ? 'dd-status-picked' : 'dd-status-pending'}`}>{activeOrder.status}</div>
							</div>
							<div className="dd-active-body">
								<div className="dd-rowline"><span className="dd-key">Pickup:</span> <span className="dd-val">{activeOrder.restaurantName} — {activeOrder.pickupAddress}</span></div>
								<div className="dd-rowline"><span className="dd-key">Drop:</span> <span className="dd-val">{activeOrder.dropAddress}</span></div>
								<div className="dd-rowline"><span className="dd-key">Customer:</span> <span className="dd-val">{activeOrder.customerName} ({activeOrder.customerPhone})</span></div>
								<div className="dd-rowline"><span className="dd-key">Payment:</span> <span className="dd-val">{activeOrder.paymentType}</span></div>
							</div>
							<div className="dd-active-actions">
								<button
									className="dd-btn dd-btn-pick"
									onClick={() => updateActiveStatus('Picked Up')}
									disabled={activeOrder.status !== 'Assigned'}
								>
									Picked Up
								</button>
								<button
									className="dd-btn dd-btn-deliver"
									onClick={() => updateActiveStatus('Delivered')}
									disabled={activeOrder.status !== 'Picked Up'}
								>
									Delivered
								</button>
							</div>
						</div>
					)}
				</section>

				<section className="dd-section">
					<div className="dd-section-header">
						<h2>Earnings Summary</h2>
					</div>
					<div className="dd-card dd-earnings">
						<div className="dd-earn-grid">
							<div className="dd-earn-item">
								<div className="dd-earn-label">Today</div>
								<div className="dd-earn-value">₹{dailyEarnings}</div>
							</div>
							<div className="dd-earn-item">
								<div className="dd-earn-label">This Week</div>
								<div className="dd-earn-value">₹{weeklyEarnings}</div>
							</div>
							<div className="dd-earn-item">
								<div className="dd-earn-label">Completed</div>
								<div className="dd-earn-value">{completedOrders.length}</div>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}