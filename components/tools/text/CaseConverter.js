import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Download, Trash2, Type, ArrowRight } from 'lucide-react'
import { Card, Button } from '../../ui'
import { convertCase } from '../../../utils/text/textAnalysis'

const CaseConverter = () => {
  const [inputText, setInputText] = useState('')
  const [selectedCase, setSelectedCase] = useState('uppercase')

  const caseTypes = [
    { id: 'uppercase', name: 'UPPERCASE', description: 'Convert all letters to uppercase', example: 'HELLO WORLD' },
    { id: 'lowercase', name: 'lowercase', description: 'Convert all letters to lowercase', example: 'hello world' },
    { id: 'titlecase', name: 'Title Case', description: 'Capitalize the first letter of each word', example: 'Hello World' },
    { id: 'sentencecase', name: 'Sentence case', description: 'Capitalize only the first letter', example: 'Hello world' },
    { id: 'camelcase', name: 'camelCase', description: 'First word lowercase, subsequent words capitalized', example: 'helloWorld' },
    { id: 'pascalcase', name: 'PascalCase', description: 'Capitalize the first letter of each word, no spaces', example: 'HelloWorld' },
    { id: 'snakecase', name: 'snake_case', description: 'Lowercase with underscores between words', example: 'hello_world' },
    { id: 'kebabcase', name: 'kebab-case', description: 'Lowercase with hyphens between words', example: 'hello-world' },
    { id: 'alternatingcase', name: 'aLtErNaTiNg CaSe', description: 'Alternate between lowercase and uppercase', example: 'hElLo WoRlD' },
    { id: 'inversecase', name: 'iNVERSE cASE', description: 'Invert the case of each character', example: 'hELLO wORLD' }
  ]

  const convertedText = inputText ? convertCase(inputText, selectedCase) : ''

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  const handleDownload = (text, filename) => {
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
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
          Case Converter
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Convert text between different case formats including uppercase, lowercase, camelCase, and more.
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
            placeholder="Enter your text here to convert..."
            className="w-full h-32 p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-all duration-200"
          />
        </Card.Content>
      </Card>

      {/* Case Type Selection */}
      <Card>
        <Card.Header>
          <Card.Title>Choose Case Type</Card.Title>
          <Card.Description>
            Select the case format you want to convert your text to
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {caseTypes.map((caseType) => (
              <motion.button
                key={caseType.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCase(caseType.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  selectedCase === caseType.id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {caseType.name}
                  </span>
                  {selectedCase === caseType.id && (
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {caseType.description}
                </p>
                <p className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {caseType.example}
                </p>
              </motion.button>
            ))}
          </div>
        </Card.Content>
      </Card>

      {/* Output Section */}
      {inputText && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Card.Title>Converted Text</Card.Title>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <Type className="w-4 h-4" />
                    <span>{caseTypes.find(c => c.id === selectedCase)?.name}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(convertedText)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(convertedText, `converted-${selectedCase}.txt`)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="relative">
                <textarea
                  value={convertedText}
                  readOnly
                  className="w-full h-32 p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white resize-none focus:outline-none"
                />
                <div className="absolute top-2 right-2">
                  <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-1 rounded-full">
                    {convertedText.length} characters
                  </span>
                </div>
              </div>
            </Card.Content>
          </Card>
        </motion.div>
      )}

      {/* Conversion Preview */}
      {inputText && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <Card.Header>
              <Card.Title>All Case Formats</Card.Title>
              <Card.Description>
                Preview your text in all available case formats
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                {caseTypes.map((caseType) => {
                  const converted = convertCase(inputText, caseType.id)
                  return (
                    <div
                      key={caseType.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-1">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {caseType.name}
                          </span>
                          {selectedCase === caseType.id && (
                            <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-1 rounded-full">
                              Selected
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-900 dark:text-white font-mono truncate">
                          {converted}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(converted)}
                        className="ml-3 flex-shrink-0"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  )
                })}
              </div>
            </Card.Content>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

export default CaseConverter

