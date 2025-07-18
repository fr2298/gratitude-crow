import { Calendar, Edit2, Trash2, Image, Gift } from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale/ko'

function GratitudeList({ gratitudes, onEdit, onDelete }) {
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
      {gratitudes.map(gratitude => (
        <div
          key={gratitude.id}
          className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
        >
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-800">{gratitude.name}</h3>
            <div className="flex gap-1">
              <button
                onClick={() => onEdit(gratitude)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <Edit2 className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => onDelete(gratitude.id)}
                className="p-1 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(gratitude.date), 'yyyy년 M월 d일', { locale: ko })}</span>
            </div>

            <div className="text-gray-700">
              <p className="line-clamp-2">{gratitude.content}</p>
            </div>

            {gratitude.memo && (
              <div className="text-gray-500 italic">
                <p className="line-clamp-1">{gratitude.memo}</p>
              </div>
            )}

            {gratitude.photos && gratitude.photos.length > 0 && (
              <div className="flex items-center gap-2 text-gray-600">
                <Image className="w-4 h-4" />
                <span>{gratitude.photos.length}장의 사진</span>
              </div>
            )}

            {gratitude.anniversaries && gratitude.anniversaries.length > 0 && (
              <div className="pt-2 border-t">
                <div className="space-y-1">
                  {gratitude.anniversaries.map((ann, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                      <span className="font-medium">{ann.type}</span>
                      <span>{ann.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default GratitudeList