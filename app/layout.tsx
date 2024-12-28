import './globals.css';
import Script from 'next/script';

export const metadata = {
  title: 'EPSON Printer Demo',
  description: 'Next.js 13 EPSON Printer Demo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script src="/lib/epos-2.17.0.js" strategy="beforeInteractive" />
      </head>
      <body>{children}</body>
    </html>
  );
}
