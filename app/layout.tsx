import React from 'react'

export const metadata = {
  title: 'Animo - Animal Phylogeny Game',
  description: 'Test your knowledge of animal classification',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
} 