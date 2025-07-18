import { useState, useEffect } from 'react'
import { Plus, LogOut } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import GratitudeForm from './GratitudeForm'
import GratitudeList from './GratitudeList'
import AnniversaryAlert from './AnniversaryAlert'
import { loadGratitudes, saveGratitudes } from '../utils/storage'
import { getCurrentUser, logout } from '../utils/auth'

function Dashboard() {
  const navigate = useNavigate()
  const [gratitudes, setGratitudes] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingGratitude, setEditingGratitude] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      navigate('/login')
      return
    }
    setCurrentUser(user)
    
    // 사용자별 은혜 데이터 로드
    const userGratitudes = loadGratitudes(user.id)
    setGratitudes(userGratitudes)
  }, [navigate])

  const handleSave = (gratitudeData) => {
    let updatedGratitudes
    
    if (editingGratitude) {
      updatedGratitudes = gratitudes.map(g => 
        g.id === editingGratitude.id 
          ? { ...gratitudeData, id: g.id }
          : g
      )
    } else {
      const newGratitude = {
        ...gratitudeData,
        id: Date.now().toString()
      }
      updatedGratitudes = [...gratitudes, newGratitude]
    }
    
    setGratitudes(updatedGratitudes)
    saveGratitudes(updatedGratitudes, currentUser.id)
    setShowForm(false)
    setEditingGratitude(null)
  }

  const handleEdit = (gratitude) => {
    setEditingGratitude(gratitude)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      const updatedGratitudes = gratitudes.filter(g => g.id !== id)
      setGratitudes(updatedGratitudes)
      saveGratitudes(updatedGratitudes, currentUser.id)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-amber-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                은혜갚은 까
                <Link 
                  to="/admin"
                  className="cursor-default"
                  style={{ cursor: 'default' }}
                >
                  치
                </Link>
              </h1>
              <p className="text-gray-600 text-sm mt-1">받은 은혜를 기억하고 감사하는 마음을 기록해보세요</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">환영합니다</p>
                <p className="font-semibold text-gray-800">{currentUser?.id}님</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-4 py-8">

        <AnniversaryAlert gratitudes={gratitudes} />

        <div className="mb-6">
          <button
            onClick={() => {
              setEditingGratitude(null)
              setShowForm(true)
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl font-medium"
          >
            <Plus className="w-5 h-5" />
            은혜 기록하기
          </button>
        </div>

        <GratitudeList 
          gratitudes={gratitudes}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {showForm && (
          <GratitudeForm
            gratitude={editingGratitude}
            existingGratitudes={gratitudes}
            onSave={handleSave}
            onClose={() => {
              setShowForm(false)
              setEditingGratitude(null)
            }}
          />
        )}
      </div>
    </div>
  )
}

export default Dashboard