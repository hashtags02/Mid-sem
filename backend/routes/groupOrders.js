const express = require('express');
const { nanoid } = require('nanoid');
const GroupOrder = require('../models/GroupOrder');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Helper: generate unique room code
async function generateUniqueCode() {
  // 6-char uppercase code
  let code = '';
  // Ensure uniqueness
  // Retries a few times before giving up
  for (let attempt = 0; attempt < 5; attempt += 1) {
    code = nanoid(6).toUpperCase();
    const exists = await GroupOrder.findOne({ code }).lean();
    if (!exists) return code;
  }
  // Fallback with longer code
  return nanoid(8).toUpperCase();
}

// Create a group order (host)
router.post('/', auth, async (req, res) => {
  try {
    const { restaurantId, restaurantName } = req.body || {};
    const code = await generateUniqueCode();
    const group = await GroupOrder.create({
      code,
      host: req.user._id,
      restaurant: restaurantId || undefined,
      restaurantName: restaurantName || undefined,
      members: [{ user: req.user._id, name: req.user.name, avatar: req.user.avatar, isHost: true }],
      items: [],
    });
    res.json(group);
  } catch (err) {
    console.error('Create group error', err);
    res.status(500).json({ error: 'Failed to create group order' });
  }
});

// Get group order by code
router.get('/:code', auth, async (req, res) => {
  try {
    const group = await GroupOrder.findOne({ code: req.params.code }).populate('members.user', 'name avatar').lean();
    if (!group) return res.status(404).json({ error: 'Group not found' });
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load group order' });
  }
});

// Join a group order by code
router.post('/:code/join', auth, async (req, res) => {
  try {
    const group = await GroupOrder.findOne({ code: req.params.code });
    if (!group) return res.status(404).json({ error: 'Group not found' });
    if (group.status !== 'open') return res.status(400).json({ error: 'Group is not open to join' });
    const isMember = group.members.some(m => m.user.toString() === req.user._id.toString());
    if (!isMember) {
      group.members.push({ user: req.user._id, name: req.user.name, avatar: req.user.avatar, isHost: false });
      await group.save();
    }
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: 'Failed to join group' });
  }
});

// Add item to group cart
router.post('/:code/items', auth, async (req, res) => {
  try {
    const { name, price, quantity, photo, notes, dishId, restaurantId } = req.body || {};
    const group = await GroupOrder.findOne({ code: req.params.code });
    if (!group) return res.status(404).json({ error: 'Group not found' });
    if (group.status !== 'open') return res.status(400).json({ error: 'Group is not accepting items' });
    const isMember = group.members.some(m => m.user.toString() === req.user._id.toString());
    if (!isMember) return res.status(403).json({ error: 'Not a group member' });
    group.items.push({
      memberUser: req.user._id,
      memberName: req.user.name,
      dish: dishId || undefined,
      restaurant: restaurantId || undefined,
      name,
      price,
      quantity: Math.max(1, Number(quantity) || 1),
      photo,
      notes,
    });
    await group.save();
    res.json(group);
  } catch (err) {
    console.error('Add item error', err);
    res.status(500).json({ error: 'Failed to add item' });
  }
});

// Update or remove item
router.put('/:code/items/:itemId', auth, async (req, res) => {
  try {
    const group = await GroupOrder.findOne({ code: req.params.code });
    if (!group) return res.status(404).json({ error: 'Group not found' });
    const item = group.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    // Only host can edit anyone's items, others can edit their own
    const member = group.members.find(m => m.user.toString() === req.user._id.toString());
    const isHost = member?.isHost;
    if (!isHost && item.memberUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not allowed to edit this item' });
    }

    const { quantity, notes } = req.body || {};
    if (quantity !== undefined) item.quantity = Math.max(1, Number(quantity) || 1);
    if (notes !== undefined) item.notes = notes;
    await group.save();
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update item' });
  }
});

router.delete('/:code/items/:itemId', auth, async (req, res) => {
  try {
    const group = await GroupOrder.findOne({ code: req.params.code });
    if (!group) return res.status(404).json({ error: 'Group not found' });
    const item = group.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    const member = group.members.find(m => m.user.toString() === req.user._id.toString());
    const isHost = member?.isHost;
    if (!isHost && item.memberUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not allowed to delete this item' });
    }

    item.deleteOne();
    await group.save();
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove item' });
  }
});

// Set payment mode (host only)
router.post('/:code/payment-mode', auth, async (req, res) => {
  try {
    const { mode } = req.body || {};
    const group = await GroupOrder.findOne({ code: req.params.code });
    if (!group) return res.status(404).json({ error: 'Group not found' });
    const isHost = group.host.toString() === req.user._id.toString();
    if (!isHost) return res.status(403).json({ error: 'Only host can set payment mode' });
    if (!['host', 'split'].includes(mode)) return res.status(400).json({ error: 'Invalid payment mode' });
    group.paymentMode = mode;
    await group.save();
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: 'Failed to set payment mode' });
  }
});

// Lock and proceed to checkout (host only)
router.post('/:code/checkout', auth, async (req, res) => {
  try {
    const group = await GroupOrder.findOne({ code: req.params.code });
    if (!group) return res.status(404).json({ error: 'Group not found' });
    const isHost = group.host.toString() === req.user._id.toString();
    if (!isHost) return res.status(403).json({ error: 'Only host can checkout' });
    if (!group.items.length) return res.status(400).json({ error: 'Cart is empty' });
    group.status = 'locked';
    await group.save();
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: 'Failed to checkout' });
  }
});

module.exports = router;

