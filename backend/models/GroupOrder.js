const mongoose = require('mongoose');

const groupMemberSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String },
  avatar: { type: String },
  isHost: { type: Boolean, default: false },
  joinedAt: { type: Date, default: Date.now },
}, { _id: false });

const groupCartItemSchema = new mongoose.Schema({
  memberUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  memberName: { type: String },
  dish: { type: mongoose.Schema.Types.ObjectId, ref: 'Dish' },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  photo: { type: String },
  notes: { type: String },
}, { timestamps: true });

const groupOrderSchema = new mongoose.Schema({
  code: { type: String, unique: true, index: true },
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  restaurantName: { type: String },
  status: { type: String, enum: ['open', 'locked', 'checked_out', 'cancelled'], default: 'open' },
  paymentMode: { type: String, enum: ['host', 'split', null], default: null },
  members: { type: [groupMemberSchema], default: [] },
  items: { type: [groupCartItemSchema], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('GroupOrder', groupOrderSchema);

