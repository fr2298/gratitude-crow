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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-primary">
              은혜갚은 까
              <Link 
                to="/admin"
                className="cursor-default"
                style={{ cursor: 'default' }}
              >
                치
              </Link>
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">
                {currentUser?.id}님 환영합니다
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                <LogOut className="w-4 h-4" />
                로그아웃
              </button>
            </div>
          </div>
          <p className="text-gray-600 mt-2">받은 은혜를 기억하고 감사하는 마음을 기록해보세요</p>
        </header>

        <AnniversaryAlert gratitudes={gratitudes} />

        <div className="mb-6">
          <button
            onClick={() => {
              setEditingGratitude(null)
              setShowForm(true)
            }}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-colors shadow-md"
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