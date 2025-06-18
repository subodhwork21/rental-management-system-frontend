import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/auth-context';
import { ToastContainer, toast } from 'react-toastify';


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RentalPro - Property Management System',
  description: 'Professional rental property management system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
