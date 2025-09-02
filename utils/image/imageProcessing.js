// Image processing utilities for client-side operations

// Compress image to target file size
export const compressImage = (file, targetSizeKB, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      
      // Try different quality levels to reach target size
      let currentQuality = quality
      let attempts = 0
      const maxAttempts = 10
      
      const tryCompress = () => {
        const compressedDataUrl = canvas.toDataURL('image/jpeg', currentQuality)
        const compressedSize = Math.round((compressedDataUrl.length * 3) / 4 / 1024) // Approximate size in KB
        
        if (compressedSize <= targetSizeKB || attempts >= maxAttempts) {
          // Convert data URL to blob
          fetch(compressedDataUrl)
            .then(res => res.blob())
            .then(blob => {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              })
              resolve({
                file: compressedFile,
                originalSize: Math.round(file.size / 1024),
                compressedSize: Math.round(blob.size / 1024),
                compressionRatio: Math.round((1 - blob.size / file.size) * 100),
                quality: currentQuality
              })
            })
        } else {
          currentQuality -= 0.1
          attempts++
          tryCompress()
        }
      }
      
      tryCompress()
    }
    
    img.src = URL.createObjectURL(file)
  })
}

// Resize image to specific dimensions
export const resizeImage = (file, width, height, maintainAspectRatio = true) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      let newWidth = width
      let newHeight = height
      
      if (maintainAspectRatio) {
        const aspectRatio = img.width / img.height
        if (width / height > aspectRatio) {
          newWidth = height * aspectRatio
        } else {
          newHeight = width / aspectRatio
        }
      }
      
      canvas.width = newWidth
      canvas.height = newHeight
      ctx.drawImage(img, 0, 0, newWidth, newHeight)
      
      canvas.toBlob((blob) => {
        const resizedFile = new File([blob], file.name, {
          type: file.type,
          lastModified: Date.now()
        })
        resolve({
          file: resizedFile,
          originalDimensions: { width: img.width, height: img.height },
          newDimensions: { width: newWidth, height: newHeight },
          originalSize: Math.round(file.size / 1024),
          newSize: Math.round(blob.size / 1024)
        })
      }, file.type)
    }
    
    img.src = URL.createObjectURL(file)
  })
}

// Convert image format
export const convertImageFormat = (file, targetFormat) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      
      const mimeType = `image/${targetFormat}`
      canvas.toBlob((blob) => {
        const fileName = file.name.replace(/\.[^/.]+$/, `.${targetFormat}`)
        const convertedFile = new File([blob], fileName, {
          type: mimeType,
          lastModified: Date.now()
        })
        resolve({
          file: convertedFile,
          originalFormat: file.type,
          newFormat: mimeType,
          originalSize: Math.round(file.size / 1024),
          newSize: Math.round(blob.size / 1024)
        })
      }, mimeType)
    }
    
    img.src = URL.createObjectURL(file)
  })
}

// Generate favicon from image
export const generateFavicon = (file, sizes = [16, 32, 48, 64]) => {
  return Promise.all(sizes.map(size => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        canvas.width = size
        canvas.height = size
        ctx.drawImage(img, 0, 0, size, size)
        
        canvas.toBlob((blob) => {
          const fileName = `favicon-${size}x${size}.png`
          const faviconFile = new File([blob], fileName, {
            type: 'image/png',
            lastModified: Date.now()
          })
          resolve({
            size,
            file: faviconFile,
            dataUrl: canvas.toDataURL('image/png')
          })
        }, 'image/png')
      }
      
      img.src = URL.createObjectURL(file)
    })
  }))
}

// Get image information
export const getImageInfo = (file) => {
  return new Promise((resolve) => {
    const img = new Image()
    
    img.onload = () => {
      resolve({
        name: file.name,
        size: file.size,
        sizeKB: Math.round(file.size / 1024),
        sizeMB: Math.round(file.size / (1024 * 1024) * 100) / 100,
        type: file.type,
        width: img.width,
        height: img.height,
        aspectRatio: Math.round((img.width / img.height) * 100) / 100,
        megapixels: Math.round((img.width * img.height) / 1000000 * 100) / 100,
        lastModified: new Date(file.lastModified).toLocaleString()
      })
    }
    
    img.src = URL.createObjectURL(file)
  })
}

// Color analysis
export const analyzeImageColors = (file, sampleSize = 10) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      const colorMap = new Map()
      
      // Sample pixels
      for (let i = 0; i < data.length; i += 4 * sampleSize) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        const alpha = data[i + 3]
        
        if (alpha > 128) { // Only count non-transparent pixels
          const color = `rgb(${r}, ${g}, ${b})`
          colorMap.set(color, (colorMap.get(color) || 0) + 1)
        }
      }
      
      // Get dominant colors
      const sortedColors = Array.from(colorMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([color, count]) => ({ color, count }))
      
      resolve({
        dominantColors: sortedColors,
        totalPixels: (canvas.width * canvas.height),
        sampledPixels: Math.floor(data.length / (4 * sampleSize))
      })
    }
    
    img.src = URL.createObjectURL(file)
  })
}

// RGB to HEX conversion
export const rgbToHex = (r, g, b) => {
  return "#" + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? "0" + hex : hex
  }).join("")
}

// HEX to RGB conversion
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

// Download file
export const downloadFile = (file, filename) => {
  const url = URL.createObjectURL(file)
  const a = document.createElement('a')
  a.href = url
  a.download = filename || file.name
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Create ZIP file with multiple images
export const createImageZip = async (files, zipName = 'images.zip') => {
  const JSZip = (await import('jszip')).default
  const zip = new JSZip()
  
  files.forEach((file, index) => {
    zip.file(file.name || `image-${index + 1}`, file)
  })
  
  const zipBlob = await zip.generateAsync({ type: 'blob' })
  return new File([zipBlob], zipName, { type: 'application/zip' })
}

