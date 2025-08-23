import { Library, Plus, Search, Settings } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-cork-50">
      {/* Header */}
      <header className="border-b border-cork-200 bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Library className="h-8 w-8 text-cork-600" />
            <h1 className="text-2xl font-bold text-cork-800">TBR Manager</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="inline-flex items-center gap-2 bg-cork-600 text-white px-4 py-2 rounded-lg hover:bg-cork-700 transition-colors">
              <Plus className="h-4 w-4" />
              Add Book
            </button>
            <button className="p-2 text-cork-600 hover:bg-cork-100 rounded-lg transition-colors">
              <Search className="h-5 w-5" />
            </button>
            <button className="p-2 text-cork-600 hover:bg-cork-100 rounded-lg transition-colors">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-cork-800 mb-2">Your Reading Collection</h2>
          <p className="text-cork-600">
            Organize your books visually with drag-and-drop on your personal cork board
          </p>
        </div>

        {/* Cork Board Preview */}
        <div className="cork-board min-h-[600px] rounded-xl border-2 border-cork-200 p-8">
          <div className="text-center text-cork-500 mt-32">
            <Library className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">Your Cork Board Awaits</h3>
            <p className="mb-6 max-w-md mx-auto">
              Add your first book to get started. Your books will appear here as visual covers
              that you can drag and organize however you like.
            </p>
            <button className="inline-flex items-center gap-2 bg-cork-600 text-white px-6 py-3 rounded-lg hover:bg-cork-700 transition-colors font-semibold">
              <Plus className="h-5 w-5" />
              Add Your First Book
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white rounded-lg p-6 border border-cork-200">
            <div className="text-2xl font-bold text-cork-800">0</div>
            <div className="text-cork-600">Total Books</div>
          </div>
          <div className="bg-white rounded-lg p-6 border border-cork-200">
            <div className="text-2xl font-bold text-cork-800">0</div>
            <div className="text-cork-600">To Be Read</div>
          </div>
          <div className="bg-white rounded-lg p-6 border border-cork-200">
            <div className="text-2xl font-bold text-cork-800">0</div>
            <div className="text-cork-600">Currently Reading</div>
          </div>
          <div className="bg-white rounded-lg p-6 border border-cork-200">
            <div className="text-2xl font-bold text-cork-800">0</div>
            <div className="text-cork-600">Completed</div>
          </div>
        </div>
      </main>
    </div>
  )
}