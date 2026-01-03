import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: '🚨',
      title: 'Real-Time Monitoring',
      description: 'Track incidents as they happen with live updates and instant notifications',
      color: 'from-red-500 to-rose-600'
    },
    {
      icon: '⚡',
      title: 'Lightning Fast Response',
      description: 'Reduce MTTR with automated workflows and intelligent incident routing',
      color: 'from-amber-500 to-orange-600'
    },
    {
      icon: '🎯',
      title: 'Smart Prioritization',
      description: 'AI-powered severity detection ensures critical issues get immediate attention',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      icon: '📊',
      title: 'Analytics & Insights',
      description: 'Powerful dashboards reveal patterns and help prevent future incidents',
      color: 'from-violet-500 to-purple-600'
    },
    {
      icon: '🤝',
      title: 'Team Collaboration',
      description: 'Seamless communication with comments, mentions, and status updates',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      icon: '🔔',
      title: 'Multi-Channel Alerts',
      description: 'Get notified instantly via email, SMS, Slack, or custom webhooks',
      color: 'from-fuchsia-500 to-pink-600'
    }
  ];

  const stats = [
    { value: '99.9%', label: 'Uptime Guaranteed', icon: '✨' },
    { value: '<5min', label: 'Avg Response Time', icon: '⏱️' },
    { value: '10K+', label: 'Incidents Resolved', icon: '🎉' },
    { value: '24/7', label: 'Support Available', icon: '💪' }
  ];

  const workflows = [
    {
      step: '1',
      title: 'Detect',
      icon: '🔍',
      description: 'System automatically detects anomalies and creates incidents',
      color: 'bg-gradient-to-br from-red-500 to-orange-500'
    },
    {
      step: '2',
      title: 'Assign',
      icon: '👥',
      description: 'Incidents are routed to the right team based on severity and type',
      color: 'bg-gradient-to-br from-blue-500 to-cyan-500'
    },
    {
      step: '3',
      title: 'Resolve',
      icon: '🛠️',
      description: 'Teams collaborate in real-time to fix issues quickly',
      color: 'bg-gradient-to-br from-purple-500 to-pink-500'
    },
    {
      step: '4',
      title: 'Analyze',
      icon: '📈',
      description: 'Learn from every incident with detailed post-mortem analytics',
      color: 'bg-gradient-to-br from-green-500 to-emerald-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
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
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
            className="inline-block mb-8"
          >
            <div className="relative">
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 0 0 rgba(239, 68, 68, 0.7)',
                    '0 0 0 20px rgba(239, 68, 68, 0)',
                    '0 0 0 0 rgba(239, 68, 68, 0)'
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-8xl filter drop-shadow-2xl"
              >
                🚨
              </motion.div>
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-6xl md:text-7xl font-black text-white mb-6 leading-tight"
          >
            <span className="block">Incident Management</span>
            <span className="block bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">
              Made Powerful
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            Detect, respond, and resolve incidents faster than ever with intelligent automation,
            real-time collaboration, and actionable insights 🚀
          </motion.p>
          
          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20"
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            {isAuthenticated ? (
              <Link to="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(239, 68, 68, 0.3)' }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-12 py-5 rounded-2xl text-xl font-bold hover:from-red-600 hover:to-orange-600 transition-all shadow-2xl relative overflow-hidden group"
                >
                  <span className="relative z-10">Launch Dashboard 🎯</span>
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.5 }}
                  />
                </motion.button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(239, 68, 68, 0.3)' }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-12 py-5 rounded-2xl text-xl font-bold hover:from-red-600 hover:to-orange-600 transition-all shadow-2xl"
                  >
                    Sign In Now →
                  </motion.button>
                </Link>
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)' }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white/10 backdrop-blur-md text-white px-12 py-5 rounded-2xl text-xl font-bold hover:bg-white/20 transition-all shadow-2xl border-2 border-white/30"
                  >
                    Start Free Trial ✨
                  </motion.button>
                </Link>
              </>
            )}
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mb-24"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="text-4xl md:text-5xl font-black text-white text-center mb-4"
          >
            Why Teams Love Us 💖
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-gray-400 text-center mb-12 text-lg"
          >
            Everything you need to manage incidents like a pro
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 + index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
                <div className="relative bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 hover:border-white/30 transition-all">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-4xl mb-5 transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-300`}>
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
          transition={{ delay: 1.8 }}
          className="mb-24"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.9 }}
            className="text-4xl md:text-5xl font-black text-white text-center mb-4"
          >
            How It Works ⚙️
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="text-gray-400 text-center mb-12 text-lg"
          >
            From detection to resolution in four simple steps
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflows.map((workflow, index) => (
              <motion.div
                key={workflow.step}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.1 + index * 0.15 }}
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                {index < workflows.length - 1 && (
                  <div className="hidden lg:block absolute top-1/4 -right-3 w-6 h-6 z-10">
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-2xl"
                    >
                      →
                    </motion.div>
                  </div>
                )}
                <div className={`${workflow.color} rounded-3xl p-8 text-white shadow-2xl h-full relative overflow-hidden`}>
                  <motion.div
                    className="absolute -top-10 -right-10 text-9xl opacity-10 font-black"
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                  >
                    {workflow.step}
                  </motion.div>
                  <div className="relative z-10">
                    <div className="text-5xl mb-4">{workflow.icon}</div>
                    <div className="text-sm font-bold opacity-80 mb-2">STEP {workflow.step}</div>
                    <h3 className="text-2xl font-black mb-3">{workflow.title}</h3>
                    <p className="text-white/90 leading-relaxed">{workflow.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.5 }}
            className="relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 rounded-[3rem] blur-2xl opacity-50" />
            <div className="relative bg-gradient-to-r from-red-600 to-orange-600 rounded-[3rem] p-12 md:p-16 text-center shadow-2xl border border-white/20">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl mb-6"
              >
                🎉
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                Ready to Transform Your Incident Response?
              </h2>
              <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto">
                Join hundreds of teams managing incidents faster, smarter, and better
              </p>
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.08, boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)' }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-red-600 px-14 py-6 rounded-2xl text-2xl font-black hover:bg-gray-100 transition-all shadow-2xl relative overflow-hidden group"
                >
                  <span className="relative z-10">Get Started Free 🚀</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                </motion.button>
              </Link>
              <p className="text-white/80 mt-6 text-sm">
                No credit card required • Setup in 5 minutes • Cancel anytime
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Home;
