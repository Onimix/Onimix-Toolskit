import { motion } from 'framer-motion'
import { ArrowRight, Star } from 'lucide-react'
import Card from './Card'

const ToolCard = ({ 
  title, 
  description, 
  icon: IconComponent, 
  category, 
  features = [], 
  onClick,
  isFavorite = false,
  onToggleFavorite,
  gradient = 'from-blue-500 to-cyan-500'
}) => {
  return (
    <Card 
      hover={true}
      onClick={onClick}
      className="group cursor-pointer relative overflow-hidden"
    >
      {/* Favorite Button */}
      {onToggleFavorite && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite()
          }}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-colors duration-200"
        >
          <Star 
            className={`w-4 h-4 ${isFavorite ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} 
          />
        </button>
      )}

      {/* Header */}
      <Card.Header>
        <div className="flex items-center mb-4">
          <div className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200 shadow-lg`}>
            <IconComponent className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <Card.Title className="group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                {title}
              </Card.Title>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all duration-200" />
            </div>
            {category && (
              <span className="inline-block px-2 py-1 text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full mt-1">
                {category}
              </span>
            )}
          </div>
        </div>
      </Card.Header>

      {/* Content */}
      <Card.Content>
        <Card.Description className="mb-4 line-clamp-2">
          {description}
        </Card.Description>

        {/* Features */}
        {features.length > 0 && (
          <div className="space-y-2">
            {features.slice(0, 3).map((feature, index) => (
              <div
                key={index}
                className="flex items-center text-sm text-gray-600 dark:text-gray-400"
              >
                <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2 flex-shrink-0"></div>
                <span className="truncate">{feature}</span>
              </div>
            ))}
            {features.length > 3 && (
              <div className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                +{features.length - 3} more features
              </div>
            )}
          </div>
        )}
      </Card.Content>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </Card>
  )
}

export default ToolCard

