<script setup>
import { useRoute } from 'vue-router'

import { computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useFestivalStore } from '@/stores/festival'
import { storeToRefs } from 'pinia'
import BaseImg from '@/assets/images/banner.png'

const formatDate = (raw) => {
  if (!raw) return ''
  const str = String(raw)
  if (str.length !== 8) return str
  return `${str.slice(0, 4)}.${str.slice(4, 6)}.${str.slice(6, 8)}`
}

const kakaoKey = import.meta.env.VITE_KAKAO_MAP_KEY

const route = useRoute()
const festivalStore = useFestivalStore()

const { festivalDetail } = storeToRefs(festivalStore)
const festivalImgUrl = computed(() => festivalDetail.value.first_image || BaseImg)

const decodeEntities = (s) => {
  const doc = new DOMParser().parseFromString(s ?? '', 'text/html')
  return doc.documentElement.textContent ?? ''
}
const overviewText = computed(() => decodeEntities(festivalDetail.value.overview))

onMounted(async () => {
  const id = route.params.festival_id
  await festivalStore.getFestivalDetail(id)
  console.log(`festivalDetail:`, festivalDetail)
})

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

  const center = new kakao.maps.LatLng(
    Number(festivalDetail.value.map_y),
    Number(festivalDetail.value.map_x),
  )

  map = new kakao.maps.Map(container, {
    center,
    level: 4,
  })

  new kakao.maps.Marker({ position: center, map })
}
</script>

<template>
  <div class="flex flex-col items-center -mx-[1rem] -mt-4 min-h-screen">
    <div class="bg-orange-300 w-full flex flex-col gap-1 pt-8 pb-16 px-[1rem]">
      <div class="border-b border-white w-fit px-1 flex items-center gap-2">
        <Icon icon="hugeicons:fireworks" class="size-10 text-white" />
        <h1 class="text-26 bold text-white">{{ festivalDetail.festival_title }}</h1>
      </div>
    </div>

    <div class="w-full flex flex-col gap-1 py-10 px-[1rem] mt-[-5rem]">
      <img :src="festivalImgUrl" />

      <div
        class="w-full flex flex-col gap-1 py-5 px-[1rem] bg-white rounded-[0.7rem] shadow-custom mt-5"
      >
        <div class="flex items-center gap-1 border-b-2 border-orange-200 pb-1">
          <Icon icon="fluent:document-text-32-regular" class="size-4 text-orange-200" />
          <h2 class="text-18 bold">설명</h2>
        </div>
        <p class="text-14 mt-3 px-3 medium leading-7">{{ overviewText }}</p>
      </div>

      <div
        class="w-full flex flex-col gap-1 py-5 px-[1rem] bg-white rounded-[0.7rem] shadow-custom mt-5"
      >
        <div class="flex items-center gap-1 border-b-2 border-orange-200 pb-1">
          <Icon icon="hugeicons:fireworks" class="size-6 text-orange-200" />
          <h2 class="text-18 bold">축제 정보</h2>
        </div>
        <ul class="list-disc list-outside pl-4">
          <li class="marker:text-orange-200 marker:text-18 text-14 medium mx-2">
            {{ `축제명: ${festivalDetail.festival_title}` }}
          </li>
        </ul>

        <div class="flex items-center gap-1 mt-2">
          <Icon icon="uil:calendar" class="size-5 text-orange-200" />
          <p class="text-14 medium">
            {{
              `기간: ${formatDate(festivalDetail.event_startdate)} ~ ${formatDate(festivalDetail.event_enddate)}`
            }}
          </p>
        </div>
        <p class="text-12 medium ml-6 text-gray-300">{{ `장소: ${festivalDetail.addr}` }}</p>
      </div>

      <div
        class="w-full flex flex-col gap-1 py-5 px-[1rem] bg-white rounded-[0.7rem] shadow-custom mt-5"
      >
        <div class="flex items-center gap-1 border-b-2 border-orange-200 pb-1">
          <Icon icon="bx:map" class="size-6 text-orange-200" />
          <h2 class="text-18 bold">위치 정보</h2>
        </div>
        <div class="mt-3">
          <div id="map" class="h-[360px] w-full"></div>
        </div>
      </div>

      <div
        class="w-full flex flex-col gap-1 py-5 px-[1rem] bg-white rounded-[0.7rem] shadow-custom mt-5"
      >
        <div class="flex items-center gap-1 border-b-2 border-orange-200 pb-1">
          <Icon icon="tdesign:call" class="size-6 text-orange-200" />
          <h2 class="text-18 bold">문의처</h2>
        </div>
        <ul class="list-disc list-outside pl-4">
          <li class="marker:text-orange-200 marker:text-18 text-14 medium mx-2">
            {{ `${festivalDetail.tel_name}` }}
          </li>
        </ul>

        <div class="flex items-center gap-1 mt-2">
          <Icon icon="tdesign:call" class="size-4 text-orange-200" />
          <p class="text-14 medium">{{ `${festivalDetail.tel}` }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
<!-- <div class="mt-4 -mx-4">
      <div id="map" class="relative left-1/2 -translate-x-1/2 w-[100vw] h-[360px]"></div>
    </div> -->
