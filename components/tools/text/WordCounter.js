import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Copy, Download, Trash2, FileText, Clock, Hash } from 'lucide-react'
import { Card, Button, Input } from '../../ui'
import { analyzeText, getTextStatistics } from '../../../utils/text/textAnalysis'

const WordCounter = () => {
  const [text, setText] = useState('')
  const [stats, setStats] = useState({})

  useEffect(() => {
    const textStats = getTextStatistics(text)
    setStats(textStats)
  }, [text])

  const handleClear = () => {
    setText('')
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'text-analysis.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const statCards = [
    { label: 'Characters', value: stats.characters, icon: Hash, color: 'from-blue-500 to-cyan-500' },
    { label: 'Characters (no spaces)', value: stats.charactersNoSpaces, icon: Hash, color: 'from-purple-500 to-pink-500' },
    { label: 'Words', value: stats.words, icon: FileText, color: 'from-green-500 to-emerald-500' },
    { label: 'Sentences', value: stats.sentences, icon: FileText, color: 'from-orange-500 to-red-500' },
    { label: 'Paragraphs', value: stats.paragraphs, icon: FileText, color: 'from-indigo-500 to-purple-500' },
    { label: 'Lines', value: stats.lines, icon: FileText, color: 'from-teal-500 to-blue-500' },
    { label: 'Reading Time', value: `${stats.readingTime || 0} min`, icon: Clock, color: 'from-yellow-500 to-orange-500' },
    { label: 'Avg. Words/Sentence', value: stats.averageWordsPerSentence || 0, icon: Hash, color: 'from-pink-500 to-rose-500' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Word Counter & Text Analyzer
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Analyze your text with detailed statistics including word count, character count, reading time, and more.
        </p>
      </div>

      {/* Text Input Area */}
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <Card.Title>Enter Your Text</Card.Title>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                disabled={!text}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                disabled={!text}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                disabled={!text}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </Card.Header>
        <Card.Content>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here to analyze..."
            className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-all duration-200"
          />
        </Card.Content>
      </Card>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="text-center">
                <Card.Content className="p-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </Card.Content>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Additional Statistics */}
      {text && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card>
            <Card.Header>
              <Card.Title>Detailed Analysis</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Text Composition</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Average characters per word:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{stats.averageCharsPerWord}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Average words per sentence:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{stats.averageWordsPerSentence}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Text density:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {stats.characters > 0 ? Math.round((stats.charactersNoSpaces / stats.characters) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Reading Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Estimated reading time:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{stats.readingTime} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Speaking time (slow):</span>
                      <span className="font-medium text-gray-900 dark:text-white">{Math.ceil((stats.words || 0) / 130)} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Speaking time (fast):</span>
                      <span className="font-medium text-gray-900 dark:text-white">{Math.ceil((stats.words || 0) / 180)} minutes</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

export default WordCounter

