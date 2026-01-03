import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function LandingHome() {
  const features = [
    {
      icon: '🎫',
      title: 'Incident Tracking',
      description: 'Create, track, and manage incidents with comprehensive details including severity levels and status workflows',
      color: 'from-purple-600 to-purple-700'
    },
    {
      icon: '👥',
      title: 'Smart Assignment',
      description: 'Manual selection or automated round-robin distribution to balance workload across operators',
      color: 'from-pink-600 to-pink-700'
    },
    {
      icon: '🔄',
      title: 'Status Workflow',
      description: 'Five-stage lifecycle: Open → Acknowledged → In-Progress → Resolved → Closed',
      color: 'from-blue-600 to-blue-700'
    },
    {
      icon: '🔔',
      title: 'Real-Time Notifications',
      description: 'Instant alerts for incident creation, assignments, status updates, and new comments',
      color: 'from-indigo-600 to-indigo-700'
    },
    {
      icon: '💬',
      title: 'Team Collaboration',
      description: 'Comment on incidents with automatic notifications to reporters, operators, and admins',
      color: 'from-purple-600 to-purple-700'
    },
    {
      icon: '📊',
      title: 'Analytics Dashboard',
      description: 'Visual insights with charts tracking trends, severity distribution, and operator performance',
      color: 'from-pink-600 to-pink-700'
    }
  ];

  const stats = [
    { value: '3', label: 'User Roles', icon: '👤' },
    { value: '5', label: 'Status Stages', icon: '🔄' },
    { value: '4', label: 'Severity Levels', icon: '⚠️' },
    { value: '24/7', label: 'Real-Time Updates', icon: '⚡' }
  ];

  const workflows = [
    {
      step: '1',
      title: 'Create',
      icon: '✨',
      description: 'Report incidents with title, description, severity (Low/Medium/High/Critical)',
      color: 'bg-gradient-to-br from-purple-600 to-purple-700'
    },
    {
      step: '2',
      title: 'Assign',
      icon: '🎯',
      description: 'Auto-assign via round-robin or manually select operators from the team list',
      color: 'bg-gradient-to-br from-pink-600 to-pink-700'
    },
    {
      step: '3',
      title: 'Collaborate',
      icon: '💬',
      description: 'Update status, add comments, and coordinate with team members in real-time',
      color: 'bg-gradient-to-br from-blue-600 to-blue-700'
    },
    {
      step: '4',
      title: 'Resolve',
      icon: '✅',
      description: 'Track progress through workflow stages and close incidents with full audit trail',
      color: 'bg-gradient-to-br from-indigo-600 to-indigo-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/8 to-indigo-500/8 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.15, 1, 1.15],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-indigo-500/8 to-slate-500/8 rounded-full blur-3xl"
        />
      </div>

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: 'spring', stiffness: 120 }}
            className="inline-block mb-8"
          >
            <div className="relative">
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 0 0 rgba(59, 130, 246, 0.4)',
                    '0 0 0 15px rgba(59, 130, 246, 0)',
                    '0 0 0 0 rgba(59, 130, 246, 0)'
                  ]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-7xl filter drop-shadow-xl"
              >
                🚨
              </motion.div>
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
          >
            <span className="block">Incident Management</span>
            <span className="block bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500 bg-clip-text text-transparent">
              Made Powerful
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            Streamline incident detection, response, and resolution with intelligent automation,
            real-time collaboration, and comprehensive analytics.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)' }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-xl"
              >
                Sign In
              </motion.button>
            </Link>
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: '0 10px 30px rgba(59, 130, 246, 0.2)' }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="bg-white/10 backdrop-blur-md text-white px-12 py-4 rounded-xl text-lg font-semibold hover:bg-white/20 transition-all shadow-xl border border-white/30"
              >
                Get Started
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mb-24"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-white text-center mb-4"
          >
            Core Features
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="text-gray-400 text-center mb-12 text-lg"
          >
            Comprehensive tools for effective incident management
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + index * 0.05, duration: 0.4 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
                <div className="relative bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 hover:border-white/30 transition-all">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-4xl mb-5 transform group-hover:scale-110 transition-all duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Workflow Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="mb-24"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-white text-center mb-4"
          >
            Workflow Process
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.5 }}
            className="text-gray-400 text-center mb-12 text-lg"
          >
            From detection to resolution in four streamlined steps
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflows.map((workflow, index) => (
              <motion.div
                key={workflow.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.7 + index * 0.1, duration: 0.4 }}
                whileHover={{ y: -8, scale: 1.03 }}
                className="relative"
              >
                {index < workflows.length - 1 && (
                  <div className="hidden lg:block absolute top-1/4 -right-3 w-6 h-6 z-10">
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="text-2xl text-gray-400"
                    >
                      →
                    </motion.div>
                  </div>
                )}
                <div className={`${workflow.color} rounded-3xl p-8 text-white shadow-2xl h-full relative overflow-hidden`}>
                  <motion.div
                    className="absolute -top-10 -right-10 text-9xl opacity-10 font-black"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  >
                    {workflow.step}
                  </motion.div>
                  <div className="relative z-10">
                    <div className="text-5xl mb-4">{workflow.icon}</div>
                    <div className="text-sm font-bold opacity-80 mb-2">STEP {workflow.step}</div>
                    <h3 className="text-2xl font-bold mb-3">{workflow.title}</h3>
                    <p className="text-white/90 leading-relaxed">{workflow.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.6 }}
          className="relative overflow-hidden max-w-3xl mx-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-blue-700/20 rounded-2xl blur-xl" />
          <div className="relative bg-slate-800/40 backdrop-blur-md rounded-2xl p-8 md:p-10 text-center shadow-lg border border-white/10">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
              Start Managing Incidents More Effectively
            </h2>
            <p className="text-base text-gray-300 mb-6 max-w-xl mx-auto">
              Get started with our comprehensive incident management platform at no cost.
            </p>
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 8px 20px rgba(59, 130, 246, 0.25)' }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-base font-medium hover:bg-blue-700 transition-all shadow-md"
              >
                Create Account
              </motion.button>
            </Link>
            <p className="text-gray-400 mt-4 text-xs">
              Free to use • No credit card required
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default LandingHome;
