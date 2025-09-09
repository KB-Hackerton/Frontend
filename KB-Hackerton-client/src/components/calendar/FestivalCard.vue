<script setup>
import { Icon } from '@iconify/vue'
import { computed, defineProps } from 'vue'
import { RouterLink } from 'vue-router'
import baseImg from '@/assets/images/banner.png'
const props = defineProps({
  festival: {
    type: Object,
    required: true,
  },
})

const formatDate = (raw) => {
  if (!raw) return ''
  const str = String(raw)
  if (str.length !== 8) return str
  return `${str.slice(0, 4)}.${str.slice(4, 6)}.${str.slice(6, 8)}`
}
const baseImgUrl = baseImg
const getTodayYmdNum = () => {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return Number(`${y}${m}${day}`)
}

const toYmdNumFromRaw = (raw) => {
  if (raw == null) return NaN
  const digits = String(raw).replace(/[^0-9]/g, '')
  if (digits.length !== 8) return NaN
  return Number(digits)
}

const festivalStatus = computed(() => {
  const t = getTodayYmdNum()
  const s = toYmdNumFromRaw(props.festival.event_startdate)
  const e = toYmdNumFromRaw(props.festival.event_enddate)

  if (t < s) return '진행전'
  else if (t >= s && t <= e) return '진행중'
  return '종료'
})
</script>

<template>
  <RouterLink
    :to="{ name: 'festivalDetail', params: { festival_id: props.festival.festival_id } }"
    custom
    v-slot="{ navigate }"
  >
    <div class="my-2 pt-4 rounded-xl bg-white border border-gray-200 shadow-custom w-full">
      <div class="w-full h-[9rem] overflow-hidden flex items-center">
        <img
          :src="[props.festival.first_image ? props.festival.first_image : baseImgUrl]"
          alt=""
          class="w-full h-full object-cover"
        />
      </div>

      <div class="px-3 pb-5 mt-3 w-full">
        <div class="flex flex-col gap-1 w-full">
          <div class="bold text-14">{{ props.festival.festival_title }}</div>
          <div class="flex items-center gap-1 min-w-0">
            <Icon icon="bx:map" class="size-5 text-main" />
            <p class="text-12 semibold truncate">{{ props.festival.addr }}</p>
          </div>

          <div class="flex items-center w-full">
            <div class="flex items-center gap-1 flex-1 min-w-0 whitespace-nowrap">
              <Icon icon="mingcute:time-line" class="size-5 text-main" />
              <p class="text-12 semibold truncate">
                {{
                  `${formatDate(props.festival.event_startdate)} ~ ${formatDate(props.festival.event_enddate)}`
                }}
              </p>
            </div>
            <div
              class="flex rounded-full px-2 whitespace-nowrap"
              :class="
                festivalStatus === '종료'
                  ? 'border border-[#6B6B6B] text-[#6B6B6B]'
                  : festivalStatus === '진행중'
                    ? 'border border-[#FF4F4F] text-[#FF4F4F]'
                    : 'border border-[#7BC89C] text-[#7BC89C]'
              "
            >
              <p class="semibold text-14 ml-auto whitespace-nowrap">
                {{ festivalStatus }}
              </p>
            </div>
          </div>
        </div>

        <button
          class="bg-main w-full rounded-[0.5rem] text-white py-[0.2rem] semibold mt-6 mb-2"
          @click="navigate"
        >
          자세히 보기
        </button>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped></style>
