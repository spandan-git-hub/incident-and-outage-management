import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { containerVariants, itemVariants, hoverLift, scaleVariants } from '../utils/animations';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: '📊',
      title: 'Dashboard',
      description: 'View analytics, insights, and track key metrics in real-time',
      link: '/dashboard',
      bg: 'bg-gray-900',
      hover: 'hover:bg-gray-800'
    },
    {
      icon: '🎫',
      title: 'Incidents',
      description: 'Manage, track, and resolve incidents with your team',
      link: '/incidents',
      bg: 'bg-gray-800',
      hover: 'hover:bg-gray-700'
    }
  ];

  const benefits = [
    { icon: '⚡', title: 'Fast Response', description: 'React to incidents in seconds' },
    { icon: '👥', title: 'Collaborate', description: 'Work together seamlessly' },
    { icon: '📈', title: 'Track Progress', description: 'Monitor resolution in real-time' },
    { icon: '🎯', title: 'Stay Organized', description: 'Keep everything in one place' }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto"
    >
      {/* Hero Section */}
      <motion.div variants={itemVariants} className="text-center mb-16">
        <motion.div
          variants={scaleVariants}
          className="inline-block mb-6"
        >
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            className="text-8xl"
          >
            🎯
          </motion.div>
        </motion.div>

        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Welcome to Incident & Outage Management
        </h1>
        
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
          Manage incidents and outages efficiently with real-time tracking, intelligent automation, and seamless team collaboration
        </p>
        
        {/* Benefits Grid */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -3 }}
              className="card p-4 text-center"
            >
              <div className="text-3xl mb-2">{benefit.icon}</div>
              <div className="font-semibold text-gray-800 text-sm mb-1">{benefit.title}</div>
              <div className="text-xs text-gray-600">{benefit.description}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
      
      {/* Main Content */}
      {isAuthenticated ? (
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              {...hoverLift}
              className={`card-interactive bg-gradient-to-br ${feature.gradient} ${feature.hoverGradient} text-white p-8 relative overflow-hidden group`}
            >
              {/* Background decoration */}
              <div className="absolute -right-8 -top-8 text-9xl opacity-10 group-hover:rotate-12 transition-transform duration-500">
                {feature.icon}
              </div>

              <div className="relative z-10">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  className="text-6xl mb-4"
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-3xl font-bold mb-3">{feature.title}</h3>
                <p className="mb-6 text-white/90 leading-relaxed">{feature.description}</p>
                <Link to={feature.link}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary bg-white text-gray-800 hover:bg-gray-100 shadow-xl flex items-center gap-2"
                  >
                    <span>View {feature.title}</span>
                    <span>→</span>
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          variants={itemVariants}
          className="card p-12 text-center"
        >
          <div className="text-6xl mb-6">🔐</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Get Started Today</h2>
          <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
            Join thousands of teams managing incidents efficiently. Sign in to your account or create a new one to get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary w-48 flex items-center justify-center gap-2"
              >
                <span>🔑</span>
                <span>Login</span>
              </motion.button>
            </Link>
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary w-48 flex items-center justify-center gap-2"
              >
                <span>✨</span>
                <span>Register</span>
              </motion.button>
            </Link>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Home;
