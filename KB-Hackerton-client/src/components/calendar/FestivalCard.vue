<script setup>
import { computed, defineProps } from 'vue'
const props = defineProps({
  festival: {
    type: Object,
    required: true,
  },
})
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

const announcementStatus = computed(() => {
  const t = getTodayYmdNum()
  const s = toYmdNumFromRaw(props.festival.event_startdate)
  const e = toYmdNumFromRaw(props.festival.event_enddate)

  if (t < s) return '진행전'
  else if (t >= s && t <= e) return '진행중'
  return '종료'
})
</script>

<template>
  <div
    class="my-2 p-2 rounded-xl"
    :class="announcementStatus === '마감' ? 'border border-gray-200 ' : 'border border-black '"
  >
    <div class="flex justify-between">
      <div
        class="flex flex-col gap-3 bold text-14"
        :class="announcementStatus === '마감' ? 'text-gray-300' : ''"
      >
        <div>{{ props.festival.festival_title }}</div>
        <div>{{ props.festival.telname }}</div>
        <div>
          {{
            `${props.festival.event_startdate} ${props.festival.event_enddate ? '~' + props.festival.event_enddate : ''}`
          }}
        </div>
      </div>
      <div class="flex flex-col gap-2 items-end justify-between">
        <p class="semibold text-14">
          {{ announcementStatus }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
