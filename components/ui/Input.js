import { forwardRef } from 'react'
import { clsx } from 'clsx'

const Input = forwardRef(({ 
  label,
  error,
  helperText,
  className = '',
  type = 'text',
  size = 'md',
  variant = 'default',
  leftIcon,
  rightIcon,
  ...props 
}, ref) => {
  const baseClasses = 'w-full rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    default: 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary-500 focus:ring-primary-500',
    error: 'bg-white dark:bg-gray-800 border-red-300 dark:border-red-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-red-500 focus:ring-red-500'
  }
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-4 py-3 text-base'
  }

  const inputVariant = error ? 'error' : variant

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-gray-400 w-5 h-5">
              {leftIcon}
            </div>
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          className={clsx(
            baseClasses,
            variants[inputVariant],
            sizes[size],
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            className
          )}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <div className="text-gray-400 w-5 h-5">
              {rightIcon}
            </div>
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <p className={clsx(
          'mt-2 text-sm',
          error ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input

