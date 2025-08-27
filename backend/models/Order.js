const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  dish: { type: mongoose.Schema.Types.ObjectId, ref: 'Dish' },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  photo: String,
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId: { type: String, index: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  restaurantId: { type: String },
  restaurantName: { type: String },
  items: { type: [orderItemSchema], default: [] },
  totalAmount: { type: Number },
  deliveryAddress: { type: mongoose.Schema.Types.Mixed },
  deliveryInstructions: { type: String },
  paymentMethod: { type: String, enum: ['cash', 'card', 'upi', 'wallet'] },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  status: { type: String, enum: ['pending', 'pending_delivery', 'accepted_delivery', 'rejected', 'confirmed', 'preparing', 'ready_for_pickup', 'out_for_delivery', 'delivered', 'cancelled'], default: 'pending' },
  payoutAmount: { type: Number },
  driver: { type: mongoose.Schema.Types.Mixed },
  acceptedByRestaurant: { type: Boolean, default: false },
  acceptedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);

