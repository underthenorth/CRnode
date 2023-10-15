const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  university: String,
  isAdmin: { type: Boolean, default: false },
  permissions: [String],
  attended: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }]
});

module.exports = mongoose.model('User', UserSchema);
