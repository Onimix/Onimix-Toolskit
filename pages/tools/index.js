import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, FileText, Hash, Type, RotateCcw, Shuffle, BookOpen, Compress, RefreshCw, Crop } from 'lucide-react'
import Layout from '../../components/layout/Layout'
import { ToolCard, Input } from '../../components/ui'

const toolsData = [
  {
    id: 'word-counter',
    name: 'Word Counter',
    description: 'Count words, characters, sentences, and analyze text statistics with detailed metrics.',
    category: 'Text Analysis',
    icon: FileText,
    gradient: 'from-blue-500 to-cyan-500',
    features: ['Word count', 'Character count', 'Reading time', 'Text statistics'],
    href: '/tools/text/word-counter'
  },
  {
    id: 'case-converter',
    name: 'Case Converter',
    description: 'Convert text between different case formats including uppercase, lowercase, camelCase, and more.',
    category: 'Text Analysis',
    icon: Type,
    gradient: 'from-purple-500 to-pink-500',
    features: ['Multiple case types', 'Instant conversion', 'Batch preview', 'Copy all formats'],
    href: '/tools/text/case-converter'
  },
  {
    id: 'hash-generator',
    name: 'Hash Generator',
    description: 'Generate MD5, SHA-1, SHA-256, and SHA-512 hashes for data integrity verification.',
    category: 'Text Analysis',
    icon: Hash,
    gradient: 'from-green-500 to-emerald-500',
    features: ['Multiple algorithms', 'Secure hashing', 'Instant generation', 'Download results'],
    href: '/tools/text/hash-generator'
  },
  {
    id: 'text-reverser',
    name: 'Text Reverser',
    description: 'Reverse text by characters, words, or lines with multiple reversal options.',
    category: 'Text Analysis',
    icon: RotateCcw,
    gradient: 'from-orange-500 to-red-500',
    features: ['Character reversal', 'Word reversal', 'Line reversal', 'Custom options'],
    href: '/tools/text/text-reverser'
  },
  {
    id: 'lorem-generator',
    name: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text for design and development projects.',
    category: 'Text Analysis',
    icon: BookOpen,
    gradient: 'from-indigo-500 to-purple-500',
    features: ['Custom length', 'Words/sentences/paragraphs', 'Classic Lorem Ipsum', 'Copy & download'],
    href: '/tools/text/lorem-generator'
  },
  {
    id: 'text-cleaner',
    name: 'Text Cleaner',
    description: 'Clean and format text by removing extra spaces, line breaks, and unwanted characters.',
    category: 'Text Analysis',
    icon: Shuffle,
    gradient: 'from-teal-500 to-blue-500',
    features: ['Remove extra spaces', 'Clean formatting', 'Custom options', 'Batch processing'],
    href: '/tools/text/text-cleaner'
  },
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    description: 'Compress images to reduce file size while maintaining quality. Perfect for web optimization.',
    category: 'Image Tools',
    icon: Compress,
    gradient: 'from-red-500 to-pink-500',
    features: ['Custom target size', 'Quality control', 'Batch compression', 'Multiple formats'],
    href: '/tools/image/compressor'
  },
  {
    id: 'image-converter',
    name: 'Format Converter',
    description: 'Convert images between different formats including PNG, JPEG, WebP, and more.',
    category: 'Image Tools',
    icon: RefreshCw,
    gradient: 'from-yellow-500 to-orange-500',
    features: ['Multiple formats', 'Batch conversion', 'Format comparison', 'Quality preservation'],
    href: '/tools/image/converter'
  },
  {
    id: 'image-resizer',
    name: 'Image Resizer',
    description: 'Resize images to specific dimensions while maintaining aspect ratio or custom sizing.',
    category: 'Image Tools',
    icon: Crop,
    gradient: 'from-emerald-500 to-teal-500',
    features: ['Custom dimensions', 'Aspect ratio lock', 'Batch resizing', 'Preview mode'],
    href: '/tools/image/resizer'
  }
]

const categories = ['All', 'Text Analysis', 'Image Tools', 'SEO Tools', 'Web Development', 'PDF Tools', 'Calculators', 'Design Tools']

export default function ToolsIndex() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [favorites, setFavorites] = useState(new Set())

  const filteredTools = toolsData.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const toggleFavorite = (toolId) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(toolId)) {
      newFavorites.delete(toolId)
    } else {
      newFavorites.add(toolId)
    }
    setFavorites(newFavorites)
  }

  const handleToolClick = (tool) => {
    // For now, we'll just log the tool click
    // In a real app, you'd navigate to the tool page
    console.log('Navigate to tool:', tool.href)
    window.location.href = tool.href
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            All Tools
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Discover our comprehensive collection of free tools designed to boost your productivity and streamline your workflow.
          </motion.p>
        </div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 space-y-4"
        >
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <Input
              placeholder="Search tools by name, description, or features..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-5 h-5" />}
              size="lg"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tools Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="tools-grid"
        >
          {filteredTools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <ToolCard
                title={tool.name}
                description={tool.description}
                icon={tool.icon}
                category={tool.category}
                features={tool.features}
                gradient={tool.gradient}
                isFavorite={favorites.has(tool.id)}
                onToggleFavorite={() => toggleFavorite(tool.id)}
                onClick={() => handleToolClick(tool)}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredTools.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No tools found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your search terms or browse different categories.
            </p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('All')
              }}
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              Clear filters
            </button>
          </motion.div>
        )}

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
            <span>{filteredTools.length} tools found</span>
            <span>•</span>
            <span>{favorites.size} favorites</span>
            <span>•</span>
            <span>All tools free</span>
          </div>
        </motion.div>
      </div>
    </Layout>
  )
}

