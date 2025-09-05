let kakaoLoaded = false
let kakaoLoadingPromise = null

export function loadKakaoMapSdk() {
  if (kakaoLoaded) return Promise.resolve(window.kakao)

  if (!kakaoLoadingPromise) {
    kakaoLoadingPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${
        import.meta.env.VITE_KAKAO_MAP_KEY
      }&autoload=false&libraries=services`
      script.async = true
      script.onload = () => {
        window.kakao.maps.load(() => {
          kakaoLoaded = true
          resolve(window.kakao)
        })
      }
      script.onerror = reject
      document.head.appendChild(script)
    })
  }

  return kakaoLoadingPromise
}
