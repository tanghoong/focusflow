import './globals.css'
import { Inter } from 'next/font/google'
import { ReactQueryProvider } from '@/components/ReactQueryProvider'
import Navbar from '@/components/Navbar'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from 'next-themes'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'FocusFlow',
  description: 'Boost your productivity with FocusFlow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #073642;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #586e75;
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: #657b83;
          }
        `}</style>
      </head>
      <ThemeProvider attribute="class">
        <body className="bg-solarized-base03 text-solarized-base0 min-h-screen dark:bg-solarized-base03 dark:text-solarized-base0">
          <ReactQueryProvider>
            <Navbar />
            <main className="px-4 py-8 overflow-x-auto custom-scrollbar">
              {children}
            </main>
            <Toaster
              position="top-center"
              toastOptions={{
                className: 'mt-[15vh]',
              }}
            />
          </ReactQueryProvider>
        </body>
      </ThemeProvider>
    </html>
  )
}
