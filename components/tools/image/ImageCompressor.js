import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Upload, Download, Trash2, Image as ImageIcon, Zap, FileImage, Compress } from 'lucide-react'
import { Card, Button } from '../../ui'
import { compressImage, getImageInfo, downloadFile } from '../../../utils/image/imageProcessing'

const ImageCompressor = () => {
  const [files, setFiles] = useState([])
  const [compressing, setCompressing] = useState(false)
  const [targetSize, setTargetSize] = useState(500) // KB
  const [quality, setQuality] = useState(0.8)

  const handleFileUpload = useCallback((event) => {
    const uploadedFiles = Array.from(event.target.files)
    const imageFiles = uploadedFiles.filter(file => file.type.startsWith('image/'))
    
    Promise.all(imageFiles.map(async (file) => {
      const info = await getImageInfo(file)
      return {
        id: Date.now() + Math.random(),
        original: file,
        info,
        compressed: null,
        compressionResult: null,
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
        compressed: null,
        compressionResult: null,
        status: 'ready'
      }
    })).then(newFiles => {
      setFiles(prev => [...prev, ...newFiles])
    })
  }, [])

  const handleDragOver = useCallback((event) => {
    event.preventDefault()
  }, [])

  const compressFile = async (fileData) => {
    setFiles(prev => prev.map(f => 
      f.id === fileData.id ? { ...f, status: 'compressing' } : f
    ))

    try {
      const result = await compressImage(fileData.original, targetSize, quality)
      setFiles(prev => prev.map(f => 
        f.id === fileData.id ? { 
          ...f, 
          compressed: result.file,
          compressionResult: result,
          status: 'completed'
        } : f
      ))
    } catch (error) {
      console.error('Compression failed:', error)
      setFiles(prev => prev.map(f => 
        f.id === fileData.id ? { ...f, status: 'error' } : f
      ))
    }
  }

  const compressAll = async () => {
    setCompressing(true)
    const readyFiles = files.filter(f => f.status === 'ready')
    
    for (const file of readyFiles) {
      await compressFile(file)
    }
    
    setCompressing(false)
  }

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  const downloadCompressed = (fileData) => {
    if (fileData.compressed) {
      downloadFile(fileData.compressed)
    }
  }

  const downloadAllCompressed = () => {
    const compressedFiles = files.filter(f => f.compressed)
    compressedFiles.forEach(f => downloadFile(f.compressed))
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

  const targetSizeOptions = [
    { value: 100, label: '100 KB' },
    { value: 200, label: '200 KB' },
    { value: 500, label: '500 KB' },
    { value: 1000, label: '1 MB' },
    { value: 2000, label: '2 MB' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Image Compressor
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Compress your images to reduce file size while maintaining quality. Perfect for web optimization and storage.
        </p>
      </div>

      {/* Settings */}
      <Card>
        <Card.Header>
          <Card.Title>Compression Settings</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target File Size
              </label>
              <div className="flex space-x-2">
                {targetSizeOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => setTargetSize(option.value)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      targetSize === option.value
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <div className="mt-3">
                <input
                  type="range"
                  min="50"
                  max="5000"
                  value={targetSize}
                  onChange={(e) => setTargetSize(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Custom: {targetSize} KB
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Initial Quality
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Quality: {Math.round(quality * 100)}%
              </div>
            </div>
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
                  onClick={compressAll}
                  disabled={compressing || files.every(f => f.status !== 'ready')}
                  className="bg-green-500 hover:bg-green-600"
                >
                  <Compress className="w-4 h-4 mr-2" />
                  Compress All
                </Button>
                <Button
                  variant="outline"
                  onClick={downloadAllCompressed}
                  disabled={!files.some(f => f.compressed)}
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
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {fileData.info.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {fileData.info.width} × {fileData.info.height} • {formatFileSize(fileData.info.size)}
                        </p>
                        {fileData.compressionResult && (
                          <p className="text-sm text-green-600 dark:text-green-400">
                            Compressed to {fileData.compressionResult.compressedSize} KB 
                            ({fileData.compressionResult.compressionRatio}% reduction)
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {fileData.status === 'ready' && (
                        <Button
                          size="sm"
                          onClick={() => compressFile(fileData)}
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          Compress
                        </Button>
                      )}
                      {fileData.status === 'compressing' && (
                        <div className="flex items-center space-x-2 text-blue-500">
                          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm">Compressing...</span>
                        </div>
                      )}
                      {fileData.status === 'completed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadCompressed(fileData)}
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

      {/* Information */}
      <Card>
        <Card.Header>
          <Card.Title>About Image Compression</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">How it works</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Our image compressor uses advanced algorithms to reduce file size while preserving visual quality. 
                It automatically adjusts compression parameters to meet your target file size.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Best practices</h4>
              <ul className="text-gray-600 dark:text-gray-400 text-sm space-y-1">
                <li>• Use JPEG for photos with many colors</li>
                <li>• Use PNG for images with transparency</li>
                <li>• Lower target sizes may reduce quality</li>
                <li>• Test different quality settings for best results</li>
              </ul>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  )
}

export default ImageCompressor

