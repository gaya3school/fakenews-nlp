import clsx from 'clsx';

function Button({ children, variant = 'primary', className, ...props }) {
  const base = 'ripple inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 disabled:opacity-60 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-gradient-to-r from-accent-500 to-teal-500 text-white shadow-glow hover:scale-[1.02]',
    secondary: 'bg-white/80 text-slate-700 border border-slate-200 hover:bg-white dark:bg-slate-800/70 dark:text-slate-200 dark:border-slate-600',
    ghost: 'text-accent-600 hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-slate-800',
  };

  return (
    <button className={clsx(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}

export default Button;
