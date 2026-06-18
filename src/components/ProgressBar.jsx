/* eslint-disable-next-line no-unused-vars */
import { motion } from 'framer-motion';

const ProgressBar = ({ progress, className = '' }) => {
  return (
    <div className={`w-full bg-[#1f1f1f] rounded overflow-hidden h-2 ${className}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="h-full bg-linear-to-r from-indigo-500 to-purple-500"
      />
    </div>
  );
};

export default ProgressBar;
