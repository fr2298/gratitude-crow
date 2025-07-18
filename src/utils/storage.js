const STORAGE_KEY_PREFIX = 'gratitudes_'

export const loadGratitudes = (userId = 'guest') => {
  try {
    const data = localStorage.getItem(`${STORAGE_KEY_PREFIX}${userId}`)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('데이터 로드 실패:', error)
    return []
  }
}

export const saveGratitudes = (gratitudes, userId = 'guest') => {
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${userId}`, JSON.stringify(gratitudes))
    return true
  } catch (error) {
    console.error('데이터 저장 실패:', error)
    return false
  }
}

export const exportData = (gratitudes) => {
  const dataStr = JSON.stringify(gratitudes, null, 2)
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
  
  const exportFileDefaultName = `은혜기록_${new Date().toISOString().split('T')[0]}.json`
  
  const linkElement = document.createElement('a')
  linkElement.setAttribute('href', dataUri)
  linkElement.setAttribute('download', exportFileDefaultName)
  linkElement.click()
}

export const importData = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        resolve(data)
      } catch (error) {
        reject(new Error('잘못된 파일 형식입니다.'))
      }
    }
    reader.onerror = () => reject(new Error('파일 읽기 실패'))
    reader.readAsText(file)
  })
}