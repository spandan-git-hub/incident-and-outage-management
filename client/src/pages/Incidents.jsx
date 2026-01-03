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
      color: 'text-orange-700 hover:bg-orange-50'
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
        whileHover={{ scale: 1.02 }}
        onClick={() => setIsOpen(!isOpen)}
        className="px-5 py-2.5 bg-white border-2 border-purple-300 hover:border-purple-400 text-gray-900 rounded-xl transition-all font-semibold text-sm flex items-center gap-2 shadow-sm hover:shadow-md"
      >
        <span>Actions</span>
        <svg className={`w-4 h-4 text-purple-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className="absolute right-0 top-14 w-56 bg-white rounded-xl shadow-2xl border-2 border-purple-100 py-2 z-20 overflow-hidden"
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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
      low: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md',
      medium: 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white shadow-md',
      high: 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-md',
      critical: 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-md'
    };
    return colors[severity] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    const colors = {
      open: 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-md',
      acknowledged: 'bg-gradient-to-br from-cyan-500 to-cyan-600 text-white shadow-md',
      'in-progress': 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md',
      resolved: 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-md',
      closed: 'bg-gradient-to-br from-gray-500 to-gray-600 text-white shadow-md'
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Header Skeleton */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between items-center">
              <div className="space-y-3">
                <div className="h-10 w-80 bg-gray-200 rounded-xl animate-pulse" />
                <div className="h-6 w-64 bg-gray-200 rounded-lg animate-pulse" />
              </div>
              <div className="h-12 w-44 bg-gray-200 rounded-xl animate-pulse" />
            </div>
          </div>
          {/* Cards Skeleton */}
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg space-y-4"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-3 flex-1">
                  <div className="h-8 w-2/3 bg-gray-200 rounded-lg animate-pulse" />
                  <div className="h-20 w-full bg-gray-200 rounded-lg animate-pulse" />
                  <div className="flex gap-3">
                    <div className="h-16 w-48 bg-gray-200 rounded-lg animate-pulse" />
                    <div className="h-16 w-48 bg-gray-200 rounded-lg animate-pulse" />
                  </div>
                </div>
                <div className="h-11 w-32 bg-gray-200 rounded-xl animate-pulse" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Incident Management
              </h1>
              <p className="text-lg text-gray-600">Track, assign, and resolve incidents efficiently</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2.5"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Create Incident</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 shadow-lg border-2 border-red-200"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-md flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Error</h3>
                  <p className="text-gray-600">{error}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Incidents List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {incidents.length === 0 ? (
              <EmptyIncidents onCreateClick={() => setShowCreateForm(true)} />
            ) : (
              incidents.map((incident, index) => (
                <motion.div
                  key={incident._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border-2 border-purple-100 hover:border-purple-200"
                >
                  <div className="flex flex-col lg:flex-row justify-between gap-6">
                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-5">
                      {/* Title and Badges */}
                      <div className="flex flex-wrap items-start gap-3">
                        <h3 className="text-2xl font-bold text-gray-900 flex-1 min-w-0">
                          {incident.title}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide ${getSeverityColor(incident.severity)}`}>
                            {incident.severity}
                          </span>
                          <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide ${getStatusColor(incident.status)}`}>
                            {incident.status.replace('-', ' ')}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 line-clamp-2 text-base leading-relaxed">
                        {incident.description}
                      </p>

                      {/* Metadata Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Reporter */}
                        <div className="bg-gradient-to-br from-slate-50 to-purple-50/30 rounded-xl p-4 border border-purple-100">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center shadow-sm">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Reporter</span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-gray-900 truncate">{incident.reporter?.name}</span>
                              </div>
                            </div>
                          </div>
                          <span className="inline-block px-2 py-1 bg-white rounded-md text-xs font-semibold text-gray-600 border border-gray-200">
                            {incident.reporter?.role}
                          </span>
                        </div>

                        {/* Assignment */}
                        {incident.assignedOperator ? (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-4 border border-green-200"
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-sm">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Assigned To</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold text-gray-900 truncate">{incident.assignedOperator.name}</span>
                                </div>
                              </div>
                            </div>
                            {incident.assignmentMethod && (
                              <span className="inline-block px-2 py-1 bg-white rounded-md text-xs font-semibold text-green-700 border border-green-200">
                                {incident.assignmentMethod === 'manual' ? 'Manual' : incident.assignmentMethod === 'auto' ? 'Auto' : incident.assignmentMethod}
                              </span>
                            )}
                          </motion.div>
                        ) : (
                          <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-4 border border-orange-200">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-sm">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <div>
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Status</span>
                                <span className="text-sm font-bold text-orange-700">Unassigned</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Created Date */}
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Created</span>
                              <p className="text-sm font-bold text-gray-900">
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
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

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
        <AnimatePresence>
          {deletingIncident && (
            <DeleteIncidentModal
              incident={deletingIncident}
              onClose={() => setDeletingIncident(null)}
              onConfirm={() => handleDelete(deletingIncident._id)}
            />
          )}
        </AnimatePresence>
      </div>
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full border-2 border-purple-100 max-h-[90vh] overflow-y-auto scrollbar-thin"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center flex-shrink-0 shadow-md">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Create New Incident</h2>
            <p className="text-sm text-gray-600">Report a new incident for tracking and resolution</p>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3"
          >
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-800 font-medium">{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2.5">
              Incident Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all placeholder:text-gray-400"
              placeholder="Brief summary of the incident"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2.5">
              Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all resize-none placeholder:text-gray-400 scrollbar-thin"
              placeholder="Detailed description of the incident"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Severity Level *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['low', 'medium', 'high', 'critical'].map((severity) => (
                <motion.button
                  key={severity}
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setFormData({ ...formData, severity })}
                  className={`px-4 py-3.5 rounded-xl border-2 transition-all capitalize font-semibold flex items-center justify-center shadow-sm ${
                    formData.severity === severity
                      ? getSeverityStyle(severity)
                      : 'border-gray-300 hover:border-gray-400 bg-white text-gray-700 hover:shadow-md'
                  }`}
                >
                  <span>{severity}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-3 border-t border-gray-200 mt-6">
            <motion.button
              type="button"
              onClick={onClose}
              disabled={submitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 font-semibold transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Creating...' : 'Create Incident'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// Helper functions for severity styling
const getSeverityStyle = (severity) => {
  const styles = {
    low: 'border-blue-400 bg-blue-50 text-blue-700 shadow-md',
    medium: 'border-yellow-400 bg-yellow-50 text-yellow-700 shadow-md',
    high: 'border-orange-400 bg-orange-50 text-orange-700 shadow-md',
    critical: 'border-red-400 bg-red-50 text-red-700 shadow-md'
  };
  return styles[severity] || 'border-gray-500 bg-gray-50 text-gray-700';
};

// Edit Incident Modal Component
function EditIncidentModal({ incident, onClose, onSuccess }) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    title: incident.title,
    description: incident.description
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
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full border-2 border-purple-100 max-h-[90vh] overflow-y-auto scrollbar-thin"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-md">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Edit Incident</h2>
            <p className="text-sm text-gray-600">Update incident title and description</p>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3"
          >
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-800 font-medium">{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2.5">
              Incident Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all placeholder:text-gray-400"
              placeholder="Brief summary of the incident"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2.5">
              Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={5}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all resize-none placeholder:text-gray-400 scrollbar-thin"
              placeholder="Detailed description of the incident"
            />
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Note</p>
                <p>To update status or severity, use the dedicated action buttons on the incident card.</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-3 border-t border-gray-200">
            <motion.button
              type="button"
              onClick={onClose}
              disabled={submitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 font-semibold transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Updating...' : 'Update Incident'}
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
      showToast(`Incident assigned successfully via ${assignmentMethod === 'manual' ? 'Manual' : 'Auto'} method!`, 'success');
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
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full border-2 border-purple-100 max-h-[90vh] overflow-y-auto scrollbar-thin"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center flex-shrink-0 shadow-md">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Assign Operator</h2>
            <p className="text-sm text-gray-600">Assign this incident to an available operator</p>
          </div>
        </div>

        <div className="mb-6 p-4 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl">
          <p className="font-semibold text-gray-900 mb-2">{incident.title}</p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Severity:</span>
            <span className="text-sm font-bold uppercase text-gray-900">{incident.severity}</span>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3"
          >
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-800 font-medium">{error}</p>
          </motion.div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 border-4 border-gray-300 border-t-green-500 rounded-full mb-3"
            />
            <p className="text-sm text-gray-600">Loading operators...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Assignment Method
              </label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:border-green-400 transition-all">
                  <input
                    type="radio"
                    value="manual"
                    checked={assignmentMethod === 'manual'}
                    onChange={(e) => setAssignmentMethod(e.target.value)}
                    className="w-5 h-5 text-green-600 focus:ring-green-500"
                  />
                  <div className="flex-1">
                    <span className="font-semibold text-gray-900">Manual Assignment</span>
                    <p className="text-xs text-gray-600 mt-0.5">Choose a specific operator</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:border-green-400 transition-all">
                  <input
                    type="radio"
                    value="auto"
                    checked={assignmentMethod === 'auto'}
                    onChange={(e) => setAssignmentMethod(e.target.value)}
                    className="w-5 h-5 text-green-600 focus:ring-green-500"
                  />
                  <div className="flex-1">
                    <span className="font-semibold text-gray-900">Auto Assignment</span>
                    <p className="text-xs text-gray-600 mt-0.5">Round-Robin Distribution</p>
                  </div>
                </label>
              </div>
            </div>

            {assignmentMethod === 'manual' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                  Select Operator *
                </label>
                <select
                  value={selectedOperator}
                  onChange={(e) => setSelectedOperator(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 hover:border-green-300 transition-all"
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
                className="bg-green-50 border-2 border-green-200 rounded-xl p-4"
              >
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div className="text-sm text-green-800">
                    <p className="font-semibold mb-1">Auto Assignment Enabled</p>
                    <p>The system will automatically assign this incident to the next available operator using Round-Robin Distribution.</p>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="flex gap-3 pt-3 border-t border-gray-200">
              <motion.button
                type="button"
                onClick={onClose}
                disabled={submitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 font-semibold transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Assigning...' : 'Assign Operator'}
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
      low: 'border-blue-500 bg-blue-50 text-blue-700',
      medium: 'border-yellow-500 bg-yellow-50 text-yellow-700',
      high: 'border-orange-500 bg-orange-50 text-orange-700',
      critical: 'border-red-500 bg-red-50 text-red-700'
    };
    return colors[severity] || 'border-gray-500 bg-gray-50 text-gray-700';
  };

  const getStatusColor = (status) => {
    const colors = {
      open: 'border-indigo-500 bg-indigo-50 text-indigo-700',
      acknowledged: 'border-cyan-500 bg-cyan-50 text-cyan-700',
      'in-progress': 'border-blue-500 bg-blue-50 text-blue-700',
      resolved: 'border-green-500 bg-green-50 text-green-700',
      closed: 'border-gray-500 bg-gray-50 text-gray-700'
    };
    return colors[status] || 'border-gray-500 bg-gray-50 text-gray-700';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full border-2 border-purple-100 max-h-[90vh] overflow-y-auto scrollbar-thin"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-md">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Update Status & Severity</h2>
            <p className="text-sm text-gray-600">Modify incident status and severity level</p>
          </div>
        </div>

        <div className="mb-6 p-4 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl">
          <p className="font-semibold text-gray-900 mb-3">{incident.title}</p>
          <div className="flex gap-2">
            <span className="text-xs px-3 py-1.5 bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-800 rounded-lg font-semibold uppercase">
              {incident.status}
            </span>
            <span className="text-xs px-3 py-1.5 bg-gradient-to-br from-orange-100 to-orange-200 text-orange-800 rounded-lg font-semibold uppercase">
              {incident.severity}
            </span>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3"
          >
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-800 font-medium">{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Status *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['open', 'acknowledged', 'in-progress', 'resolved', 'closed'].map((status) => (
                <motion.button
                  key={status}
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setFormData({ ...formData, status })}
                  className={`px-4 py-3 rounded-xl border-2 transition-all capitalize font-semibold shadow-sm ${
                    formData.status === status
                      ? getStatusColor(status) + ' shadow-md'
                      : 'border-gray-300 hover:border-gray-400 bg-white text-gray-700 hover:shadow-md'
                  }`}
                >
                  {status}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Severity Level *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['low', 'medium', 'high', 'critical'].map((severity) => (
                <motion.button
                  key={severity}
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setFormData({ ...formData, severity })}
                  className={`px-4 py-3 rounded-xl border-2 transition-all capitalize font-semibold shadow-sm ${
                    formData.severity === severity
                      ? getSeverityColor(severity) + ' shadow-md'
                      : 'border-gray-300 hover:border-gray-400 bg-white text-gray-700 hover:shadow-md'
                  }`}
                >
                  {severity}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-2">Workflow Guide</p>
                <ul className="space-y-1.5">
                  <li><strong>Open:</strong> Newly created incident</li>
                  <li><strong>Acknowledged:</strong> Seen by operator</li>
                  <li><strong>In Progress:</strong> Being actively worked on</li>
                  <li><strong>Resolved:</strong> Fixed, awaiting verification</li>
                  <li><strong>Closed:</strong> Completed and archived</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-3 border-t border-gray-200">
            <motion.button
              type="button"
              onClick={onClose}
              disabled={submitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 font-semibold transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Updating...' : 'Update Status'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// Delete Incident Modal Component
function DeleteIncidentModal({ incident, onClose, onConfirm }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    await onConfirm();
    setIsDeleting(false);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full border-2 border-purple-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0 shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Delete Incident</h2>
            <p className="text-gray-600 leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-gray-900">"{incident.title}"</span>? This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="text-sm text-red-800">
              <p className="font-semibold mb-1">Warning: This action is permanent</p>
              <p>All incident data, comments, and history will be permanently deleted.</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <motion.button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 px-6 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 font-semibold transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </motion.button>
          <motion.button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? 'Deleting...' : 'Delete Incident'}
          </motion.button>
        </div>
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl p-6 max-w-3xl w-full border-2 border-purple-100 max-h-[90vh] overflow-y-auto scrollbar-thin"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center flex-shrink-0 shadow-md">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Comments & Discussion</h2>
            <p className="text-sm text-gray-600">{incident.title}</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
            </svg>
            <span className="text-sm font-semibold text-gray-700">{comments.length}</span>
          </div>
        </div>

        <div className="space-y-4">
          {/* Comments List */}
          <div className="max-h-[400px] overflow-y-auto scrollbar-thin space-y-3 pr-2">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-10 h-10 border-4 border-gray-300 border-t-gray-600 rounded-full mb-3"
                />
                <p className="text-sm text-gray-600">Loading comments...</p>
              </div>
            ) : comments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-xl border-2 border-gray-200">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-gray-900 font-semibold mb-1">No comments yet</p>
                <p className="text-sm text-gray-600">Be the first to comment on this incident</p>
              </div>
            ) : (
              <AnimatePresence>
                {comments.map((comment, index) => (
                  <motion.div
                    key={comment._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-md"
                      >
                        {comment.author.name.charAt(0).toUpperCase()}
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900">
                            {comment.author.name}
                          </span>
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md text-xs font-semibold uppercase">
                            {comment.author.role}
                          </span>
                          {comment.author._id === user?.id && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md text-xs font-semibold">You</span>
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
          <div className="pt-4 border-t-2 border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                  Add a Comment
                </label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts, updates, or questions..."
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all resize-none placeholder:text-gray-400 scrollbar-thin"
                  disabled={submitting}
                />
              </div>
              <div className="flex gap-3">
                <motion.button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 font-semibold transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Close
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={submitting || !newComment.trim()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      Posting...
                    </span>
                  ) : (
                    'Post Comment'
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Incidents;
