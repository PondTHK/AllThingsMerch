import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SupabaseAuthProvider } from '@/components/providers/SupabaseAuthProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'AllThingsMerch — Official Licensed Merchandise',
  description:
    'Authentic streetwear, Formula 1 apparel, music artist merch, football kits, and collectibles with verified Authenticity TAGs.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-foreground selection:text-background transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SupabaseAuthProvider>
            <AnnouncementBar />
            <Header />
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
          </SupabaseAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
