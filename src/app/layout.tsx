import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Rugby Animator',
  description: 'Build, edit, and share rugby tactical animations',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full overflow-hidden bg-zinc-950 text-zinc-100 antialiased">
        {children}
      </body>
    </html>
  );
}
