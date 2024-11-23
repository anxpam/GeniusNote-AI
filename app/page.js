"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const { user } = useUser();

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-50 to-blue-200 text-gray-800">
      {/* Navigation */}
      <header className="w-full p-6 flex items-center justify-between bg-transparent">
        <Link href="/">
          <Image src="/logo.png" alt="AI Note Logo" width={120} height={60} />
        </Link>
        <Link href={user ? "/dashboard" : "/sign-in"}>
          <Button variant="outline" className="hover:bg-gray-100">
            {user ? "Dashboard" : "Login"}
          </Button>
        </Link>
      </header>

      {/* Hero Section */}
      <main className="flex-grow text-center flex flex-col items-center justify-center px-4 mt-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-6xl">
          Organize Your Thoughts with <span className="text-red-600">PDF</span><span className="text-blue-600"> AI Note</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600 md:text-xl max-w-2xl">
          Your ultimate AI-powered note-taking app. Capture, organize, and enhance your thoughts effortlessly.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          {user ? (
            <Link href="/dashboard">
              <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/sign-up">
                <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </main>

      {/* Features Section */}
      <section className="mt-14 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
      <div className="p-4 rounded-lg shadow-md bg-white transition-transform hover:scale-105">
  <div className="flex justify-center">
    <Image
      src="/smart.webp"
      alt="AI Assistance"
      width={140} 
      height={140} 
      className="mx-auto"
    />
  </div>
  <h3 className="text-lg font-semibold mt-4 text-center">Smart Summarization</h3>
  <p className="text-sm text-gray-500 mt-2 text-center">
  Let AI summarize your notes for quicker understanding.
  </p>
</div>

        <div className="p-4 rounded-lg shadow-md bg-white hover:scale-105 transition-transform">
  <div className="flex justify-center">
    <Image
      src="/organized.webp"
      alt="AI Assistance"
      width={140} 
      height={140} 
      className="mx-auto"
    />
  </div>
  <h3 className="text-lg font-semibold mt-4 text-center">Organized Workspaces</h3>
  <p className="text-sm text-gray-500 mt-2 text-center">
    Manage your notes with categories and tags.
  </p>
</div>

        <div className="p-4 rounded-lg shadow-md bg-white hover:scale-105 transition-transform">
  <div className="flex justify-center">
    <Image
      src="/ai.webp"
      alt="AI Assistance"
      width={140} 
      height={140} 
      className="mx-auto"
    />
  </div>
  <h3 className="text-lg font-semibold mt-4 text-center">AI Assistance</h3>
  <p className="text-sm text-gray-500 mt-2 text-center">
    Get intelligent suggestions as you write.
  </p>
</div>
      </section>

      {/* Footer */}
      <footer className="mt-16 text-center text-gray-600 text-lg">
        &copy; {new Date().getFullYear()} AI Note Taker. All Rights Reserved.
      </footer>
    </div>
  );
}
