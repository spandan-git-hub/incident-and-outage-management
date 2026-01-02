import { motion } from 'framer-motion';

export const Skeleton = ({ className = '', width = 'w-full', height = 'h-4' }) => {
  return (
    <motion.div
      initial={{ opacity: 0.6 }}
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      className={`skeleton ${width} ${height} ${className}`}
    />
  );
};

export const SkeletonCard = () => {
  return (
    <div className="card space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          <Skeleton width="w-3/4" height="h-6" />
          <Skeleton width="w-full" height="h-4" />
          <Skeleton width="w-5/6" height="h-4" />
        </div>
        <Skeleton width="w-16" height="h-8" className="rounded-full" />
      </div>
      <div className="flex gap-2 pt-2">
        <Skeleton width="w-20" height="h-8" className="rounded-lg" />
        <Skeleton width="w-20" height="h-8" className="rounded-lg" />
        <Skeleton width="w-20" height="h-8" className="rounded-lg" />
      </div>
    </div>
  );
};

export const SkeletonTable = ({ rows = 5 }) => {
  return (
    <div className="card space-y-4">
      <Skeleton width="w-1/4" height="h-6" />
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton width="w-1/4" height="h-10" />
            <Skeleton width="w-1/4" height="h-10" />
            <Skeleton width="w-1/4" height="h-10" />
            <Skeleton width="w-1/4" height="h-10" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const SkeletonChart = () => {
  return (
    <div className="card">
      <Skeleton width="w-1/3" height="h-6" className="mb-4" />
      <Skeleton width="w-full" height="h-64" className="rounded-lg" />
    </div>
  );
};

export const SkeletonDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton width="w-64" height="h-8" />
          <Skeleton width="w-48" height="h-4" />
        </div>
        <Skeleton width="w-32" height="h-12" className="rounded-xl" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card">
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <Skeleton width="w-20" height="h-4" />
                <Skeleton width="w-16" height="h-8" />
              </div>
              <Skeleton width="w-12" height="h-12" className="rounded-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonChart />
        <SkeletonChart />
      </div>
    </div>
  );
};

export default Skeleton;
