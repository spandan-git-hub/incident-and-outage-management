import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { API_BASE_URL } from '../config';
import { EmptyIncidents, EmptyComments } from '../components/ui/EmptyState';
import { SkeletonCard } from '../components/ui/Skeleton';
import Modal, { ConfirmationModal } from '../components/ui/Modal';
import { containerVariants, itemVariants, pageVariants } from '../utils/animations';

function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingIncident, setEditingIncident] = useState(null);
  const [assigningIncident, setAssigningIncident] = useState(null);
  const [updatingStatusIncident, setUpdatingStatusIncident] = useState(null);
  const [viewingCommentsIncident, setViewingCommentsIncident] = useState(null);
  const [deletingIncident, setDeletingIncident] = useState(null);
  const { user, hasRole } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/incidents`);
      setIncidents(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch incidents');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/incidents/${id}`);
      setIncidents(incidents.filter(inc => inc._id !== id));
      showToast('Incident deleted successfully', 'success');
      setDeletingIncident(null);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete incident', 'error');
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
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        className="max-w-7xl mx-auto pb-8 space-y-4"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-2">
            <div className="h-10 w-64 skeleton rounded-lg" />
            <div className="h-4 w-48 skeleton rounded" />
          </div>
          <div className="h-12 w-40 skeleton rounded-xl" />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto pb-8"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gradient-accent">
            🎫 Incident Management
          </h1>
          <p className="text-gray-600 mt-1">Track, assign, and resolve incidents</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <span>✨</span>
          <span>Create Incident</span>
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="card bg-red-50 border-red-200 mb-6"
          >
            <div className="flex items-center gap-3 text-red-700">
              <span className="text-2xl">⚠️</span>
              <p>{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={itemVariants} className="space-y-4">
        <AnimatePresence mode="popLayout">
          {incidents.length === 0 ? (
            <EmptyIncidents onCreateClick={() => setShowCreateForm(true)} />
          ) : (
            incidents.map((incident, index) => (
              <motion.div
                key={incident._id}
                variants={itemVariants}
                layout
                whileHover={{ y: -4, boxShadow: "0 12px 28px rgba(0,0,0,0.12)" }}
                transition={{ type: "spring", stiffness: 300 }}
                className="card-interactive"
              >
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {incident.title}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <span className={`badge ${getSeverityColor(incident.severity)}`}>
                          {incident.severity}
                        </span>
                        <span className={`badge ${getStatusColor(incident.status)}`}>
                          {incident.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">{incident.description}</p>
                    <div className="text-sm text-gray-500 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">👤 Reporter:</span>
                        <span>{incident.reporter?.name}</span>
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                          {incident.reporter?.role}
                        </span>
                      </div>
                      {incident.assignedOperator ? (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-2"
                        >
                          <span className="font-medium">🎯 Assigned:</span>
                          <span>{incident.assignedOperator.name}</span>
                          {incident.assignmentMethod && (
                            <span className="px-2 py-0.5 rounded text-xs bg-green-100 text-green-700">
                              {incident.assignmentMethod}
                            </span>
                          )}
                        </motion.div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-orange-600">⚠️ Unassigned</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="font-medium">🕒 Created:</span>
                        <span>{new Date(incident.createdAt).toLocaleString('en-GB', { 
                          day: '2-digit', 
                          month: '2-digit', 
                          year: 'numeric', 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex lg:flex-col flex-wrap gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setViewingCommentsIncident(incident)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all font-medium flex items-center gap-2 shadow-md"
                    >
                      <span>💬</span>
                      <span>Comments</span>
                    </motion.button>
                    {canUpdateStatus(incident) && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setUpdatingStatusIncident(incident)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-medium flex items-center gap-2 shadow-md"
                      >
                        <span>🔄</span>
                        <span>Status</span>
                      </motion.button>
                    )}
                    {hasRole('admin') && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setAssigningIncident(incident)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium flex items-center gap-2 shadow-md"
                      >
                        <span>👤</span>
                        <span>Assign</span>
                      </motion.button>
                    )}
                    {hasRole('operator', 'admin') && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setEditingIncident(incident)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium flex items-center gap-2 shadow-md"
                      >
                        <span>✏️</span>
                        <span>Edit</span>
                      </motion.button>
                    )}
                    {hasRole('admin') && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setDeletingIncident(incident)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium flex items-center gap-2 shadow-md"
                      >
                        <span>🗑️</span>
                        <span>Delete</span>
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

      {/* Comments Modal */}
      <AnimatePresence>
        {viewingCommentsIncident && (
          <CommentsModal
            incident={viewingCommentsIncident}
            onClose={() => setViewingCommentsIncident(null)}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deletingIncident}
        onClose={() => setDeletingIncident(null)}
        onConfirm={() => handleDelete(deletingIncident._id)}
        title="Delete Incident"
        message={`Are you sure you want to delete "${deletingIncident?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </motion.div>
  );
}

// Create Incident Modal Component
function CreateIncidentModal({ onClose, onSuccess }) {
  const { showToast } = useToast();
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
      await axios.post(`${API_BASE_URL}/api/incidents`, formData);
      showToast('Incident created successfully!', 'success');
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create incident');
      showToast('Failed to create incident', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Create New Incident"
      size="md"
    >
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-red-50 border-red-200 mb-4"
        >
          <p className="text-red-700">{error}</p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="input"
            placeholder="Brief summary of the incident"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={5}
            className="input resize-none"
            placeholder="Detailed description of the incident"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                className={`px-4 py-3 rounded-xl border-2 transition capitalize font-medium ${
                  formData.severity === severity
                    ? getSeverityBorderColor(severity) + ' bg-opacity-10'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {getSeverityIcon(severity)} {severity}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <motion.button
            type="submit"
            disabled={submitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary flex-1"
          >
            {submitting ? 'Creating...' : 'Create Incident'}
          </motion.button>
          <motion.button
            type="button"
            onClick={onClose}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-secondary flex-1"
          >
            Cancel
          </motion.button>
        </div>
      </form>
    </Modal>
  );
}

// Helper functions for severity styling
const getSeverityIcon = (severity) => {
  const icons = {
    low: '🔵',
    medium: '🟡',
    high: '🟠',
    critical: '🔴'
  };
  return icons[severity] || '⚪';
};

const getSeverityBorderColor = (severity) => {
  const colors = {
    low: 'border-blue-500 bg-blue-50',
    medium: 'border-yellow-500 bg-yellow-50',
    high: 'border-orange-500 bg-orange-50',
    critical: 'border-red-500 bg-red-50'
  };
  return colors[severity] || 'border-gray-500';
};

// Edit Incident Modal Component
function EditIncidentModal({ incident, onClose, onSuccess }) {
  const { showToast } = useToast();
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
      await axios.put(`${API_BASE_URL}/api/incidents/${incident._id}`, formData);
      showToast('Incident updated successfully!', 'success');
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update incident');
      showToast('Failed to update incident', 'error');
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
  const { showToast } = useToast();
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
      const response = await axios.get(`${API_BASE_URL}/api/incidents/operators/list`);
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

      await axios.patch(`${API_BASE_URL}/api/incidents/${incident._id}/assign`, payload);
      showToast(`Incident assigned successfully via ${assignmentMethod} method!`, 'success');
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign incident');
      showToast('Failed to assign incident', 'error');
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
  const { showToast } = useToast();
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
      await axios.patch(`${API_BASE_URL}/api/incidents/${incident._id}/status`, formData);
      showToast('Status/Severity updated successfully!', 'success');
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
      showToast('Failed to update status', 'error');
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

// Comments Modal Component
function CommentsModal({ incident, onClose }) {
  const { showToast } = useToast();
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
    const interval = setInterval(fetchComments, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/comments/${incident._id}`);
      setComments(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/comments`, {
        incidentId: incident._id,
        content: newComment
      });
      
      setComments([...comments, response.data]);
      setNewComment('');
      showToast('Comment added successfully!', 'success');
    } catch (error) {
      console.error('Error adding comment:', error);
      showToast('Failed to add comment', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">💬</span>
            <span>Comments</span>
          </div>
          <p className="text-sm text-white/90 font-normal">{incident.title}</p>
        </div>
      }
      size="2xl"
    >
      <div className="space-y-4">
        {/* Comments List */}
        <div className="max-h-96 overflow-y-auto scrollbar-thin space-y-4 pr-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-500">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-3 border-gray-300 border-t-primary-600 rounded-full mb-3"
              />
              <p className="text-sm">Loading comments...</p>
            </div>
          ) : comments.length === 0 ? (
            <EmptyComments />
          ) : (
            <AnimatePresence>
              {comments.map((comment, index) => (
                <motion.div
                  key={comment._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="card bg-gray-50"
                >
                  <div className="flex items-start gap-3">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0"
                    >
                      {comment.author.name.charAt(0).toUpperCase()}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-900">
                          {comment.author.name}
                        </span>
                        <span className="badge bg-blue-100 text-blue-700">
                          {comment.author.role}
                        </span>
                        {comment.author._id === user?.id && (
                          <span className="text-xs text-gray-500">(You)</span>
                        )}
                        <span className="text-xs text-gray-500 ml-auto">
                          {new Date(comment.createdAt).toLocaleString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-gray-700 break-words whitespace-pre-wrap leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Comment Form */}
        <div className="pt-4 border-t">
          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              rows={3}
              className="input resize-none"
              disabled={submitting}
            />
            <div className="flex justify-end gap-2">
              <motion.button
                type="button"
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-secondary"
              >
                Close
              </motion.button>
              <motion.button
                type="submit"
                disabled={submitting || !newComment.trim()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary"
              >
                {submitting ? 'Posting...' : 'Post Comment'}
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}

export default Incidents;
