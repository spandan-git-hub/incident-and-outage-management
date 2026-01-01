import express from 'express';
import Comment from '../models/Comment.js';
import Incident from '../models/Incident.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Helper function to create notification
const createNotification = async (type, message, userId, incidentId) => {
  try {
    const notification = new Notification({
      type,
      message,
      userId,
      incidentId
    });
    await notification.save();
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

// POST /api/comments - Create a comment
router.post('/', auth, async (req, res) => {
  try {
    const { incidentId, content } = req.body;

    if (!incidentId || !content) {
      return res.status(400).json({ 
        message: 'Incident ID and content are required' 
      });
    }

    // Verify incident exists
    const incident = await Incident.findById(incidentId)
      .populate('reporter', '_id')
      .populate('assignedOperator', '_id');

    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    const comment = new Comment({
      incidentId,
      author: req.user.id,
      content
    });

    await comment.save();
    await comment.populate('author', 'name email role');

    // Get current user info
    const currentUser = await User.findById(req.user.id);

    // Notify reporter if they're not the one commenting
    if (incident.reporter._id.toString() !== req.user.id) {
      await createNotification(
        'incident_updated',
        `${currentUser.name} commented on incident: "${incident.title}"`,
        incident.reporter._id,
        incident._id
      );
    }

    // Notify assigned operator if they exist and aren't the one commenting
    if (incident.assignedOperator && incident.assignedOperator._id.toString() !== req.user.id) {
      await createNotification(
        'incident_updated',
        `${currentUser.name} commented on incident: "${incident.title}"`,
        incident.assignedOperator._id,
        incident._id
      );
    }

    // Notify all admins (except the one commenting)
    const admins = await User.find({ role: 'admin' });
    for (const admin of admins) {
      if (admin._id.toString() !== req.user.id) {
        await createNotification(
          'incident_updated',
          `${currentUser.name} commented on incident: "${incident.title}"`,
          admin._id,
          incident._id
        );
      }
    }

    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/comments/:incidentId - Get all comments for an incident
router.get('/:incidentId', auth, async (req, res) => {
  try {
    const comments = await Comment.find({ incidentId: req.params.incidentId })
      .populate('author', 'name email role')
      .sort({ createdAt: 1 }); // Oldest first

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
