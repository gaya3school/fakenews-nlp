import clsx from 'clsx';

function Card({ children, className }) {
  return <div className={clsx('glass-panel rounded-3xl p-6 md:p-7 transition-transform duration-200 hover:-translate-y-1', className)}>{children}</div>;
}

export default Card;
