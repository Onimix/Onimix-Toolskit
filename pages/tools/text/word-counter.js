import Layout from '../../../components/layout/Layout'
import WordCounter from '../../../components/tools/text/WordCounter'

export default function WordCounterPage() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WordCounter />
      </div>
    </Layout>
  )
}

