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

// Action Menu Dropdown Component
function ActionMenu({ incident, onViewComments, onUpdateStatus, onAssign, onEdit, onDelete, canUpdateStatus, hasRole }) {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      label: 'View Comments',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      onClick: () => { onViewComments(); setIsOpen(false); },
      show: true,
      color: 'text-gray-700 hover:bg-gray-50'
    },
    {
      label: 'Update Status',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      onClick: () => { onUpdateStatus(); setIsOpen(false); },
      show: canUpdateStatus,
      color: 'text-purple-700 hover:bg-purple-50'
    },
    {
      label: 'Assign Operator',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
      onClick: () => { onAssign(); setIsOpen(false); },
      show: hasRole('admin'),
      color: 'text-green-700 hover:bg-green-50'
    },
    {
      label: 'Edit Incident',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      onClick: () => { onEdit(); setIsOpen(false); },
      show: hasRole('operator', 'admin'),
      color: 'text-blue-700 hover:bg-blue-50'
    },
    {
      label: 'Delete Incident',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
      onClick: () => { onDelete(); setIsOpen(false); },
      show: hasRole('admin'),
      color: 'text-red-700 hover:bg-red-50'
    }
  ].filter(action => action.show);

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold text-sm flex items-center gap-2 shadow-md"
      >
        <span>Actions</span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-2xl border-2 border-gray-200 py-2 z-20 overflow-hidden"
            >
              {actions.map((action, index) => (
                <motion.button
                  key={action.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={action.onClick}
                  className={`w-full px-4 py-2.5 text-left flex items-center gap-3 transition-colors font-medium text-sm ${action.color}`}
                >
                  {action.icon}
                  <span>{action.label}</span>
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

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
      {/* Header */}
      <motion.div 
        variants={itemVariants} 
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
      >
        <div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Incident Management
          </h1>
          <p className="text-gray-600 text-lg">Track, assign, and resolve incidents efficiently</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateForm(true)}
          className="px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Create Incident</span>
        </motion.button>
      </motion.div>

      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3 shadow-md"
          >
            <div className="p-2 bg-red-100 rounded-lg">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-800 font-semibold flex-1">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Incidents List */}
      <motion.div variants={itemVariants} className="space-y-5">
        <AnimatePresence mode="popLayout">
          {incidents.length === 0 ? (
            <EmptyIncidents onCreateClick={() => setShowCreateForm(true)} />
          ) : (
            incidents.map((incident) => (
              <motion.div
                key={incident._id}
                variants={itemVariants}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
                className="relative group"
              >
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                
                {/* Card */}
                <div className="relative bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-md group-hover:shadow-xl transition-all duration-300">
                  <div className="flex flex-col lg:flex-row justify-between gap-6">
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Title and Badges */}
                      <div className="flex flex-wrap items-start gap-3 mb-4">
                        <h3 className="text-2xl font-bold text-gray-900 flex-1 min-w-0">
                          {incident.title}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <span className={`badge badge-${incident.severity}`}>
                            {getSeverityIcon(incident.severity)} {incident.severity}
                          </span>
                          <span className={`badge badge-${incident.status}`}>
                            {incident.status}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 mb-5 line-clamp-2 text-base leading-relaxed">
                        {incident.description}
                      </p>

                      {/* Metadata */}
                      <div className="space-y-3">
                        {/* Reporter */}
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Reporter</span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-sm font-semibold text-gray-900">{incident.reporter?.name}</span>
                              <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                                {incident.reporter?.role}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Assignment */}
                        {incident.assignedOperator ? (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3"
                          >
                            <div className="p-2 bg-green-100 rounded-lg">
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Assigned To</span>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-sm font-semibold text-gray-900">{incident.assignedOperator.name}</span>
                                {incident.assignmentMethod && (
                                  <span className="px-2 py-0.5 bg-green-100 rounded-full text-xs font-medium text-green-700">
                                    {incident.assignmentMethod}
                                  </span>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 rounded-lg">
                              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <span className="text-sm font-semibold text-orange-600">Unassigned</span>
                          </div>
                        )}

                        {/* Created Date */}
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Created</span>
                            <p className="text-sm font-semibold text-gray-900 mt-0.5">
                              {new Date(incident.createdAt).toLocaleString('en-GB', { 
                                day: '2-digit', 
                                month: 'short', 
                                year: 'numeric', 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions Menu */}
                    <div className="flex lg:flex-col gap-3 lg:min-w-[140px]">
                      <ActionMenu
                        incident={incident}
                        onViewComments={() => setViewingCommentsIncident(incident)}
                        onUpdateStatus={() => setUpdatingStatusIncident(incident)}
                        onAssign={() => setAssigningIncident(incident)}
                        onEdit={() => setEditingIncident(incident)}
                        onDelete={() => setDeletingIncident(incident)}
                        canUpdateStatus={canUpdateStatus(incident)}
                        hasRole={hasRole}
                      />
                    </div>
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
