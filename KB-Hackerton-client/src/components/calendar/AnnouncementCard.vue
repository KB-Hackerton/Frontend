<script setup>
import { Icon } from '@iconify/vue'
import { computed, defineProps } from 'vue'
import { RouterLink } from 'vue-router'

const emit = defineEmits(['updated'])
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
  const s = toYmdNumFromRaw(props.announcement.start_date || props.announcement.pub_date)
  const e = toYmdNumFromRaw(props.announcement.end_date)

  if (t < s) return '접수예정'
  else if (t > e) return '마감'
  else if (t >= s && t <= e) {
    if (e - t < 5) {
      return '마감임박'
    }
    return '접수중'
  }
  return '접수중'
})

function parseDate(yyyymmdd) {
  const yyyy = yyyymmdd.slice(0, 4)
  const mm = yyyymmdd.slice(4, 6)
  const dd = yyyymmdd.slice(6, 8)
  return new Date(`${yyyy}-${mm}-${dd}`)
}

const Dday = computed(() => {
  if (!props.announcement.end_date) return ''

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const end = parseDate(props.announcement.end_date)
  end.setHours(0, 0, 0, 0)

  const dday = Math.ceil((end - today) / (1000 * 60 * 60 * 24))

  if (dday === 0) return 'D-day'

  if (dday > 0) return `${dday}일 남음`

  return '마감'
})
</script>

<template>
  <RouterLink
    :to="{ name: 'announceDetail', params: { announce_id: announcement.announce_id } }"
    custom
    v-slot="{ navigate }"
  >
    <div
      class="my-2 p-2 rounded-xl bg-white py-5 px-3 border border-[#FFE1D0] shadow-custom"
      @click="navigate"
    >
      <div class="flex justify-between">
        <div class="flex flex-col gap-4">
          <div class="bold text-14">
            {{ props.announcement.title }}
          </div>
          <div class="flex items-center gap-1">
            <Icon icon="bx:map" class="size-5 text-main" />
            <p class="semibold text-12">{{ props.announcement.exc_instt_nm }}</p>
          </div>
          <div class="flex items-center gap-1">
            <Icon icon="mingcute:time-line" class="size-5 text-main" />
            <p class="semibold text-12">
              {{
                `${props.announcement.start_date || props.announcement.pub_date} ~ ${props.announcement.end_date ? props.announcement.end_date : '예산소진시 까지'}`
              }}
            </p>
          </div>
          <div class="flex items-center gap-1 pl-1">
            <div class="w-[0.4rem] h-[0.4rem] bg-orange-100 rounded-full"></div>
            <p class="semibold text-12">
              {{ props.announcement.end_date ? Dday : '예산소진시 까지' }}
            </p>
          </div>
        </div>
        <div class="flex flex-col gap-2 items-end justify-between">
          <button
            class="flex items-center gap-1 border border-gray-[0.4rem] rounded-xl p-1"
            @click.stop="
              emit('updated', props.announcement.announce_id, props.announcement.favorite)
            "
          >
            <Icon
              icon="material-symbols:kid-star"
              class="size-5"
              :class="props.announcement.favorite ? 'text-[#FFD93D]' : 'text-gray-300'"
            />
          </button>
          <div
            class="w-[4.5rem] h-[2rem] text-10 semibold rounded-full flex items-center justify-center"
            :class="
              announcementStatus === '마감'
                ? 'bg-[#D9D9D9]'
                : announcementStatus === '접수예정'
                  ? 'bg-[#FFB3B3]'
                  : announcementStatus === '접수중'
                    ? 'bg-[#7BC89C]'
                    : 'bg-[#FF4F4F]'
            "
          >
            <p class="semibold text-14 whitespace-nowrap text-white">
              {{ announcementStatus }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped></style>
