// 간단한 인증 시스템 (로컬 스토리지 기반)
const AUTH_KEY = 'gratitude_auth'
const USERS_KEY = 'gratitude_users'

// 관리자 계정
const ADMIN_CREDENTIALS = {
  id: 'samsung',
  password: 'vipcenter',
  email: 'admin@gratitude.com',
  isAdmin: true
}

// 초기 사용자 데이터 설정
export const initializeUsers = () => {
  const users = localStorage.getItem(USERS_KEY)
  if (!users) {
    const initialUsers = [ADMIN_CREDENTIALS]
    localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers))
  }
}

// 회원가입
export const register = (userData) => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  
  // 중복 체크
  if (users.find(u => u.id === userData.id)) {
    throw new Error('이미 존재하는 아이디입니다.')
  }
  
  if (users.find(u => u.email === userData.email)) {
    throw new Error('이미 등록된 이메일입니다.')
  }
  
  const newUser = {
    ...userData,
    isAdmin: false,
    createdAt: new Date().toISOString()
  }
  
  users.push(newUser)
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
  
  return newUser
}

// 로그인
export const login = (id, password) => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  const user = users.find(u => u.id === id && u.password === password)
  
  if (!user) {
    throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.')
  }
  
  const authData = {
    id: user.id,
    email: user.email,
    isAdmin: user.isAdmin,
    loginTime: new Date().toISOString()
  }
  
  localStorage.setItem(AUTH_KEY, JSON.stringify(authData))
  return authData
}

// 로그아웃
export const logout = () => {
  localStorage.removeItem(AUTH_KEY)
}

// 현재 로그인한 사용자 정보 가져오기
export const getCurrentUser = () => {
  const authData = localStorage.getItem(AUTH_KEY)
  return authData ? JSON.parse(authData) : null
}

// 로그인 여부 확인
export const isAuthenticated = () => {
  return !!getCurrentUser()
}

// 관리자 여부 확인
export const isAdmin = () => {
  const user = getCurrentUser()
  return user?.isAdmin === true
}

// 모든 사용자 목록 가져오기 (관리자용)
export const getAllUsers = () => {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
}

// 사용자별 은혜 개수 가져오기
export const getUserGratitudeCount = (userId) => {
  const gratitudes = JSON.parse(localStorage.getItem(`gratitudes_${userId}`) || '[]')
  return gratitudes.length
}