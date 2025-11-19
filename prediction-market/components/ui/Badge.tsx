import { cn } from '@/utils/cn';
import { HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'info';
}

export default function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-800 border-gray-200',
    success: 'bg-success-100 text-success-800 border-success-200',
    danger: 'bg-danger-100 text-danger-800 border-danger-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    info: 'bg-primary-100 text-primary-800 border-primary-200',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
