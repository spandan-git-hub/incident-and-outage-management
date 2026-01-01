import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingIncident, setEditingIncident] = useState(null);
  const [assigningIncident, setAssigningIncident] = useState(null);
  const [updatingStatusIncident, setUpdatingStatusIncident] = useState(null);
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/incidents');
      setIncidents(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch incidents');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this incident?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/incidents/${id}`);
      setIncidents(incidents.filter(inc => inc._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete incident');
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[severity] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    const colors = {
      open: 'bg-purple-100 text-purple-800',
      acknowledged: 'bg-cyan-100 text-cyan-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const canUpdateStatus = (incident) => {
    if (hasRole('admin')) return true;
    if (incident.assignedOperator && incident.assignedOperator._id === user?.id) {
      return true;
    }
    return false;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading incidents...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Incidents</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          + Create Incident
        </motion.button>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-4"
        >
          {error}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid gap-4"
      >
        <AnimatePresence>
          {incidents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-gray-500"
            >
              No incidents found. Create one to get started!
            </motion.div>
          ) : (
            incidents.map((incident) => (
              <motion.div
                key={incident._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {incident.title}
                      </h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(incident.severity)}`}>
                        {incident.severity}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(incident.status)}`}>
                        {incident.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{incident.description}</p>
                    <div className="text-sm text-gray-500 space-y-1">
                      <div>
                        <span className="font-medium">Reporter:</span> {incident.reporter?.name} ({incident.reporter?.role})
                      </div>
                      {incident.assignedOperator ? (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-2"
                        >
                          <span className="font-medium">Assigned:</span> 
                          <span>{incident.assignedOperator.name}</span>
                          {incident.assignmentMethod && (
                            <span className="px-2 py-0.5 rounded text-xs bg-green-100 text-green-700">
                              {incident.assignmentMethod}
                            </span>
                          )}
                        </motion.div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-orange-600">Unassigned</span>
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Created:</span> {new Date(incident.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    {canUpdateStatus(incident) && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setUpdatingStatusIncident(incident)}
                        className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                      >
                        Status
                      </motion.button>
                    )}
                    {hasRole('admin') && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setAssigningIncident(incident)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                      >
                        Assign
                      </motion.button>
                    )}
                    {hasRole('operator', 'admin') && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setEditingIncident(incident)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                      >
                        Edit
                      </motion.button>
                    )}
                    {hasRole('admin') && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(incident._id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                      >
                        Delete
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>

      {/* Create Form Modal */}
      <AnimatePresence>
        {showCreateForm && (
          <CreateIncidentModal
            onClose={() => setShowCreateForm(false)}
            onSuccess={() => {
              setShowCreateForm(false);
              fetchIncidents();
            }}
          />
        )}
      </AnimatePresence>

      {/* Edit Form Modal */}
      <AnimatePresence>
        {editingIncident && (
          <EditIncidentModal
            incident={editingIncident}
            onClose={() => setEditingIncident(null)}
            onSuccess={() => {
              setEditingIncident(null);
              fetchIncidents();
            }}
          />
        )}
      </AnimatePresence>

      {/* Assignment Modal */}
      <AnimatePresence>
        {assigningIncident && (
          <AssignIncidentModal
            incident={assigningIncident}
            onClose={() => setAssigningIncident(null)}
            onSuccess={() => {
              setAssigningIncident(null);
              fetchIncidents();
            }}
          />
        )}
      </AnimatePresence>

      {/* Status Update Modal */}
      <AnimatePresence>
        {updatingStatusIncident && (
          <UpdateStatusModal
            incident={updatingStatusIncident}
            onClose={() => setUpdatingStatusIncident(null)}
            onSuccess={() => {
              setUpdatingStatusIncident(null);
              fetchIncidents();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Create Incident Modal Component
function CreateIncidentModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'medium'
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await axios.post('http://localhost:5000/api/incidents', formData);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create incident');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Create Incident</h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief summary of the incident"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Detailed description of the incident"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Severity *
            </label>
            <select
              value={formData.severity}
              onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
              {submitting ? 'Creating...' : 'Create'}
            </motion.button>
            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// Edit Incident Modal Component
function EditIncidentModal({ incident, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: incident.title,
    description: incident.description,
    severity: incident.severity,
    status: incident.status
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await axios.put(`http://localhost:5000/api/incidents/${incident._id}`, formData);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update incident');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Edit Incident</h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="open">Open</option>
              <option value="acknowledged">Acknowledged</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Severity *
            </label>
            <select
              value={formData.severity}
              onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
              {submitting ? 'Updating...' : 'Update'}
            </motion.button>
            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// Assign Incident Modal Component
function AssignIncidentModal({ incident, onClose, onSuccess }) {
  const [operators, setOperators] = useState([]);
  const [selectedOperator, setSelectedOperator] = useState('');
  const [assignmentMethod, setAssignmentMethod] = useState('manual');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOperators();
  }, []);

  const fetchOperators = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/incidents/operators/list');
      setOperators(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load operators');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        method: assignmentMethod
      };

      if (assignmentMethod === 'manual') {
        if (!selectedOperator) {
          setError('Please select an operator');
          setSubmitting(false);
          return;
        }
        payload.operatorId = selectedOperator;
      }

      await axios.patch(`http://localhost:5000/api/incidents/${incident._id}/assign`, payload);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign incident');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Assign Incident</h2>

        <div className="mb-4 p-3 bg-gray-50 rounded">
          <p className="font-medium text-gray-700">{incident.title}</p>
          <p className="text-sm text-gray-500">Severity: {incident.severity}</p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-4">Loading operators...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assignment Method
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="manual"
                    checked={assignmentMethod === 'manual'}
                    onChange={(e) => setAssignmentMethod(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span>Manual Assignment</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="auto"
                    checked={assignmentMethod === 'auto'}
                    onChange={(e) => setAssignmentMethod(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span>Auto Assignment (Round-Robin)</span>
                </label>
              </div>
            </div>

            {assignmentMethod === 'manual' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Operator *
                </label>
                <select
                  value={selectedOperator}
                  onChange={(e) => setSelectedOperator(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Select Operator --</option>
                  {operators.map((op) => (
                    <option key={op._id} value={op._id}>
                      {op.name} ({op.role})
                    </option>
                  ))}
                </select>
              </motion.div>
            )}

            {assignmentMethod === 'auto' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 bg-blue-50 rounded text-sm text-blue-700"
              >
                System will automatically assign to the next available operator using round-robin.
              </motion.div>
            )}

            <div className="flex gap-3 pt-4">
              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition"
              >
                {submitting ? 'Assigning...' : 'Assign'}
              </motion.button>
              <motion.button
                type="button"
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </motion.button>
            </div>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

// Update Status Modal Component
function UpdateStatusModal({ incident, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    status: incident.status,
    severity: incident.severity
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await axios.patch(`http://localhost:5000/api/incidents/${incident._id}/status`, formData);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setSubmitting(false);
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      low: 'border-blue-500',
      medium: 'border-yellow-500',
      high: 'border-orange-500',
      critical: 'border-red-500'
    };
    return colors[severity] || 'border-gray-500';
  };

  const getStatusColor = (status) => {
    const colors = {
      open: 'border-purple-500',
      acknowledged: 'border-cyan-500',
      'in-progress': 'border-blue-500',
      resolved: 'border-green-500',
      closed: 'border-gray-500'
    };
    return colors[status] || 'border-gray-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Update Status & Severity</h2>

        <div className="mb-4 p-3 bg-gray-50 rounded">
          <p className="font-medium text-gray-700">{incident.title}</p>
          <div className="flex gap-2 mt-2">
            <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
              Current: {incident.status}
            </span>
            <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded">
              Severity: {incident.severity}
            </span>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['open', 'acknowledged', 'in-progress', 'resolved', 'closed'].map((status) => (
                <motion.button
                  key={status}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFormData({ ...formData, status })}
                  className={`px-3 py-2 rounded-lg border-2 transition capitalize ${
                    formData.status === status
                      ? `${getStatusColor(status)} bg-opacity-10 font-medium`
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {status}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Severity *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['low', 'medium', 'high', 'critical'].map((severity) => (
                <motion.button
                  key={severity}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFormData({ ...formData, severity })}
                  className={`px-3 py-2 rounded-lg border-2 transition capitalize ${
                    formData.severity === severity
                      ? `${getSeverityColor(severity)} bg-opacity-10 font-medium`
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {severity}
                </motion.button>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 bg-blue-50 rounded text-sm text-blue-700"
          >
            <p className="font-medium mb-1">Workflow Guide:</p>
            <ul className="text-xs space-y-1">
              <li>• <strong>Open:</strong> Newly created</li>
              <li>• <strong>Acknowledged:</strong> Seen by operator</li>
              <li>• <strong>In Progress:</strong> Being worked on</li>
              <li>• <strong>Resolved:</strong> Fixed, awaiting confirmation</li>
              <li>• <strong>Closed:</strong> Completed</li>
            </ul>
          </motion.div>

          <div className="flex gap-3 pt-4">
            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition"
            >
              {submitting ? 'Updating...' : 'Update'}
            </motion.button>
            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default Incidents;
