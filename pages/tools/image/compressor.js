import Layout from '../../../components/layout/Layout'
import ImageCompressor from '../../../components/tools/image/ImageCompressor'

export default function ImageCompressorPage() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ImageCompressor />
      </div>
    </Layout>
  )
}

