<script setup>
import { onMounted, watch, h } from 'vue'
import { render } from 'vue'
import { Icon } from '@iconify/vue'
import { loadKakaoMapSdk } from '@/utils/KakaoMapLoader.js'

const props = defineProps({
  items: { type: Array, default: () => [] },
  selected: { type: Object, default: null },
})

const emit = defineEmits(['select'])

let map
let overlays = []

const iconMap = {
  stock: 'solar:box-linear',
  labor: 'fluent:person-16-regular',
  equipment: 'tabler:hammer',
  etc: 'famicons:help',
}

function getUrgencyColor(expiresAt) {
  if (!expiresAt) return '#16a34a'
  const now = new Date()
  const end = new Date(expiresAt)
  const diffMin = (end.getTime() - now.getTime()) / (1000 * 60)

  return diffMin <= 5 ? '#dc2626' : '#16a34a'
}

async function initMap() {
  const kakao = await loadKakaoMapSdk()
  const container = document.getElementById('map')
  const options = {
    center: new kakao.maps.LatLng(36.568354, 128.729357), // 안동시청
    level: 5,
  }
  map = new kakao.maps.Map(container, options)

  renderMarkers(props.items)
}

function renderMarkers(items) {
  overlays.forEach((o) => o.setMap(null))
  overlays = []

  const geocoder = new kakao.maps.services.Geocoder()

  items.forEach((sos) => {
    const addr = sos.business?.business_addr
    if (!addr) return

    geocoder.addressSearch(addr, (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const coords = new kakao.maps.LatLng(result[0].y, result[0].x)

        const urgencyColor = getUrgencyColor(sos.expires_at)

        // 마커 + 상호명 DOM
        const markerContent = document.createElement('div')
        markerContent.style.display = 'flex'
        markerContent.style.flexDirection = 'column'
        markerContent.style.alignItems = 'center'
        markerContent.style.gap = '4px'

        // 동그라미 컨테이너
        const circle = document.createElement('div')
        circle.style.background = 'white'
        circle.style.border = `2px solid ${urgencyColor}`
        circle.style.borderRadius = '50%'
        circle.style.width = '40px'
        circle.style.height = '40px'
        circle.style.display = 'flex'
        circle.style.alignItems = 'center'
        circle.style.justifyContent = 'center'
        circle.style.fontSize = '20px'
        circle.style.color = 'black'
        circle.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)'

        // Vue Iconify Icon 렌더링
        const iconVNode = h(Icon, { icon: iconMap[sos.sos_type] || 'famicons:help' })
        render(iconVNode, circle)

        // 상호명
        const label = document.createElement('div')
        label.style.fontSize = '12px'
        label.style.fontWeight = 'bold'
        label.style.padding = '2px 6px'
        label.style.whiteSpace = 'nowrap'
        label.textContent = sos.business?.business_nm

        markerContent.appendChild(circle)
        markerContent.appendChild(label)

        const overlay = new kakao.maps.CustomOverlay({
          position: coords,
          content: markerContent,
          yAnchor: 1.3,
        })

        overlay.setMap(map)
        overlays.push(overlay)

        markerContent.addEventListener('click', () => emit('select', sos))

        if (props.selected?.sos_id === sos.sos_id) {
          map.setLevel(3)
          map.panTo(coords)
          console.log('마커 클릭:', sos)
        }
      } else {
        console.error('주소 변환 실패:', status)
      }
    })
  })
}

onMounted(() => {
  initMap()
})

watch(
  () => props.items,
  (newItems) => {
    if (map) renderMarkers(newItems)
  },
  { deep: true },
)

watch(
  () => props.selected,
  (newSelected) => {
    if (map && newSelected) renderMarkers(props.items)
  },
  { deep: true },
)
</script>

<template>
  <div id="map" class="w-full h-[400px]"></div>
</template>
