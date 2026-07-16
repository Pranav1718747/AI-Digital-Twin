import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "SentinelOS Digital Twin",
  description: "Enterprise AI Operating System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground min-h-screen flex antialiased selection:bg-primary selection:text-white">
        <Providers>
          {/* Dynamic Sidebar */}
          <Sidebar />
          
          {/* Main Content Area */}
          <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <header className="h-16 glass-panel border-x-0 border-t-0 rounded-none flex items-center px-6 sticky top-0 z-30">
              <div className="flex-1">
                <h2 className="text-sm font-medium text-gray-400">Environment: <span className="text-green-400">Production</span></h2>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-sm font-bold shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                  AI
                </div>
              </div>
            </header>
            
            <div className="flex-1 overflow-auto p-6 relative">
              {children}
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
