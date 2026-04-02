import { motion } from 'framer-motion';

function ProgressBar({ label, value, color = 'from-accent-500 to-teal-500' }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-600 dark:text-slate-300">{label}</span>
        <span className="font-semibold">{value}%</span>
      </div>
      <div className="h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
