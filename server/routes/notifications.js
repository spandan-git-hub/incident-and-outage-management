import express from 'express';
import Notification from '../models/Notification.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// GET /api/notifications - Get all notifications for current user
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .populate('incidentId', 'title status severity')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/notifications/unread/count - Get unread notification count
router.get('/unread/count', auth, async (req, res) => {
  try {
    const count = await Notification.countDocuments({ 
      userId: req.user.id, 
      read: false 
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH /api/notifications/:id/read - Mark notification as read
router.patch('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Verify the notification belongs to the user
    if (notification.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    notification.read = true;
    await notification.save();

    res.json(notification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH /api/notifications/read-all - Mark all notifications as read
router.patch('/read-all', auth, async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user.id, read: false },
      { read: true }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
