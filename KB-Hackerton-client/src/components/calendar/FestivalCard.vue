<script setup>
import { computed, defineProps } from 'vue'
import { RouterLink } from 'vue-router'
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
  <RouterLink :to="{ name: 'festivalDetail', params: { festival_id: props.festival.festival_id } }">
    <div
      class="my-2 p-2 rounded-xl"
      :class="festivalStatus === '종료' ? 'border border-gray-200 ' : 'border border-black '"
    >
      <div class="flex justify-between">
        <div
          class="flex flex-col gap-3 bold text-14"
          :class="festivalStatus === '종료' ? 'text-gray-300' : ''"
        >
          <div>{{ props.festival.festival_title }}</div>
          <div>{{ props.festival.telname }}</div>
          <div>
            {{
              `${props.festival.event_startdate} ${props.festival.event_enddate != props.festival.event_startdate ? '~' + props.festival.event_enddate : ''}`
            }}
          </div>
        </div>
        <div class="flex flex-col gap-2 items-end justify-end">
          <p class="semibold text-14">
            {{ festivalStatus }}
          </p>
        </div>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped></style>
