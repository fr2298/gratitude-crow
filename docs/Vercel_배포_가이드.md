# Vercel 배포 가이드 - 초보자를 위한 완벽 가이드

## 📌 Vercel이란?

Vercel은 프론트엔드 개발자를 위한 클라우드 플랫폼으로, 웹사이트를 인터넷에 쉽게 올릴 수 있게 해주는 서비스입니다.

**쉽게 설명하면:**
- 여러분이 만든 웹사이트를 인터넷에서 누구나 볼 수 있게 해주는 서비스
- GitHub에 코드를 올리면 자동으로 웹사이트로 만들어줌
- 무료로 시작할 수 있고, 사용하기 매우 쉬움

## 🎯 왜 Vercel을 사용하나요?

### 장점
1. **무료 시작**: 신용카드 없이 바로 시작 가능
2. **자동 배포**: GitHub에 코드 올리면 자동으로 사이트 업데이트
3. **빠른 속도**: 전 세계 어디서나 빠르게 접속 가능
4. **HTTPS 제공**: 보안 연결 자동 제공 (자물쇠 아이콘)
5. **커스텀 도메인**: 원하는 주소 사용 가능 (예: mysite.com)

### 무료 플랜 제한사항
- **대역폭**: 월 100GB (약 10만 명 방문 가능)
- **프로젝트 수**: 무제한
- **팀원**: 1명 (개인용)
- **상업적 사용**: 제한 (회사 서비스는 유료 필요)

## 🚀 Vercel 시작하기 (10분 소요)

### Step 1: Vercel 가입
1. https://vercel.com 접속
2. "Sign Up" 클릭
3. "Continue with GitHub" 선택 (GitHub 계정 필요)
4. GitHub 권한 허용

### Step 2: 프로젝트 준비
```bash
# 프로젝트가 GitHub에 없다면:
1. GitHub.com에서 새 저장소(Repository) 만들기
2. 로컬 프로젝트를 GitHub에 연결:
   git init
   git add .
   git commit -m "첫 커밋"
   git remote add origin https://github.com/내아이디/프로젝트명.git
   git push -u origin main
```

### Step 3: Vercel에 배포
1. Vercel 대시보드에서 "New Project" 클릭
2. GitHub 저장소 목록에서 프로젝트 선택
3. 설정은 기본값 그대로 두고 "Deploy" 클릭
4. 2-3분 기다리면 완료!

### Step 4: 배포 확인
```
배포 완료 후 제공되는 URL:
- https://프로젝트명.vercel.app
- https://프로젝트명-내아이디.vercel.app
- https://프로젝트명-git-main-내아이디.vercel.app
```

## 🔒 접근 제한 방법 (클로즈 배포)

### 방법 1: 간단한 비밀번호 (무료)
```javascript
// src/App.jsx 최상단에 추가
import { useState, useEffect } from 'react'

function App() {
  const [authenticated, setAuthenticated] = useState(false)
  
  useEffect(() => {
    const password = localStorage.getItem('app_password')
    if (password !== 'correct') {
      const input = prompt('비밀번호를 입력하세요:')
      if (input === '까치2024') {  // 원하는 비밀번호
        localStorage.setItem('app_password', 'correct')
        setAuthenticated(true)
      } else {
        alert('접근 권한이 없습니다')
        window.location.href = 'https://google.com'
      }
    } else {
      setAuthenticated(true)
    }
  }, [])
  
  if (!authenticated) return <div>Loading...</div>
  
  // 기존 앱 코드...
}
```

### 방법 2: 환경 변수로 URL 숨기기
1. Vercel 프로젝트 설정 > Environment Variables
2. `NEXT_PUBLIC_ACCESS_KEY` 추가
3. 코드에서 확인:
```javascript
if (window.location.search !== `?key=${process.env.NEXT_PUBLIC_ACCESS_KEY}`) {
  window.location.href = '/404'
}
```

### 방법 3: Vercel 인증 (Pro 플랜 - 월 $20)
- 프로젝트 설정에서 Password Protection 활성화
- 진짜 HTTP 인증 사용

## 📊 배포 후 관리

### 자동 업데이트
```bash
# 코드 수정 후
git add .
git commit -m "기능 추가"
git push

# Vercel이 자동으로 새 버전 배포!
```

### 배포 상태 확인
- Vercel 대시보드에서 실시간 확인
- 빌드 로그 확인 가능
- 이전 버전으로 롤백 가능

### 도메인 연결 (선택사항)
1. 프로젝트 설정 > Domains
2. "Add Domain" 클릭
3. 원하는 도메인 입력 (예: gratitude-crow.com)
4. DNS 설정 안내 따라하기

## 💡 유용한 팁

### 1. 환경별 배포
- `main` 브랜치: 실제 서비스 (production)
- `dev` 브랜치: 개발 버전
- Pull Request: 미리보기 URL 자동 생성

### 2. 성능 최적화
- 이미지 자동 최적화
- 전 세계 CDN 자동 적용
- 자동 압축

### 3. 분석 도구
- 방문자 수 확인
- 페이지별 통계
- 성능 모니터링

## ⚠️ 주의사항

1. **무료 플랜 한계**
   - 상업적 사용 시 유료 전환 필요
   - 대역폭 초과 시 사이트 중단 가능

2. **보안**
   - 환경 변수에 중요 정보 저장
   - 소스 코드에 비밀번호 하드코딩 금지

3. **백업**
   - GitHub이 백업 역할
   - 중요 데이터는 별도 백업

## 🆘 문제 해결

### 빌드 실패
```bash
# package.json 확인
"scripts": {
  "build": "vite build",  # 이 명령어가 있어야 함
}
```

### 404 에러
- 프로젝트 루트에 `vercel.json` 추가:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

### 느린 로딩
- 이미지 크기 최적화
- 불필요한 패키지 제거

## 📚 추가 자료

- [Vercel 공식 문서](https://vercel.com/docs)
- [Vercel 템플릿](https://vercel.com/templates)
- [커뮤니티 포럼](https://github.com/vercel/vercel/discussions)

---

이 가이드를 따라하시면 10분 안에 여러분의 웹사이트를 인터넷에 올릴 수 있습니다! 🎉