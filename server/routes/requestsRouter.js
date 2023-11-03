const express = require('express');
const mongoose = require('mongoose');
const Request = require('../models/Request');
const User = require('../models/User');
const sendEmail = require('../middleware/mailer');
const Purpose = require('../models/Purpose');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const requests = await Request.find().populate('user', 'username');
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching requests', error });
  }
});

router.post('/new', async (req, res) => {
  const { purpose, userId } = req.body;

  if (!purpose || !userId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const request = new Request({ purpose, user: user._id });

    await request.save();

    await sendEmail('New Request Submitted', 'A new request has been submitted.', user.email);

    res.status(201).json({ message: 'Request created successfully', request });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while creating the request', error });
  }
});

router.put('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status, message, purpose, email } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid request ID' });
  }

  if (!['Pending', 'Approved', 'Denied'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const request = await Request.findById(id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = status;
    if (message) {
      request.message = message;
    }

    await request.save();

    if (status === 'Approved') {
      const userId = request.user._id;
      const targetPurpose = await Purpose.findOne({ name: purpose });

      if (targetPurpose) {
        if (!targetPurpose.canReadMembers.includes(userId)) {
          targetPurpose.canReadMembers.push(userId);
          await targetPurpose.save();
        }
      }
    }

    await sendEmail('Request Status Updated', `The status of your request has been updated to ${status}.`, email);

    res.status(200).json({ message: 'Status updated successfully', request });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while updating the status', error });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid request ID' });
  }

  try {
    const request = await Request.findById(id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    await request.deleteOne({ _id: id });
    res.status(200).json({ message: 'Request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while deleting the request', error });
  }
});

module.exports = router;
