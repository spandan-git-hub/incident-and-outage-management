import express from 'express';
import Incident from '../models/Incident.js';
import auth from '../middleware/auth.js';
import role from '../middleware/role.js';

const router = express.Router();

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

export default router;
