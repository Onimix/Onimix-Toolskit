import CryptoJS from 'crypto-js'

// Word and character counting
export const analyzeText = (text) => {
  if (!text || typeof text !== 'string') {
    return {
      characters: 0,
      charactersNoSpaces: 0,
      words: 0,
      sentences: 0,
      paragraphs: 0,
      lines: 0,
      readingTime: 0
    }
  }

  const characters = text.length
  const charactersNoSpaces = text.replace(/\s/g, '').length
  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim().length > 0).length : 0
  const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length : 0
  const lines = text.split('\n').length
  const readingTime = Math.ceil(words / 200) // Average reading speed: 200 words per minute

  return {
    characters,
    charactersNoSpaces,
    words,
    sentences,
    paragraphs,
    lines,
    readingTime
  }
}

// Case conversion functions
export const convertCase = (text, caseType) => {
  if (!text || typeof text !== 'string') return ''

  switch (caseType) {
    case 'uppercase':
      return text.toUpperCase()
    case 'lowercase':
      return text.toLowerCase()
    case 'titlecase':
      return text.replace(/\w\S*/g, (txt) => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      )
    case 'sentencecase':
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
    case 'alternatingcase':
      return text.split('').map((char, index) => 
        index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
      ).join('')
    case 'inversecase':
      return text.split('').map(char => 
        char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
      ).join('')
    case 'camelcase':
      return text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      ).replace(/\s+/g, '')
    case 'pascalcase':
      return text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => 
        word.toUpperCase()
      ).replace(/\s+/g, '')
    case 'snakecase':
      return text.toLowerCase().replace(/\s+/g, '_')
    case 'kebabcase':
      return text.toLowerCase().replace(/\s+/g, '-')
    default:
      return text
  }
}

// Text reversal
export const reverseText = (text, reverseType = 'characters') => {
  if (!text || typeof text !== 'string') return ''

  switch (reverseType) {
    case 'characters':
      return text.split('').reverse().join('')
    case 'words':
      return text.split(' ').reverse().join(' ')
    case 'lines':
      return text.split('\n').reverse().join('\n')
    default:
      return text.split('').reverse().join('')
  }
}

// Hash generation
export const generateHash = (text, algorithm = 'md5') => {
  if (!text || typeof text !== 'string') return ''

  try {
    switch (algorithm.toLowerCase()) {
      case 'md5':
        return CryptoJS.MD5(text).toString()
      case 'sha1':
        return CryptoJS.SHA1(text).toString()
      case 'sha256':
        return CryptoJS.SHA256(text).toString()
      case 'sha512':
        return CryptoJS.SHA512(text).toString()
      default:
        return CryptoJS.MD5(text).toString()
    }
  } catch (error) {
    console.error('Hash generation error:', error)
    return ''
  }
}

// Text cleaning and formatting
export const cleanText = (text, options = {}) => {
  if (!text || typeof text !== 'string') return ''

  let cleaned = text

  if (options.removeExtraSpaces) {
    cleaned = cleaned.replace(/\s+/g, ' ')
  }

  if (options.removeLineBreaks) {
    cleaned = cleaned.replace(/\n/g, ' ')
  }

  if (options.removePunctuation) {
    cleaned = cleaned.replace(/[^\w\s]/g, '')
  }

  if (options.removeNumbers) {
    cleaned = cleaned.replace(/\d/g, '')
  }

  if (options.trim) {
    cleaned = cleaned.trim()
  }

  return cleaned
}

// Lorem ipsum generator
export const generateLoremIpsum = (type = 'paragraphs', count = 1) => {
  const loremWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
  ]

  const generateSentence = () => {
    const sentenceLength = Math.floor(Math.random() * 10) + 5
    const sentence = []
    for (let i = 0; i < sentenceLength; i++) {
      sentence.push(loremWords[Math.floor(Math.random() * loremWords.length)])
    }
    return sentence.join(' ') + '.'
  }

  const generateParagraph = () => {
    const paragraphLength = Math.floor(Math.random() * 5) + 3
    const sentences = []
    for (let i = 0; i < paragraphLength; i++) {
      sentences.push(generateSentence())
    }
    return sentences.join(' ')
  }

  switch (type) {
    case 'words':
      return Array.from({ length: count }, () => 
        loremWords[Math.floor(Math.random() * loremWords.length)]
      ).join(' ')
    
    case 'sentences':
      return Array.from({ length: count }, generateSentence).join(' ')
    
    case 'paragraphs':
      return Array.from({ length: count }, generateParagraph).join('\n\n')
    
    default:
      return generateParagraph()
  }
}

// Text statistics
export const getTextStatistics = (text) => {
  const analysis = analyzeText(text)
  
  if (!text || text.trim().length === 0) {
    return { ...analysis, averageWordsPerSentence: 0, averageCharsPerWord: 0 }
  }

  const averageWordsPerSentence = analysis.sentences > 0 ? 
    Math.round((analysis.words / analysis.sentences) * 100) / 100 : 0
  
  const averageCharsPerWord = analysis.words > 0 ? 
    Math.round((analysis.charactersNoSpaces / analysis.words) * 100) / 100 : 0

  return {
    ...analysis,
    averageWordsPerSentence,
    averageCharsPerWord
  }
}

