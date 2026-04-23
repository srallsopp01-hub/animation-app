import type { Metadata } from 'next';
import { Oswald, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-oswald',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Phaseboard — Rugby Animator',
  description: 'Broadcast-quality rugby tactical animation editor',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-palette="dark"
      className={`h-full ${oswald.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body
        className="h-full overflow-hidden antialiased"
        style={{
          background: 'var(--bg)',
          color: 'var(--text)',
          fontFamily: 'var(--font-inter), system-ui, sans-serif',
        }}
      >
        {children}
      </body>
    </html>
  );
}
