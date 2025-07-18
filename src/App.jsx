import { useState, useEffect } from 'react'
import { Heart, Calendar, Search, Plus, User } from 'lucide-react'
import GratitudeForm from './components/GratitudeForm'
import GratitudeList from './components/GratitudeList'
import AnniversaryAlert from './components/AnniversaryAlert'
import { loadGratitudes, saveGratitudes } from './utils/storage'

function App() {
  const [gratitudes, setGratitudes] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGratitude, setSelectedGratitude] = useState(null)

  useEffect(() => {
    const loaded = loadGratitudes()
    setGratitudes(loaded)
  }, [])

  const handleSave = (gratitude) => {
    const newGratitudes = selectedGratitude
      ? gratitudes.map(g => g.id === selectedGratitude.id ? { ...gratitude, id: g.id } : g)
      : [...gratitudes, { ...gratitude, id: Date.now().toString() }]
    
    setGratitudes(newGratitudes)
    saveGratitudes(newGratitudes)
    setShowForm(false)
    setSelectedGratitude(null)
  }

  const handleEdit = (gratitude) => {
    setSelectedGratitude(gratitude)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      const newGratitudes = gratitudes.filter(g => g.id !== id)
      setGratitudes(newGratitudes)
      saveGratitudes(newGratitudes)
    }
  }

  const filteredGratitudes = gratitudes.filter(g => 
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <header className="bg-white shadow-sm border-b border-amber-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-8 h-8 text-primary fill-primary" />
              <h1 className="text-2xl font-bold text-gray-800">은혜 갚은 까치</h1>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <Plus className="w-5 h-5" />
              은혜 기록하기
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <AnniversaryAlert gratitudes={gratitudes} />
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="이름이나 내용으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>총 {gratitudes.length}명의 은인</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>기념일 {gratitudes.reduce((acc, g) => acc + (g.anniversaries?.length || 0), 0)}개</span>
            </div>
          </div>
        </div>

        <GratitudeList
          gratitudes={filteredGratitudes}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>

      {showForm && (
        <GratitudeForm
          gratitude={selectedGratitude}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false)
            setSelectedGratitude(null)
          }}
        />
      )}
    </div>
  )
}

export default App