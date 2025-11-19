import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Somnia Predict - Decentralized Prediction Markets',
  description: 'Real-time prediction markets powered by Somnia Data Streams',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <Header />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
