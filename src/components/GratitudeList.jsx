import { Calendar, Edit2, Trash2, Gift } from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale/ko'
import { useMemo } from 'react'

function GratitudeList({ gratitudes, onEdit, onDelete }) {
  // 은인별로 그룹핑 (이름 + 별칭 기준)
  const groupedGratitudes = useMemo(() => {
    const groups = {}
    
    gratitudes.forEach(gratitude => {
      const key = `${gratitude.name}${gratitude.nickname ? `_${gratitude.nickname}` : ''}`
      if (!groups[key]) {
        groups[key] = {
          name: gratitude.name,
          nickname: gratitude.nickname,
          anniversaries: gratitude.anniversaries || [],
          gratitudes: []
        }
      }
      groups[key].gratitudes.push(gratitude)
      
      // 기념일 병합 (중복 제거)
      if (gratitude.anniversaries && gratitude.anniversaries.length > 0) {
        gratitude.anniversaries.forEach(ann => {
          const exists = groups[key].anniversaries.some(
            existing => existing.type === ann.type && existing.date === ann.date
          )
          if (!exists) {
            groups[key].anniversaries.push(ann)
          }
        })
      }
    })
    
    // 각 그룹의 은혜들을 최신순으로 정렬
    Object.values(groups).forEach(group => {
      group.gratitudes.sort((a, b) => new Date(b.date) - new Date(a.date))
    })
    
    return groups
  }, [gratitudes])

  if (gratitudes.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 text-center border border-amber-100">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full mb-4">
          <Gift className="w-10 h-10 text-amber-600" />
        </div>
        <p className="text-gray-700 text-xl font-medium">아직 기록된 은혜가 없습니다.</p>
        <p className="text-gray-500 mt-2">받은 은혜를 기록해보세요!</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Object.entries(groupedGratitudes).map(([key, group]) => (
        <div
          key={key}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 relative border border-amber-100 hover:border-amber-200 transform hover:-translate-y-1"
        >
          {/* 은혜 개수 배지 */}
          <div className="absolute -top-2 -right-2 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold shadow-lg">
            {group.gratitudes.length}
          </div>

          {/* 은인 이름 / 별칭 */}
          <div className="mb-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              {group.name} {group.nickname && `/ ${group.nickname}`}
            </h3>
          </div>

          {/* 은인 기념일 */}
          {group.anniversaries.length > 0 && (
            <div className="mb-4 space-y-2">
              {group.anniversaries.map((ann, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-600 bg-amber-50 px-3 py-1 rounded-lg">
                  <Calendar className="w-4 h-4 text-amber-500" />
                  <span className="font-medium">{ann.type}</span>
                  <span>
                    {ann.isRecurring !== false 
                      ? format(new Date(ann.date), 'M월 d일', { locale: ko })
                      : format(new Date(ann.date), 'yyyy년 M월 d일', { locale: ko })
                    }
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* 은혜 내용들 (최대 3개) */}
          <div className="space-y-3">
            {group.gratitudes.slice(0, 3).map((gratitude, index) => (
              <div key={gratitude.id} className="border-t border-amber-100 pt-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <img src="/heart_icon.png" alt="heart" className="w-5 h-5 drop-shadow-sm" />
                    <span className="text-sm text-gray-700 font-medium">
                      {gratitude.content.length > 10 
                        ? gratitude.content.substring(0, 10) + '...' 
                        : gratitude.content}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {format(new Date(gratitude.date), 'yyyy.MM.dd', { locale: ko })}
                  </span>
                </div>
                <div className="flex justify-end gap-2 mt-3">
                  <button
                    onClick={() => onEdit(gratitude)}
                    className="px-3 py-1.5 text-sm text-amber-700 bg-amber-100 hover:bg-amber-200 rounded-lg transition-all duration-200 font-medium hover:shadow-md"
                  >
                    수정하기
                  </button>
                  <button
                    onClick={() => onDelete(gratitude.id)}
                    className="px-3 py-1.5 text-sm text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200"
                  >
                    삭제하기
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 더 많은 은혜가 있을 경우 표시 */}
          {group.gratitudes.length > 3 && (
            <p className="text-sm text-amber-600 text-center mt-4 font-medium">
              + {group.gratitudes.length - 3}개의 은혜 더보기
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

export default GratitudeList