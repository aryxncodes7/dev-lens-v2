import { motion } from "motion/react";

export function SkeletonLoader({ id }: { id?: string }) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col border-l-2 md:border-l-4 border-zinc-800 pl-6 md:pl-10 py-4 h-full space-y-8 animate-pulse"
    >
      {/* Identity Block */}
      <div>
        <div className="h-3 w-28 bg-zinc-805 bg-blue-600/20 rounded uppercase mb-4" />
        <div className="flex flex-col lg:flex-row items-start gap-5">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-zinc-850 shrink-0" />
          <div className="flex-1 space-y-3 w-full">
            <div className="h-10 w-3/4 bg-zinc-850 rounded" />
            <div className="h-4 w-1/4 bg-blue-600/10 rounded" />
            <div className="h-3 w-5/6 bg-zinc-850 rounded" />
          </div>
        </div>
      </div>

      {/* Developer Rating Block */}
      <div>
        <div className="h-3 w-32 bg-zinc-850 rounded mb-3" />
        <div className="h-8 w-2/3 bg-zinc-850 rounded" />
        <div className="h-3 w-1/2 bg-zinc-850 rounded mt-2" />
      </div>

      {/* Stats Block */}
      <div>
        <div className="h-3 w-36 bg-zinc-850 rounded mb-4" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-10 w-16 bg-zinc-850 rounded" />
              <div className="h-2.5 w-12 bg-zinc-850 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Repos Block */}
      <div className="flex-grow">
        <div className="h-3 w-28 bg-zinc-850 rounded mb-4" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-zinc-900">
              <div className="h-4 w-1/2 bg-zinc-850 rounded" />
              <div className="h-3 w-10 bg-zinc-850 rounded" />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
