import { BookOpen, Library, Plus, Search } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-cork-50 to-cork-100">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <Library className="h-12 w-12 text-cork-600" />
            <h1 className="text-5xl font-bold text-cork-800">TBR Manager</h1>
          </div>
          <p className="text-xl text-cork-600 mb-8 max-w-2xl mx-auto">
            A visual, interactive book management system designed to organize and track your
            reading lists with a beautiful cork board aesthetic.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-cork-600 text-white px-6 py-3 rounded-lg hover:bg-cork-700 transition-colors font-semibold"
            >
              <BookOpen className="h-5 w-5" />
              Get Started
            </Link>
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 border-2 border-cork-600 text-cork-600 px-6 py-3 rounded-lg hover:bg-cork-600 hover:text-white transition-colors font-semibold"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-cork-200">
            <div className="h-12 w-12 bg-cork-100 rounded-lg flex items-center justify-center mb-4">
              <Library className="h-6 w-6 text-cork-600" />
            </div>
            <h3 className="text-xl font-semibold text-cork-800 mb-2">Cork Board Interface</h3>
            <p className="text-cork-600">
              Organize your books visually with a beautiful cork board aesthetic where book covers
              are pinned like notes.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-cork-200">
            <div className="h-12 w-12 bg-cork-100 rounded-lg flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-cork-600" />
            </div>
            <h3 className="text-xl font-semibold text-cork-800 mb-2">Easy Book Management</h3>
            <p className="text-cork-600">
              Add books quickly with search, ISBN scanning, or bulk import. Organize into custom
              shelves and categories.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-cork-200">
            <div className="h-12 w-12 bg-cork-100 rounded-lg flex items-center justify-center mb-4">
              <Search className="h-6 w-6 text-cork-600" />
            </div>
            <h3 className="text-xl font-semibold text-cork-800 mb-2">Smart Organization</h3>
            <p className="text-cork-600">
              Drag-and-drop reordering, multiple view modes, and intelligent filtering to keep your
              TBR list perfectly organized.
            </p>
          </div>
        </div>

        {/* Preview Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-cork-800 mb-8">
            Manage Your Books Like Never Before
          </h2>
          <div className="bg-white rounded-xl p-8 shadow-lg border border-cork-200 max-w-4xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-[2/3] bg-gradient-to-br from-cork-200 to-cork-300 rounded-lg shadow-md transform rotate-1 hover:rotate-0 transition-transform cursor-pointer"
                  style={{ transform: `rotate(${Math.random() * 6 - 3}deg)` }}
                >
                  <div className="w-full h-full rounded-lg bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full shadow-sm" />
                </div>
              ))}
            </div>
            <p className="text-cork-600 mt-6">
              Visual cork board interface with drag-and-drop organization
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}