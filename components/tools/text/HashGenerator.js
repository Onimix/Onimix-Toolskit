import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Copy, Download, Trash2, Hash, Shield, Key } from 'lucide-react'
import { Card, Button } from '../../ui'
import { generateHash } from '../../../utils/text/textAnalysis'

const HashGenerator = () => {
  const [inputText, setInputText] = useState('')
  const [hashes, setHashes] = useState({})

  const hashTypes = [
    { id: 'md5', name: 'MD5', description: '128-bit hash function', icon: Hash, color: 'from-blue-500 to-cyan-500' },
    { id: 'sha1', name: 'SHA-1', description: '160-bit hash function', icon: Shield, color: 'from-green-500 to-emerald-500' },
    { id: 'sha256', name: 'SHA-256', description: '256-bit hash function', icon: Key, color: 'from-purple-500 to-pink-500' },
    { id: 'sha512', name: 'SHA-512', description: '512-bit hash function', icon: Shield, color: 'from-orange-500 to-red-500' }
  ]

  useEffect(() => {
    if (inputText) {
      const newHashes = {}
      hashTypes.forEach(type => {
        newHashes[type.id] = generateHash(inputText, type.id)
      })
      setHashes(newHashes)
    } else {
      setHashes({})
    }
  }, [inputText])

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  const handleDownload = (hash, algorithm) => {
    const content = `Original Text: ${inputText}\nAlgorithm: ${algorithm.toUpperCase()}\nHash: ${hash}\nGenerated: ${new Date().toISOString()}`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${algorithm}-hash.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDownloadAll = () => {
    let content = `Original Text: ${inputText}\nGenerated: ${new Date().toISOString()}\n\n`
    hashTypes.forEach(type => {
      if (hashes[type.id]) {
        content += `${type.name}: ${hashes[type.id]}\n`
      }
    })
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'all-hashes.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleClear = () => {
    setInputText('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Hash Generator
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Generate MD5, SHA-1, SHA-256, and SHA-512 hashes for any text input. Perfect for data integrity verification.
        </p>
      </div>

      {/* Input Section */}
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <Card.Title>Input Text</Card.Title>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(inputText)}
                disabled={!inputText}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                disabled={!inputText}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </Card.Header>
        <Card.Content>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter your text here to generate hashes..."
            className="w-full h-32 p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-all duration-200"
          />
          {inputText && (
            <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              Input length: {inputText.length} characters
            </div>
          )}
        </Card.Content>
      </Card>

      {/* Hash Results */}
      {inputText && Object.keys(hashes).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <Card.Title>Generated Hashes</Card.Title>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadAll}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download All
                </Button>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                {hashTypes.map((type, index) => {
                  const hash = hashes[type.id]
                  const IconComponent = type.icon
                  
                  if (!hash) return null

                  return (
                    <motion.div
                      key={type.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 bg-gradient-to-r ${type.color} rounded-lg flex items-center justify-center`}>
                            <IconComponent className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {type.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {type.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopy(hash)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownload(hash, type.id)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border">
                        <code className="text-sm font-mono text-gray-900 dark:text-white break-all">
                          {hash}
                        </code>
                      </div>
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Length: {hash.length} characters
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </Card.Content>
          </Card>
        </motion.div>
      )}

      {/* Information Section */}
      <Card>
        <Card.Header>
          <Card.Title>About Hash Functions</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">What are Hash Functions?</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Hash functions are mathematical algorithms that convert input data of any size into a fixed-size string of characters. 
                They are commonly used for data integrity verification, password storage, and digital signatures.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Security Considerations</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-400">MD5: Not cryptographically secure</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-400">SHA-1: Deprecated for security</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-400">SHA-256: Secure and recommended</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-400">SHA-512: Most secure option</span>
                </div>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  )
}

export default HashGenerator

