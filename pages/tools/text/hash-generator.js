import Layout from '../../../components/layout/Layout'
import HashGenerator from '../../../components/tools/text/HashGenerator'

export default function HashGeneratorPage() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <HashGenerator />
      </div>
    </Layout>
  )
}

