<script setup>
import { Icon } from '@iconify/vue'
import { computed, defineProps } from 'vue'
const props = defineProps({
  announcement: {
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
  const s = toYmdNumFromRaw(props.announcement.reqst_start_date)
  const e = toYmdNumFromRaw(props.announcement.reqst_end_date)

  if (t < s) return '진행전'
  else if (t > e) return '마감'
  else if (t >= s && t <= e) {
    if (e - t < 5) {
      return '마감임박'
    }
    return '진행중'
  }
  return '예산소진시 마감'
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
        <div>{{ props.announcement.announce_title }}</div>
        <div>{{ props.announcement.exc_InsttNm }}</div>
        <div>
          {{
            `${props.announcement.reqst_start_date} ~ ${props.announcement.reqst_end_date ? props.announcement.reqst_end_date : '예산소진시 까지'}`
          }}
        </div>
      </div>
      <div class="flex flex-col gap-2 items-end justify-between">
        <Icon
          icon="material-symbols:kid-star"
          class="size-5"
          :class="props.announcement.is_favorite ? 'text-green' : 'text-gray-300'"
        />
        <p
          class="semibold text-14"
          :class="
            announcementStatus === '마감임박'
              ? 'text-red'
              : announcementStatus === '마감'
                ? 'text-gray-300'
                : ''
          "
        >
          {{ announcementStatus }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
