const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { sendEmail } = require('../middleware/mailer');
const crypto = require('crypto');

const URL_HOST = process.env.NODE_ENV === 'production' ? 'https://cloudrounds.com' : 'http://localhost:3000';

router.post('/forgot-password', async (req, res) => {
  const email = req.body.email;
  if (typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required' });
  }
  console.log('EMAIL: ', email);
  const resetToken = crypto.randomBytes(20).toString('hex');
  const resetTokenExpiry = Date.now() + 3600000; // 1 hour

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    const subject = 'Password Reset';
    const text = `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n
        ${URL_HOST}/reset-password/${resetToken}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`;
    const to = user.email;
    await sendEmail(subject, text, to);
    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Error during password reset process:', error);
    res.status(500).json({ error: 'Error during password reset process' });
  }
});

router.post('/reset-password/:resetToken', async (req, res) => {
  const resetToken = req.params.resetToken;
  const newPassword = req.body.newPassword;

  if (typeof newPassword !== 'string') {
    return res.status(400).json({ error: 'New password is required' });
  }

  try {
    const user = await User.findOne({
      resetToken: resetToken,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    console.log('USER RESET TOKEN: ', user.resetTokenExpiry);

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Error resetting password' });
  }
});

module.exports = router;
