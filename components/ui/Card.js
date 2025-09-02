import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  className = '', 
  hover = true,
  padding = 'md',
  variant = 'default',
  onClick,
  ...props 
}) => {
  const baseClasses = 'rounded-2xl transition-all duration-300'
  
  const variants = {
    default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg',
    glass: 'bg-white/10 dark:bg-black/20 backdrop-blur-lg border border-white/20 dark:border-white/10',
    gradient: 'bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 border border-primary-200 dark:border-primary-700'
  }
  
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }
  
  const hoverClasses = hover ? 'hover:shadow-2xl hover:-translate-y-1 cursor-pointer' : ''

  const combinedClassName = [
    baseClasses,
    variants[variant],
    paddings[padding],
    hoverClasses,
    className
  ].filter(Boolean).join(' ')

  const cardContent = (
    <div
      className={combinedClassName}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )

  if (hover && onClick) {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        {cardContent}
      </motion.div>
    )
  }

  return cardContent
}

const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
)

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-xl font-semibold text-gray-900 dark:text-white ${className}`}>
    {children}
  </h3>
)

const CardDescription = ({ children, className = '' }) => (
  <p className={`text-gray-600 dark:text-gray-400 mt-1 ${className}`}>
    {children}
  </p>
)

const CardContent = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
)

const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 ${className}`}>
    {children}
  </div>
)

Card.Header = CardHeader
Card.Title = CardTitle
Card.Description = CardDescription
Card.Content = CardContent
Card.Footer = CardFooter

export default Card

