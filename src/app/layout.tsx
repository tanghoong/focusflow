import './globals.css'
import { Inter } from 'next/font/google'
import { ReactQueryProvider } from '@/components/ReactQueryProvider'
import Navbar from '@/components/Navbar'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from 'next-themes'
import Script from 'next/script'

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-script" strategy="beforeInteractive">
          {`
            (function () {
              function getInitialColorMode() {
                const persistedColorPreference = window.localStorage.getItem('theme');
                const hasPersistedPreference = typeof persistedColorPreference === 'string';
                if (hasPersistedPreference) {
                  return persistedColorPreference;
                }
                const mql = window.matchMedia('(prefers-color-scheme: dark)');
                const hasMediaQueryPreference = typeof mql.matches === 'boolean';
                if (hasMediaQueryPreference) {
                  return mql.matches ? 'dark' : 'light';
                }
                return 'light';
              }
              const colorMode = getInitialColorMode();
              document.documentElement.classList.add(colorMode);
            })()
          `}
        </Script>
      </head>
      <body className={`${inter.className} bg-solarized-base03 text-solarized-base0 min-h-screen dark:bg-solarized-base03 dark:text-solarized-base0`} suppressHydrationWarning>
        <ReactQueryProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
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
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
