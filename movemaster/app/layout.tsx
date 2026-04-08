import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { QuoteProvider } from '@/context/QuoteContext';
import ToastContainer from '@/components/ui/Toast';

export const metadata: Metadata = {
  title: { default: 'MoveMaster Pro | Southern Ontario Moving Company', template: '%s | MoveMaster Pro' },
  description: "Southern Ontario's most trusted moving company. Residential, commercial, long-distance moving across Toronto, Mississauga, Hamilton, and 15+ cities. Get your free quote today.",
  keywords: ['moving company', 'Southern Ontario', 'Toronto movers', 'Mississauga moving', 'Hamilton movers'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-bg text-text-primary">
        <AuthProvider>
          <QuoteProvider>
            {children}
            <ToastContainer />
          </QuoteProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
