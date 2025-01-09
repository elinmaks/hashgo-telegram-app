import '@/styles/globals.css'
import { Inter, Roboto_Mono } from 'next/font/google'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter' })
const robotoMono = Roboto_Mono({ subsets: ['latin', 'cyrillic'], variable: '--font-roboto-mono' })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={`${inter.variable} ${robotoMono.variable}`}>
      <head>
        <title>Хэшго</title>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      </head>
      <body className="font-sans bg-gray-900 text-white">{children}</body>
    </html>
  )
}

