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
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">아직 기록된 은혜가 없습니다.</p>
        <p className="text-gray-400 text-sm mt-2">받은 은혜를 기록해보세요!</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Object.entries(groupedGratitudes).map(([key, group]) => (
        <div
          key={key}
          className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 relative"
        >
          {/* 은혜 개수 배지 */}
          <div className="absolute top-4 right-4 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
            {group.gratitudes.length}
          </div>

          {/* 은인 이름 / 별칭 */}
          <div className="mb-3">
            <h3 className="text-xl font-semibold text-gray-800">
              {group.name} {group.nickname && `/ ${group.nickname}`}
            </h3>
          </div>

          {/* 은인 기념일 */}
          {group.anniversaries.length > 0 && (
            <div className="mb-3 space-y-1">
              {group.anniversaries.map((ann, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
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
          <div className="space-y-2">
            {group.gratitudes.slice(0, 3).map((gratitude, index) => (
              <div key={gratitude.id} className="border-t pt-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <img src="/heart_icon.png" alt="heart" className="w-4 h-4" />
                    <span className="text-sm text-gray-700">
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
                    className="px-3 py-1 text-sm text-gray-600 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors"
                  >
                    수정하기
                  </button>
                  <button
                    onClick={() => onDelete(gratitude.id)}
                    className="px-3 py-1 text-sm text-gray-400 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    삭제하기
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 더 많은 은혜가 있을 경우 표시 */}
          {group.gratitudes.length > 3 && (
            <p className="text-xs text-gray-500 text-center mt-3">
              ... 외 {group.gratitudes.length - 3}개의 은혜
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

export default GratitudeList