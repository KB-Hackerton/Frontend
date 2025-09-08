let isLoaded = false

export function loadKakaoPostcode() {
  return new Promise((resolve, reject) => {
    if (isLoaded) {
      resolve(window.daum.Postcode)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
    script.onload = () => {
      isLoaded = true
      resolve(window.daum.Postcode)
    }
    script.onerror = () => reject(new Error('카카오 주소검색 스크립트 로드 실패'))

    document.head.appendChild(script)
  })
}
