import { useState, useMemo } from 'react'
import { X, Camera, Plus, Trash2 } from 'lucide-react'

function GratitudeForm({ gratitude, existingGratitudes = [], onSave, onClose }) {
  const [formData, setFormData] = useState({
    date: gratitude?.date || new Date().toISOString().split('T')[0],
    content: gratitude?.content || '',
    name: gratitude?.name || '',
    nickname: gratitude?.nickname || '',
    anniversaries: gratitude?.anniversaries || [],
    memo: gratitude?.memo || '',
    photos: gratitude?.photos || []
  })
  
  const [showSuggestions, setShowSuggestions] = useState(false)

  // 은인 이름 자동완성을 위한 고유 이름 목록
  const uniqueNames = useMemo(() => {
    const names = new Set()
    existingGratitudes.forEach(g => {
      if (g.name) names.add(g.name)
    })
    return Array.from(names)
  }, [existingGratitudes])

  // 입력된 이름에 따른 추천 목록
  const suggestions = useMemo(() => {
    if (!formData.name) return []
    return uniqueNames
      .filter(name => name.toLowerCase().includes(formData.name.toLowerCase()))
      .slice(0, 3)
  }, [formData.name, uniqueNames])

  const handleNameChange = (e) => {
    setFormData(prev => ({ ...prev, name: e.target.value }))
    setShowSuggestions(true)
  }

  const selectSuggestion = (name) => {
    setFormData(prev => ({ ...prev, name }))
    setShowSuggestions(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.content) {
      alert('이름과 은혜 내용은 필수입니다.')
      return
    }
    onSave(formData)
  }

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files)
    Promise.all(
      files.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader()
          reader.onload = (e) => resolve(e.target.result)
          reader.readAsDataURL(file)
        })
      })
    ).then(photos => {
      setFormData(prev => ({ ...prev, photos: [...prev.photos, ...photos] }))
    })
  }

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }))
  }

  const addAnniversary = () => {
    setFormData(prev => ({
      ...prev,
      anniversaries: [...prev.anniversaries, { type: '', date: '', isRecurring: true }]
    }))
  }

  const updateAnniversary = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      anniversaries: prev.anniversaries.map((ann, i) => 
        i === index ? { ...ann, [field]: value } : ann
      )
    }))
  }

  const removeAnniversary = (index) => {
    setFormData(prev => ({
      ...prev,
      anniversaries: prev.anniversaries.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-amber-100">
        <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-amber-100 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            {gratitude ? '은혜 수정하기' : '은혜 기록하기'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 group"
          >
            <X className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              은인 이름 *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={handleNameChange}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
              placeholder="홍길동"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-amber-200 rounded-xl shadow-xl overflow-hidden">
                {suggestions.map((name, index) => (
                  <button
                    key={index}
                    type="button"
                    className="w-full px-4 py-3 text-left hover:bg-amber-50 focus:bg-amber-50 transition-colors duration-150 border-b border-amber-100 last:border-0"
                    onMouseDown={() => selectSuggestion(name)}
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              은인 별칭
            </label>
            <input
              type="text"
              value={formData.nickname}
              onChange={(e) => setFormData(prev => ({ ...prev, nickname: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
              placeholder="선생님, 사장님 등"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              은혜받은 날짜 *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              은혜 내용 *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
              rows="3"
              placeholder="어떤 도움을 받으셨나요?"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                은인 기념일
              </label>
              <button
                type="button"
                onClick={addAnniversary}
                className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700 font-medium"
              >
                <Plus className="w-4 h-4" />
                기념일 추가
              </button>
            </div>
            <div className="space-y-2">
              {formData.anniversaries.map((anniversary, index) => (
                <div key={index} className="space-y-2 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={anniversary.type}
                      onChange={(e) => updateAnniversary(index, 'type', e.target.value)}
                      placeholder="기념일 이름 (예: 생일, 결혼기념일)"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={() => removeAnniversary(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`anniversary-type-${index}`}
                        checked={anniversary.isRecurring !== false}
                        onChange={() => updateAnniversary(index, 'isRecurring', true)}
                        className="text-amber-500 focus:ring-amber-400 focus:ring-2"
                      />
                      <span className="text-sm">반복일 (예: 생일)</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`anniversary-type-${index}`}
                        checked={anniversary.isRecurring === false}
                        onChange={() => updateAnniversary(index, 'isRecurring', false)}
                        className="text-amber-500 focus:ring-amber-400 focus:ring-2"
                      />
                      <span className="text-sm">지정일 (예: 정년퇴직)</span>
                    </label>
                  </div>
                  <div>
                    <input
                      type="date"
                      value={anniversary.date}
                      onChange={(e) => updateAnniversary(index, 'date', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
                    {anniversary.isRecurring !== false && (
                      <p className="text-xs text-amber-600 mt-1 italic">년도를 신경쓰지 마세요</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              은인 메모
            </label>
            <textarea
              value={formData.memo}
              onChange={(e) => setFormData(prev => ({ ...prev, memo: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
              rows="2"
              placeholder="추가로 기억하고 싶은 내용"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              사진
            </label>
            <div className="space-y-2">
              <label className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-amber-300 rounded-xl cursor-pointer hover:border-amber-400 hover:bg-amber-50 transition-all duration-200">
                <Camera className="w-5 h-5 text-amber-500" />
                <span className="text-amber-600 font-medium">사진 선택</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
              {formData.photos.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {formData.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo}
                        alt={`사진 ${index + 1}`}
                        className="w-full h-24 object-cover rounded-xl border border-amber-200"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-1 right-1 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t border-amber-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-amber-300 text-amber-700 rounded-xl hover:bg-amber-50 transition-all duration-200 font-medium"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl font-medium"
            >
              {gratitude ? '수정' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default GratitudeForm