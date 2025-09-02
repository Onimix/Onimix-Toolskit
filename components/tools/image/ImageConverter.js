import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Upload, Download, Trash2, Image as ImageIcon, RefreshCw, FileImage } from 'lucide-react'
import { Card, Button } from '../../ui'
import { convertImageFormat, getImageInfo, downloadFile, createImageZip } from '../../../utils/image/imageProcessing'

const ImageConverter = () => {
  const [files, setFiles] = useState([])
  const [converting, setConverting] = useState(false)
  const [targetFormat, setTargetFormat] = useState('png')

  const supportedFormats = [
    { value: 'png', label: 'PNG', description: 'Lossless compression, supports transparency' },
    { value: 'jpeg', label: 'JPEG', description: 'Lossy compression, smaller file sizes' },
    { value: 'webp', label: 'WebP', description: 'Modern format, excellent compression' }
  ]

  const handleFileUpload = useCallback((event) => {
    const uploadedFiles = Array.from(event.target.files)
    const imageFiles = uploadedFiles.filter(file => file.type.startsWith('image/'))
    
    Promise.all(imageFiles.map(async (file) => {
      const info = await getImageInfo(file)
      return {
        id: Date.now() + Math.random(),
        original: file,
        info,
        converted: null,
        conversionResult: null,
        status: 'ready'
      }
    })).then(newFiles => {
      setFiles(prev => [...prev, ...newFiles])
    })
  }, [])

  const handleDrop = useCallback((event) => {
    event.preventDefault()
    const droppedFiles = Array.from(event.dataTransfer.files)
    const imageFiles = droppedFiles.filter(file => file.type.startsWith('image/'))
    
    Promise.all(imageFiles.map(async (file) => {
      const info = await getImageInfo(file)
      return {
        id: Date.now() + Math.random(),
        original: file,
        info,
        converted: null,
        conversionResult: null,
        status: 'ready'
      }
    })).then(newFiles => {
      setFiles(prev => [...prev, ...newFiles])
    })
  }, [])

  const handleDragOver = useCallback((event) => {
    event.preventDefault()
  }, [])

  const convertFile = async (fileData) => {
    setFiles(prev => prev.map(f => 
      f.id === fileData.id ? { ...f, status: 'converting' } : f
    ))

    try {
      const result = await convertImageFormat(fileData.original, targetFormat)
      setFiles(prev => prev.map(f => 
        f.id === fileData.id ? { 
          ...f, 
          converted: result.file,
          conversionResult: result,
          status: 'completed'
        } : f
      ))
    } catch (error) {
      console.error('Conversion failed:', error)
      setFiles(prev => prev.map(f => 
        f.id === fileData.id ? { ...f, status: 'error' } : f
      ))
    }
  }

  const convertAll = async () => {
    setConverting(true)
    const readyFiles = files.filter(f => f.status === 'ready')
    
    for (const file of readyFiles) {
      await convertFile(file)
    }
    
    setConverting(false)
  }

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  const downloadConverted = (fileData) => {
    if (fileData.converted) {
      downloadFile(fileData.converted)
    }
  }

  const downloadAllConverted = async () => {
    const convertedFiles = files.filter(f => f.converted).map(f => f.converted)
    if (convertedFiles.length > 1) {
      const zipFile = await createImageZip(convertedFiles, `converted-images.zip`)
      downloadFile(zipFile)
    } else if (convertedFiles.length === 1) {
      downloadFile(convertedFiles[0])
    }
  }

  const clearAll = () => {
    setFiles([])
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFormatIcon = (format) => {
    const icons = {
      'image/png': '🖼️',
      'image/jpeg': '📷',
      'image/webp': '🌐',
      'image/gif': '🎞️'
    }
    return icons[format] || '📄'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Image Format Converter
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Convert images between different formats including PNG, JPEG, and WebP. Batch conversion supported.
        </p>
      </div>

      {/* Format Selection */}
      <Card>
        <Card.Header>
          <Card.Title>Target Format</Card.Title>
          <Card.Description>
            Choose the format you want to convert your images to
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <div className="grid md:grid-cols-3 gap-4">
            {supportedFormats.map((format) => (
              <motion.button
                key={format.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setTargetFormat(format.value)}
                className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  targetFormat === format.value
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 dark:text-white text-lg">
                    {format.label}
                  </span>
                  {targetFormat === format.value && (
                    <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {format.description}
                </p>
              </motion.button>
            ))}
          </div>
        </Card.Content>
      </Card>

      {/* Upload Area */}
      <Card>
        <Card.Content>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-primary-400 dark:hover:border-primary-500 transition-colors duration-200"
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Upload Images
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Drag and drop your images here, or click to browse
            </p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200 cursor-pointer"
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose Files
            </label>
          </div>
        </Card.Content>
      </Card>

      {/* Files List */}
      {files.length > 0 && (
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <Card.Title>Images ({files.length})</Card.Title>
              <div className="flex space-x-2">
                <Button
                  onClick={convertAll}
                  disabled={converting || files.every(f => f.status !== 'ready')}
                  className="bg-green-500 hover:bg-green-600"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Convert All to {targetFormat.toUpperCase()}
                </Button>
                <Button
                  variant="outline"
                  onClick={downloadAllConverted}
                  disabled={!files.some(f => f.converted)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download All
                </Button>
                <Button
                  variant="outline"
                  onClick={clearAll}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </div>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              {files.map((fileData, index) => (
                <motion.div
                  key={fileData.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">
                          {getFormatIcon(fileData.info.type)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {fileData.info.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {fileData.info.width} × {fileData.info.height} • {formatFileSize(fileData.info.size)}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                            {fileData.info.type.split('/')[1].toUpperCase()}
                          </span>
                          {fileData.conversionResult && (
                            <>
                              <span className="text-xs text-gray-400">→</span>
                              <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-1 rounded">
                                {targetFormat.toUpperCase()}
                              </span>
                            </>
                          )}
                        </div>
                        {fileData.conversionResult && (
                          <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                            Converted • {fileData.conversionResult.newSize} KB
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {fileData.status === 'ready' && (
                        <Button
                          size="sm"
                          onClick={() => convertFile(fileData)}
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Convert
                        </Button>
                      )}
                      {fileData.status === 'converting' && (
                        <div className="flex items-center space-x-2 text-blue-500">
                          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm">Converting...</span>
                        </div>
                      )}
                      {fileData.status === 'completed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadConverted(fileData)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFile(fileData.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card.Content>
        </Card>
      )}

      {/* Format Information */}
      <Card>
        <Card.Header>
          <Card.Title>Format Comparison</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 font-medium text-gray-900 dark:text-white">Format</th>
                  <th className="text-left py-2 font-medium text-gray-900 dark:text-white">Compression</th>
                  <th className="text-left py-2 font-medium text-gray-900 dark:text-white">Transparency</th>
                  <th className="text-left py-2 font-medium text-gray-900 dark:text-white">Best For</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 dark:text-gray-400">
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-2 font-medium">PNG</td>
                  <td className="py-2">Lossless</td>
                  <td className="py-2">✅ Yes</td>
                  <td className="py-2">Graphics, logos, screenshots</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-2 font-medium">JPEG</td>
                  <td className="py-2">Lossy</td>
                  <td className="py-2">❌ No</td>
                  <td className="py-2">Photos, complex images</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">WebP</td>
                  <td className="py-2">Both</td>
                  <td className="py-2">✅ Yes</td>
                  <td className="py-2">Web images, modern browsers</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card.Content>
      </Card>
    </div>
  )
}

export default ImageConverter

