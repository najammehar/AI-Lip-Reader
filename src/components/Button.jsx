import { motion } from 'framer-motion';
import { forwardRef } from 'react';

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '',
  icon: Icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  ...props 
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-indigo-500 hover:bg-indigo-600 text-white',
    secondary: 'bg-[#111111] hover:bg-[#181818] text-white border border-[#1f1f1f]',
    outline: 'bg-transparent hover:bg-[#181818] text-indigo-500 border border-indigo-500',
    ghost: 'bg-transparent hover:bg-[#181818] text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {!loading && Icon && iconPosition === 'left' && <Icon size={18} />}
      {children}
      {!loading && Icon && iconPosition === 'right' && <Icon size={18} />}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;
