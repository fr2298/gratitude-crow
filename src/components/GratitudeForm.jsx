import { useState } from 'react'
import { X, Camera, Plus, Trash2 } from 'lucide-react'

function GratitudeForm({ gratitude, onSave, onClose }) {
  const [formData, setFormData] = useState({
    date: gratitude?.date || new Date().toISOString().split('T')[0],
    content: gratitude?.content || '',
    name: gratitude?.name || '',
    nickname: gratitude?.nickname || '',
    anniversaries: gratitude?.anniversaries || [],
    memo: gratitude?.memo || '',
    photos: gratitude?.photos || []
  })

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
      anniversaries: [...prev.anniversaries, { type: '', date: '' }]
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {gratitude ? '은혜 수정하기' : '은혜 기록하기'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              은혜받은 날짜 *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              은혜 내용 *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              rows="3"
              placeholder="어떤 도움을 받으셨나요?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              은인 이름 *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="홍길동"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              은인 별칭
            </label>
            <input
              type="text"
              value={formData.nickname}
              onChange={(e) => setFormData(prev => ({ ...prev, nickname: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="선생님, 사장님 등"
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
                className="flex items-center gap-1 text-sm text-primary hover:text-secondary"
              >
                <Plus className="w-4 h-4" />
                기념일 추가
              </button>
            </div>
            <div className="space-y-2">
              {formData.anniversaries.map((anniversary, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={anniversary.type}
                    onChange={(e) => updateAnniversary(index, 'type', e.target.value)}
                    placeholder="생일"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="text"
                    value={anniversary.date}
                    onChange={(e) => updateAnniversary(index, 'date', e.target.value)}
                    placeholder="MM-DD"
                    pattern="\d{2}-\d{2}"
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => removeAnniversary(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {formData.anniversaries.length > 0 && (
                <p className="text-xs text-gray-500">날짜는 MM-DD 형식으로 입력 (예: 03-15)</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              은인 메모
            </label>
            <textarea
              value={formData.memo}
              onChange={(e) => setFormData(prev => ({ ...prev, memo: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              rows="2"
              placeholder="추가로 기억하고 싶은 내용"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              사진
            </label>
            <div className="space-y-2">
              <label className="flex items-center justify-center gap-2 w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors">
                <Camera className="w-5 h-5 text-gray-500" />
                <span className="text-gray-500">사진 선택</span>
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
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
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