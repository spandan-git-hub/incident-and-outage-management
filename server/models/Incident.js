import mongoose from 'mongoose';

const incidentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedOperator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  assignmentMethod: {
    type: String,
    enum: ['manual', 'auto'],
    default: null
  },
  status: {
    type: String,
    enum: ['open', 'acknowledged', 'in-progress', 'resolved', 'closed'],
    default: 'open'
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: [true, 'Severity is required']
  }
}, {
  timestamps: true
});

const Incident = mongoose.model('Incident', incidentSchema);

export default Incident;
