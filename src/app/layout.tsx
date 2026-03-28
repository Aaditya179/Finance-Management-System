import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Nexora | Master the Market',
  description: 'Aggregation of fragmented financial data. Trust + verification. Decision-making intelligence for institutions.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased text-foreground bg-background overflow-x-hidden selection:bg-brand-dark/30 selection:text-white`}>
        {children}
      </body>
    </html>
  )
}
