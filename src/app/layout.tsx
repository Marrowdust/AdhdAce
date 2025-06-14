
"use client"; // Make this a client component to use hooks

import type { Metadata } from 'next'; // Keep for metadata, though it won't be dynamic here
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/use-theme'; // Import the hook
import { useEffect } from 'react';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

// Static metadata
export const metadataObject: Metadata = {
  title: 'ADHD Ace',
  description: 'Your personal AI assistant for managing ADHD and acing your goals.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { theme: currentTheme, setTheme } = useTheme(); // Use the hook

  // Effect to apply theme class to HTML element based on hook state
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    
    let activeTheme = currentTheme;
    if (currentTheme === 'system') {
      activeTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    root.classList.add(activeTheme);
  }, [currentTheme]);


  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Metadata can be manually set here if needed or via next/head in children */}
        <title>{String(metadataObject.title)}</title>
        <meta name="description" content={String(metadataObject.description)} />
      </head>
      <body className={cn("font-body antialiased", inter.variable)}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
