<script setup>
import { onMounted, watch, h } from 'vue'
import { render } from 'vue'
import { Icon } from '@iconify/vue'
import { loadKakaoMapSdk } from '@/utils/KakaoMapLoader.js'

const props = defineProps({
  items: { type: Array, default: () => [] },
  selected: { type: Object, default: null },
  userAddress: { type: String, default: '' },
})
const emit = defineEmits(['select', 'update-distance'])

let map
let overlays = []
let userCoords = null // 내 사업장 좌표 저장

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
    center: new kakao.maps.LatLng(37.5665, 126.978), // 기본 서울 시청 좌표
    level: 7,
  }
  map = new kakao.maps.Map(container, options)

  if (props.userAddress) {
    const geocoder = new kakao.maps.services.Geocoder()
    geocoder.addressSearch(props.userAddress, (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        userCoords = new kakao.maps.LatLng(Number(result[0].y), Number(result[0].x))
        console.log('📍 사용자 좌표:', userCoords)
        map.setCenter(userCoords)
        renderMarkers(props.items)
      }
    })
  } else {
    renderMarkers(props.items)
  }
}

// 마커 찍기
function renderMarkers(items) {
  // 기존 마커 제거
  overlays.forEach((o) => o.setMap(null))
  overlays = []

  const geocoder = new window.kakao.maps.services.Geocoder()

  items.forEach((sos) => {
    if (!sos.business_addr) return

    geocoder.addressSearch(sos.business_addr, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const coords = new window.kakao.maps.LatLng(Number(result[0].y), Number(result[0].x))

        // 거리 계산
        let distance = null
        if (userCoords) {
          const line = new window.kakao.maps.Polyline({
            path: [userCoords, coords],
          })
          distance = Math.round(line.getLength()) // m 단위
          console.log(`📏 거리계산 | SOS ${sos.sos_id}: ${distance}m`)

          // 동일한 값일 경우 emit 안 함
          if (sos.distance !== distance) {
            emit('update-distance', { id: sos.sos_id, distance })
          }
        }

        // 2km 초과 시 표시 안 함
        if (distance !== null && distance > 2000) {
          console.log(`⛔ 표시 안 함 | SOS ${sos.sos_id}, distance=${distance}`)
          return
        }

        // 중복 마커 방지
        if (overlays.some((o) => o.sos_id === sos.sos_id)) {
          console.log(`⚠️ 중복 마커 스킵 | SOS ${sos.sos_id}`)
          return
        }

        const urgencyColor = getUrgencyColor(sos.expires_at)

        // Marker DOM
        const markerContent = document.createElement('div')
        markerContent.style.display = 'flex'
        markerContent.style.flexDirection = 'column'
        markerContent.style.alignItems = 'center'
        markerContent.style.gap = '4px'

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

        const iconVNode = h(Icon, { icon: iconMap[sos.sos_type] || 'famicons:help' })
        render(iconVNode, circle)

        const label = document.createElement('div')
        label.style.fontSize = '12px'
        label.style.fontWeight = 'bold'
        label.style.padding = '2px 6px'
        label.style.whiteSpace = 'nowrap'
        label.textContent = sos.business_name

        markerContent.appendChild(circle)
        markerContent.appendChild(label)

        const overlay = new window.kakao.maps.CustomOverlay({
          position: coords,
          content: markerContent,
          yAnchor: 1.3,
        })

        overlay.sos_id = sos.sos_id
        overlay.coords = coords
        overlay.setMap(map)
        overlays.push(overlay)

        markerContent.addEventListener('click', () => emit('select', sos))
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
) // 🔥 deep 제거 (distance 변경 시 중복 생성 방지)

watch(
  () => props.selected,
  (newSelected) => {
    if (map && newSelected) {
      const target = overlays.find((o) => o.sos_id === newSelected.sos_id)
      if (target) {
        map.setLevel(3)
        map.panTo(target.coords)
        console.log('🎯 선택된 SOS 이동:', newSelected.sos_id)
      }
    }
  },
)
</script>

<template>
  <div id="map" class="w-full h-[400px]"></div>
</template>
