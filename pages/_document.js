import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="Onimix Tech Toolkit - The Ultimate Free Tool Collection. Hundreds of tools for developers, SEO experts, and students." />
        <meta name="keywords" content="free tools, developer tools, SEO tools, text analysis, image tools, web tools, onimix" />
        <meta name="author" content="Onimix Tech" />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Onimix Tech Toolkit - Free Developer Tools" />
        <meta property="og:description" content="The Ultimate Free Tool Collection with hundreds of tools for developers, SEO experts, and students." />
        <meta property="og:site_name" content="Onimix Tech Toolkit" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Onimix Tech Toolkit - Free Developer Tools" />
        <meta property="twitter:description" content="The Ultimate Free Tool Collection with hundreds of tools for developers, SEO experts, and students." />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        
        {/* Theme color */}
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="msapplication-TileColor" content="#0ea5e9" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

