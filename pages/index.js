import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Zap, Code, Image, Globe, FileText, Settings, Calculator, Palette, Database } from 'lucide-react'
import Layout from '../components/layout/Layout'
import { ToolCard, Button } from '../components/ui'

// Tool categories data with more detailed information
const toolCategories = [
  {
    id: 'text',
    name: 'Text Analysis',
    icon: FileText,
    description: 'Comprehensive text processing and analysis tools',
    gradient: 'from-blue-500 to-cyan-500',
    features: [
      'Word & Character Counter',
      'Grammar & Spell Checker', 
      'Paraphrasing Tool',
      'MD5 Hash Generator',
      'Case Converter',
      'Text Reverser',
      'Lorem Ipsum Generator'
    ]
  },
  {
    id: 'image',
    name: 'Image Tools',
    icon: Image,
    description: 'Professional image editing and conversion utilities',
    gradient: 'from-purple-500 to-pink-500',
    features: [
      'Image Compressor',
      'Format Converter (JPG/PNG/WebP)',
      'Image Resizer & Cropper',
      'Favicon Generator',
      'OCR Text Extraction',
      'Background Remover'
    ]
  },
  {
    id: 'seo',
    name: 'SEO & Marketing',
    icon: Globe,
    description: 'Search engine optimization and marketing tools',
    gradient: 'from-green-500 to-emerald-500',
    features: [
      'Keyword Density Checker',
      'SEO Score Analyzer',
      'Backlink Checker',
      'Meta Tags Generator',
      'Sitemap Generator',
      'Robots.txt Generator'
    ]
  },
  {
    id: 'web',
    name: 'Web Development',
    icon: Code,
    description: 'Essential tools for web developers',
    gradient: 'from-orange-500 to-red-500',
    features: [
      'HTML/CSS/JS Minifier',
      'Code Formatter',
      'QR Code Generator',
      'URL Shortener',
      'Base64 Encoder/Decoder',
      'JSON Validator'
    ]
  },
  {
    id: 'domain',
    name: 'Domain & Network',
    icon: Database,
    description: 'Domain analysis and network diagnostic tools',
    gradient: 'from-indigo-500 to-purple-500',
    features: [
      'Domain Age Checker',
      'WHOIS Lookup',
      'DNS Lookup',
      'IP Geolocation',
      'Port Scanner',
      'SSL Certificate Checker'
    ]
  },
  {
    id: 'pdf',
    name: 'PDF & Documents',
    icon: FileText,
    description: 'Document processing and PDF manipulation',
    gradient: 'from-teal-500 to-blue-500',
    features: [
      'PDF Merger & Splitter',
      'PDF Compressor',
      'Word to PDF Converter',
      'PDF to Image',
      'Document Viewer',
      'Text Extractor'
    ]
  },
  {
    id: 'calculators',
    name: 'Calculators',
    icon: Calculator,
    description: 'Mathematical and financial calculators',
    gradient: 'from-yellow-500 to-orange-500',
    features: [
      'Scientific Calculator',
      'Unit Converter',
      'Percentage Calculator',
      'Age Calculator',
      'BMI Calculator',
      'Loan Calculator'
    ]
  },
  {
    id: 'design',
    name: 'Design Tools',
    icon: Palette,
    description: 'Color and design utilities for creatives',
    gradient: 'from-pink-500 to-rose-500',
    features: [
      'Color Palette Generator',
      'Gradient Generator',
      'RGB/HEX Converter',
      'CSS Generator',
      'Font Pairing Tool',
      'Logo Maker'
    ]
  }
]

const stats = [
  { label: 'Total Tools', value: '100+', icon: Settings },
  { label: 'Categories', value: '8', icon: Database },
  { label: 'Users Served', value: '50K+', icon: Globe },
  { label: 'Always Free', value: '100%', icon: Zap }
]

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredCategories, setFilteredCategories] = useState(toolCategories)
  const [favorites, setFavorites] = useState(new Set())

  useEffect(() => {
    if (searchTerm) {
      const filtered = toolCategories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      setFilteredCategories(filtered)
    } else {
      setFilteredCategories(toolCategories)
    }
  }, [searchTerm])

  const toggleFavorite = (categoryId) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(categoryId)) {
      newFavorites.delete(categoryId)
    } else {
      newFavorites.add(categoryId)
    }
    setFavorites(newFavorites)
  }

  const handleCategoryClick = (category) => {
    // Navigate to category page (to be implemented)
    console.log('Navigate to category:', category.id)
  }

  return (
    <Layout showSearch={false}>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-accent-600 to-secondary-600"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
              <span className="bg-gradient-to-r from-primary-600 via-accent-600 to-secondary-600 bg-clip-text text-transparent">
                Onimix Tech
              </span>
              <br />
              <span className="text-4xl md:text-5xl">Toolkit</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-4xl mx-auto">
              The Ultimate Free Tool Collection with <span className="font-semibold text-primary-600 dark:text-primary-400">100+ tools</span> for developers, SEO experts, and students. All tools are free, fast, and work offline when possible.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="px-8 py-4">
                Explore All Tools
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-4">
                View Categories
              </Button>
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto mb-16"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                placeholder="Search tools, categories, or features..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-5 text-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-xl transition-all duration-200"
              />
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
          >
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl mb-3">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Tool Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Category
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Browse our comprehensive collection of tools organized by category. Each category contains multiple specialized tools to help you get the job done.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="tools-grid"
          >
            {filteredCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <ToolCard
                  title={category.name}
                  description={category.description}
                  icon={category.icon}
                  features={category.features}
                  gradient={category.gradient}
                  isFavorite={favorites.has(category.id)}
                  onToggleFavorite={() => toggleFavorite(category.id)}
                  onClick={() => handleCategoryClick(category)}
                />
              </motion.div>
            ))}
          </motion.div>

          {filteredCategories.length === 0 && (
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
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search terms or browse all categories.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Onimix Toolkit?
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Built for professionals, by professionals
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Completely Free',
                description: 'All tools are free to use with no hidden costs, premium features, or subscription requirements',
                icon: '🆓',
                color: 'from-green-500 to-emerald-500'
              },
              {
                title: 'Works Offline',
                description: 'Many tools work without internet connection for enhanced privacy and lightning-fast performance',
                icon: '⚡',
                color: 'from-yellow-500 to-orange-500'
              },
              {
                title: 'No Registration',
                description: 'Start using tools immediately without creating an account or providing personal information',
                icon: '🚀',
                color: 'from-blue-500 to-purple-500'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 * index }}
                className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl`}>
                  {feature.icon}
                </div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}

