import { useState, useEffect } from 'react'
import { Bell, Calendar, X } from 'lucide-react'
import { format, differenceInDays } from 'date-fns'

function AnniversaryAlert({ gratitudes }) {
  const [upcomingAnniversaries, setUpcomingAnniversaries] = useState([])
  const [showAlert, setShowAlert] = useState(true)

  useEffect(() => {
    const today = new Date()
    const currentYear = today.getFullYear()
    const upcoming = []

    gratitudes.forEach(gratitude => {
      if (gratitude.anniversaries && gratitude.anniversaries.length > 0) {
        gratitude.anniversaries.forEach(anniversary => {
          if (anniversary.date && anniversary.type) {
            const [month, day] = anniversary.date.split('-').map(Number)
            if (month && day) {
              let anniversaryDate = new Date(currentYear, month - 1, day)
              
              // 이미 지났으면 내년으로
              if (anniversaryDate < today) {
                anniversaryDate = new Date(currentYear + 1, month - 1, day)
              }
              
              const daysUntil = differenceInDays(anniversaryDate, today)
              
              // 30일 이내의 기념일만
              if (daysUntil <= 30) {
                upcoming.push({
                  name: gratitude.name,
                  type: anniversary.type,
                  date: anniversaryDate,
                  daysUntil,
                  originalDate: anniversary.date
                })
              }
            }
          }
        })
      }
    })

    // 날짜순 정렬
    upcoming.sort((a, b) => a.daysUntil - b.daysUntil)
    setUpcomingAnniversaries(upcoming)
  }, [gratitudes])

  if (!showAlert || upcomingAnniversaries.length === 0) {
    return null
  }

  const getAlertColor = (daysUntil) => {
    if (daysUntil === 0) return 'bg-red-100 border-red-300 text-red-800'
    if (daysUntil <= 7) return 'bg-orange-100 border-orange-300 text-orange-800'
    return 'bg-blue-100 border-blue-300 text-blue-800'
  }

  const getDaysText = (daysUntil) => {
    if (daysUntil === 0) return '오늘!'
    if (daysUntil === 1) return '내일'
    return `${daysUntil}일 후`
  }

  return (
    <div className="mb-6 space-y-2">
      {upcomingAnniversaries.slice(0, 3).map((anniversary, index) => (
        <div
          key={`${anniversary.name}-${anniversary.type}-${index}`}
          className={`rounded-lg border p-4 flex items-center justify-between ${getAlertColor(anniversary.daysUntil)}`}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {anniversary.daysUntil === 0 ? (
                <Bell className="w-5 h-5 animate-pulse" />
              ) : (
                <Calendar className="w-5 h-5" />
              )}
              <span className="font-medium">
                {anniversary.name}님의 {anniversary.type}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold">{getDaysText(anniversary.daysUntil)}</span>
              <span className="opacity-75">
                ({anniversary.originalDate})
              </span>
            </div>
          </div>
          {index === 0 && (
            <button
              onClick={() => setShowAlert(false)}
              className="p-1 hover:bg-white hover:bg-opacity-50 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
      {upcomingAnniversaries.length > 3 && (
        <p className="text-sm text-gray-600 text-center">
          외 {upcomingAnniversaries.length - 3}개의 기념일이 다가오고 있습니다.
        </p>
      )}
    </div>
  )
}

export default AnniversaryAlert