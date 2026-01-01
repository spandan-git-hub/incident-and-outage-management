import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const Test = () => {
  const [backendStatus, setBackendStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testBackend = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/test');
        setBackendStatus(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    testBackend();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl mx-auto"
    >
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        Backend Connection Test
      </h1>

      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="bg-white rounded-lg shadow-lg p-8"
      >
        {loading && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"
          />
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
          >
            <p className="font-bold">Error:</p>
            <p>{error}</p>
            <p className="text-sm mt-2">Make sure the backend server is running on http://localhost:5000</p>
          </motion.div>
        )}

        {backendStatus && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-center space-x-3 mb-6">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-4 h-4 bg-green-500 rounded-full"
              />
              <span className="text-2xl font-bold text-green-600">Connected!</span>
            </div>
            
            <div className="bg-gray-50 rounded p-4">
              <p className="text-sm text-gray-600 mb-2">Response from backend:</p>
              <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
                {JSON.stringify(backendStatus, null, 2)}
              </pre>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-blue-50 p-4 rounded">
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-xl font-bold text-blue-600">{backendStatus.status}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded">
                <p className="text-sm text-gray-600">Message</p>
                <p className="text-xl font-bold text-purple-600">{backendStatus.message}</p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Test;
