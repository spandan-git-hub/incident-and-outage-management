import express from 'express';
import Incident from '../models/Incident.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import role from '../middleware/role.js';

const router = express.Router();

// Helper function for auto-assignment (round-robin)
const autoAssignOperator = async () => {
  try {
    // Get all operators and admins
    const operators = await User.find({ 
      role: { $in: ['operator', 'admin'] } 
    }).select('_id');

    if (operators.length === 0) {
      return null;
    }

    // Get the last assigned incident
    const lastAssigned = await Incident.findOne({ 
      assignedOperator: { $ne: null } 
    }).sort({ updatedAt: -1 });

    if (!lastAssigned) {
      // No previous assignment, return first operator
      return operators[0]._id;
    }

    // Find current operator's index
    const currentIndex = operators.findIndex(
      op => op._id.toString() === lastAssigned.assignedOperator.toString()
    );

    // Get next operator (round-robin)
    const nextIndex = (currentIndex + 1) % operators.length;
    return operators[nextIndex]._id;
  } catch (error) {
    return null;
  }
};

// POST /api/incidents - Create incident (all authenticated users)
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, severity, assignedOperator } = req.body;

    const incident = new Incident({
      title,
      description,
      severity,
      reporter: req.user.id,
      assignedOperator: assignedOperator || null
    });

    await incident.save();
    await incident.populate('reporter', 'name email role');
    if (incident.assignedOperator) {
      await incident.populate('assignedOperator', 'name email role');
    }

    res.status(201).json(incident);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/incidents - Get all incidents
router.get('/', auth, async (req, res) => {
  try {
    const incidents = await Incident.find()
      .populate('reporter', 'name email role')
      .populate('assignedOperator', 'name email role')
      .sort({ createdAt: -1 });

    res.json(incidents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/incidents/operators/list - Get all operators (admin only)
router.get('/operators/list', auth, role('admin'), async (req, res) => {
  try {
    const operators = await User.find({ 
      role: { $in: ['operator', 'admin'] } 
    }).select('_id name email role');

    res.json(operators);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/incidents/:id - Get single incident
router.get('/:id', auth, async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id)
      .populate('reporter', 'name email role')
      .populate('assignedOperator', 'name email role');

    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    res.json(incident);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/incidents/:id - Update incident (operator/admin only)
router.put('/:id', auth, role('operator', 'admin'), async (req, res) => {
  try {
    const { title, description, status, severity, assignedOperator } = req.body;

    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    // Update fields
    if (title) incident.title = title;
    if (description) incident.description = description;
    if (status) incident.status = status;
    if (severity) incident.severity = severity;
    if (assignedOperator !== undefined) incident.assignedOperator = assignedOperator || null;

    await incident.save();
    await incident.populate('reporter', 'name email role');
    if (incident.assignedOperator) {
      await incident.populate('assignedOperator', 'name email role');
    }

    res.json(incident);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/incidents/:id - Delete incident (admin only)
router.delete('/:id', auth, role('admin'), async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    await incident.deleteOne();
    res.json({ message: 'Incident deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH /api/incidents/:id/assign - Assign operator to incident (admin only)
router.patch('/:id/assign', auth, role('admin'), async (req, res) => {
  try {
    const { operatorId, method } = req.body; // method: 'manual' or 'auto'

    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    let assignedOperatorId = null;
    let assignmentMethod = 'manual';

    if (method === 'auto') {
      // Auto-assign using round-robin
      assignedOperatorId = await autoAssignOperator();
      assignmentMethod = 'auto';

      if (!assignedOperatorId) {
        return res.status(400).json({ 
          message: 'No operators available for auto-assignment' 
        });
      }
    } else {
      // Manual assignment
      if (!operatorId) {
        return res.status(400).json({ 
          message: 'Operator ID is required for manual assignment' 
        });
      }

      // Verify the operator exists and has correct role
      const operator = await User.findById(operatorId);
      if (!operator) {
        return res.status(404).json({ message: 'Operator not found' });
      }

      if (!['operator', 'admin'].includes(operator.role)) {
        return res.status(400).json({ 
          message: 'User must be an operator or admin' 
        });
      }

      assignedOperatorId = operatorId;
      assignmentMethod = 'manual';
    }

    // Update incident
    incident.assignedOperator = assignedOperatorId;
    incident.assignmentMethod = assignmentMethod;
    if (incident.status === 'open') {
      incident.status = 'in-progress';
    }

    await incident.save();
    await incident.populate('reporter', 'name email role');
    await incident.populate('assignedOperator', 'name email role');

    res.json(incident);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH /api/incidents/:id/status - Update incident status/severity (assigned operator or admin only)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status, severity } = req.body;

    if (!status && !severity) {
      return res.status(400).json({ 
        message: 'At least one field (status or severity) is required' 
      });
    }

    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    // Check if user is admin or the assigned operator
    const isAdmin = req.user.role === 'admin';
    const isAssignedOperator = incident.assignedOperator && 
                               incident.assignedOperator.toString() === req.user.id;

    if (!isAdmin && !isAssignedOperator) {
      return res.status(403).json({ 
        message: 'Only assigned operator or admin can update status/severity' 
      });
    }

    // Update fields
    if (status) {
      // Validate status transitions
      const validStatuses = ['open', 'acknowledged', 'in-progress', 'resolved', 'closed'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
      incident.status = status;
    }

    if (severity) {
      const validSeverities = ['low', 'medium', 'high', 'critical'];
      if (!validSeverities.includes(severity)) {
        return res.status(400).json({ message: 'Invalid severity' });
      }
      incident.severity = severity;
    }

    await incident.save();
    await incident.populate('reporter', 'name email role');
    if (incident.assignedOperator) {
      await incident.populate('assignedOperator', 'name email role');
    }

    res.json(incident);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
