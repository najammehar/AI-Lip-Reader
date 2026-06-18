/* eslint-disable-next-line no-unused-vars */
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = true,
  glow = false,
  ...props 
}) => {
  const baseStyles = 'bg-[#111111] border border-[#1f1f1f] backdrop-blur-xl rounded p-6';
  const hoverStyles = hover ? 'hover:border-indigo-500/50 transition-all duration-300' : '';
  const glowStyles = glow ? 'shadow-lg shadow-indigo-500/10' : '';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : {}}
      className={`${baseStyles} ${hoverStyles} ${glowStyles} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
