<script setup>
import { useRoute } from 'vue-router'
import festival from '@/_dummy/festival'
import { computed, onMounted } from 'vue'

const kakaoKey = import.meta.env.VITE_KAKAO_MAP_KEY

const route = useRoute()
const festivalDetail = festival.find((f) => f.festival_id === Number(route.params.festival_id))
const festivalImgUrl = festivalDetail.first_image

const decodeEntities = (s) => {
  const doc = new DOMParser().parseFromString(s ?? '', 'text/html')
  return doc.documentElement.textContent ?? ''
}
const overviewText = computed(() => decodeEntities(festivalDetail.overview))

let map = null

onMounted(() => {
  if (!kakaoKey) {
    console.error(
      '[Kakao] Missing VITE_KAKAO_KEY in .env (Vite). Example: VITE_KAKAO_KEY=YOUR_JS_KEY',
    )
    return
  }
  // 이미 SDK가 로드된 경우
  if (window.kakao && window.kakao.maps) {
    window.kakao.maps.load(initMap)
    return
  }
  // 이전 실패 스크립트 제거
  const existing = document.getElementById('kakao-maps-sdk')
  if (existing) existing.remove()

  const script = document.createElement('script')
  script.id = 'kakao-maps-sdk'
  script.async = true
  script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(kakaoKey)}&autoload=false`
  script.onload = () => window.kakao.maps.load(initMap)
  script.onerror = (e) => {
    console.error('[Kakao] SDK load failed. Check domain & key.', {
      src: script.src,
      origin: window.location.origin,
      error: e,
    })
  }
  document.head.appendChild(script)
})

const initMap = () => {
  const container = document.getElementById('map')
  if (!container) return

  const center = new kakao.maps.LatLng(Number(festivalDetail.map_y), Number(festivalDetail.map_x))

  map = new kakao.maps.Map(container, {
    center,
    level: 4,
  })

  new kakao.maps.Marker({ position: center, map })
}
</script>

<template>
  <div class="flex flex-col items-center w-full">
    <h1 class="text-20 bold">{{ festivalDetail.festival_title }}</h1>
    <div class="-mx-4 mt-3">
      <img :src="festivalImgUrl" alt="" class="w-full h-auto" />
    </div>

    <p class="text-14 mt-3 px-3 medium leading-7">{{ overviewText }}</p>

    <div class="flex flex-col items-center mt-4">
      <h2 class="text-16 bold">행사 개요</h2>
      <div class="text-14 semibold mt-3">
        <li>{{ `행사명: ${festivalDetail.festival_title}` }}</li>
        <li>{{ `기간: ${festivalDetail.event_startdate} ~ ${festivalDetail.event_enddate}` }}</li>
        <li>{{ `전화번호: ${festivalDetail.tel}` }}</li>
      </div>
    </div>
    <div class="mt-4 -mx-4">
      <div id="map" class="relative left-1/2 -translate-x-1/2 w-[100vw] h-[360px]"></div>
    </div>

    <div class="flex flex-col items-center mt-7 mb-16">
      <h3 class="text-16 bold">문의처</h3>
      <li class="text-14 semibold">{{ `위치 : ${festivalDetail.telname}` }}</li>
      <li class="text-14 semibold">{{ `전화번호 : ${festivalDetail.tel}` }}</li>
    </div>
  </div>
</template>

<style scoped></style>
