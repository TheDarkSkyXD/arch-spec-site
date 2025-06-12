import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

type CardProps = HTMLAttributes<HTMLDivElement>;

const Card = forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border border-gray-200 bg-white p-6 shadow-sm',
        'dark:border-gray-700 dark:bg-gray-800',
        className
      )}
      {...props}
    />
  );
});

Card.displayName = 'Card';

export default Card;
