import { Link } from 'react-router-dom';

function LandingHome() {
  const features = [
    {
      icon: '⚡',
      title: 'Real-Time Tracking',
      description: 'Monitor incidents as they happen with live updates'
    },
    {
      icon: '👥',
      title: 'Team Collaboration',
      description: 'Work together seamlessly to resolve issues'
    },
    {
      icon: '📊',
      title: 'Analytics',
      description: 'Gain insights with comprehensive dashboards'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="text-6xl mb-6">🎯</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Incident & Outage Management
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Streamline incident tracking and resolve issues faster
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard" className="btn-primary">
              Go to Dashboard
            </Link>
            <Link to="/login" className="btn-secondary">
              Login
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {features.map((feature, index) => (
            <div key={index} className="card text-center">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LandingHome;
