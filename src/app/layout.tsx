import CustomLayout from "./customLayout"
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import { Toaster } from "sonner"
import type React from "react"
import "@/src/app/globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LabAssist - Laboratory Animal Management System",
  description: "Professional web application for scientific laboratories to monitor and manage laboratory animals",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.ico', type: 'image/x-icon' }
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body className={inter.className}>
        <Toaster position="top-center" />
        <CustomLayout>
          {children}
        </CustomLayout>
      </body>
    </html>
  )
}
