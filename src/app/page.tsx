import Link from 'next/link'

// Emergency inline SVG icons
const LibraryIcon = () => (
  <svg className="h-12 w-12 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
)

const BookOpenIcon = ({ className }: { className?: string }) => (
  <svg className={className || "h-5 w-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
)

const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className || "h-6 w-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
)

const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className || "h-6 w-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100" style={{
      background: 'linear-gradient(to bottom right, #fffbeb, #fef3c7)',
      minHeight: '100vh'
    }}>
      <div className="container mx-auto px-4 py-16" style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1rem' }}>
        {/* Hero Section */}
        <div className="text-center mb-16" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="inline-flex items-center gap-3 mb-6" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <LibraryIcon />
            <h1 className="text-5xl font-bold text-amber-800" style={{ fontSize: '3rem', fontWeight: 'bold', color: '#92400e' }}>TBR Manager</h1>
          </div>
          <p className="text-xl text-amber-600 mb-8 max-w-2xl mx-auto" style={{ fontSize: '1.25rem', color: '#d97706', marginBottom: '2rem', maxWidth: '42rem', margin: '0 auto 2rem auto' }}>
            A visual, interactive book management system designed to organize and track your
            reading lists with a beautiful cork board aesthetic.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center', alignItems: 'center' }}>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors font-semibold"
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                backgroundColor: '#d97706', 
                color: 'white', 
                padding: '0.75rem 1.5rem', 
                borderRadius: '0.5rem', 
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'background-color 0.2s ease'
              }}
            >
              <BookOpenIcon />
              Get Started
            </Link>
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 border-2 border-amber-600 text-amber-600 px-6 py-3 rounded-lg hover:bg-amber-600 hover:text-white transition-colors font-semibold"
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                border: '2px solid #d97706', 
                color: '#d97706', 
                padding: '0.75rem 1.5rem', 
                borderRadius: '0.5rem', 
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-amber-200" style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', border: '1px solid #fde68a' }}>
            <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4" style={{ width: '3rem', height: '3rem', backgroundColor: '#fef3c7', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <LibraryIcon />
            </div>
            <h3 className="text-xl font-semibold text-amber-800 mb-2" style={{ fontSize: '1.25rem', fontWeight: '600', color: '#92400e', marginBottom: '0.5rem' }}>Cork Board Interface</h3>
            <p className="text-amber-600" style={{ color: '#d97706' }}>
              Organize your books visually with a beautiful cork board aesthetic where book covers
              are pinned like notes.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-amber-200" style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', border: '1px solid #fde68a' }}>
            <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4" style={{ width: '3rem', height: '3rem', backgroundColor: '#fef3c7', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <PlusIcon className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold text-amber-800 mb-2" style={{ fontSize: '1.25rem', fontWeight: '600', color: '#92400e', marginBottom: '0.5rem' }}>Easy Book Management</h3>
            <p className="text-amber-600" style={{ color: '#d97706' }}>
              Add books quickly with search, ISBN scanning, or bulk import. Organize into custom
              shelves and categories.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-amber-200" style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', border: '1px solid #fde68a' }}>
            <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4" style={{ width: '3rem', height: '3rem', backgroundColor: '#fef3c7', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <SearchIcon className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold text-amber-800 mb-2" style={{ fontSize: '1.25rem', fontWeight: '600', color: '#92400e', marginBottom: '0.5rem' }}>Smart Organization</h3>
            <p className="text-amber-600" style={{ color: '#d97706' }}>
              Drag-and-drop reordering, multiple view modes, and intelligent filtering to keep your
              TBR list perfectly organized.
            </p>
          </div>
        </div>

        {/* Preview Section */}
        <div className="text-center" style={{ textAlign: 'center' }}>
          <h2 className="text-3xl font-bold text-amber-800 mb-8" style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#92400e', marginBottom: '2rem' }}>
            Manage Your Books Like Never Before
          </h2>
          <div className="bg-white rounded-xl p-8 shadow-lg border border-amber-200 max-w-4xl mx-auto" style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '2rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', border: '1px solid #fde68a', maxWidth: '56rem', margin: '0 auto' }}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '1rem' }}>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-[2/3] bg-gradient-to-br from-amber-200 to-amber-300 rounded-lg shadow-md transform rotate-1 hover:rotate-0 transition-transform cursor-pointer"
                  style={{ 
                    aspectRatio: '2/3', 
                    background: 'linear-gradient(to bottom right, #fde68a, #fcd34d)', 
                    borderRadius: '0.5rem', 
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
                    transform: `rotate(${Math.random() * 6 - 3}deg)`, 
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease',
                    position: 'relative'
                  }}
                >
                  <div className="w-full h-full rounded-lg bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center" style={{ width: '100%', height: '100%', borderRadius: '0.5rem', background: 'linear-gradient(to bottom right, #94a3b8, #475569)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BookOpenIcon className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full shadow-sm" style={{ position: 'absolute', top: '-0.25rem', right: '-0.25rem', width: '0.75rem', height: '0.75rem', backgroundColor: '#ef4444', borderRadius: '50%', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }} />
                </div>
              ))}
            </div>
            <p className="text-amber-600 mt-6" style={{ color: '#d97706', marginTop: '1.5rem' }}>
              Visual cork board interface with drag-and-drop organization
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}