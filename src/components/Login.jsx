import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../utils/auth'

function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    id: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    try {
      const user = login(formData.id, formData.password)
      if (user.isAdmin) {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-amber-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            은혜갚은 까치
          </h1>
          <p className="text-gray-600 mt-2">소중한 은혜를 기억하고 감사하는 공간</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              아이디
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.id}
                onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
                className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                required
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호
            </label>
            <div className="relative">
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                required
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl font-medium"
          >
            로그인
          </button>
        </form>

        <div className="mt-6 space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">또는</span>
            </div>
          </div>
          
          <Link 
            to="/register" 
            className="block w-full py-3 border-2 border-amber-400 text-amber-600 rounded-xl hover:bg-amber-50 transition-all duration-200 text-center font-medium"
          >
            회원가입
          </Link>
          
          <Link 
            to="/reset-password" 
            className="text-sm text-gray-500 hover:text-gray-700 block text-center hover:underline"
          >
            비밀번호를 잊으셨나요?
          </Link>
        </div>
        
        <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-200">
          <p className="text-xs text-amber-700 text-center leading-relaxed">
            ⚠️ 프로토타입 버전으로 인터넷 방문기록 / 쿠키 / 사이트 데이터 삭제 시<br />
            기록 내용도 함께 삭제되며 다른 기기에서는 공유가 안됩니다
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login