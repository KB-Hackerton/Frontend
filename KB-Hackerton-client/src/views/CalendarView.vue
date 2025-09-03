<script setup>
import { ref, reactive, onMounted, nextTick, watch, computed } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import ToggleSwitch from '@/components/toggle/ToggleSwitch.vue'
import { Icon } from '@iconify/vue'
import DropdownFilter from '@/components/calendar/DropdownFilter.vue'
import AnnouncementCard from '@/components/calendar/AnnouncementCard.vue'
import announce from '@/_dummy/announce.json'
import festival from '@/_dummy/festival.json'
import FestivalCard from '@/components/calendar/FestivalCard.vue'

const calendarRef = ref(null)
const currentTitle = ref('')
const filter = ref('전체')

const detailView = ref(false)

const clickDate = ref(null)

const isFavorite = ref(false)

const announceList = ref(announce)
const festivalList = ref(festival)

const clickDateAnnounceList = ref([])
const clickDateFestivalList = ref([])

// 종료일 포함 여부: true면 종료 ‘당일 포함’, false면 종료 ‘당일부터 gray’
const END_INCLUSIVE = true

// Helper: Format Date object to YYYY-MM-DD
const fmtISO = (d) => {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const checkAnnounceEnd = (event) => {
  // open-ended(무기한) → 항상 진행 중
  if (event.extendedProps?.openEnded) return false
  if (!event.end) return false

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const endDateRaw = new Date(event.end)
  const endDate = new Date(endDateRaw)

  if (!END_INCLUSIVE) {
    // 종료일 당일부터 gray: 판정 시 +1 해서 배타로 변환
    endDate.setDate(endDate.getDate() + 1)
  }

  endDate.setHours(0, 0, 0, 0)
  return today >= endDate
}
const displayFestivalList = computed(() => {
  return clickDateFestivalList.value
})
const displayedAnnounceList = computed(() => {
  if (isFavorite.value) {
    if (filter.value !== '전체') {
      return clickDateAnnounceList.value.filter((item) => {
        return item.is_favorite && item.lcategory.replace('#', '') === filter.value
      })
    }
    return clickDateAnnounceList.value.filter((item) => {
      return item.is_favorite
    })
  } else if (filter.value !== '전체') {
    return clickDateAnnounceList.value.filter((item) => {
      return item.lcategory.replace('#', '') === filter.value
    })
  }
  return clickDateAnnounceList.value
})

const calendarFestivalList = computed(() => {
  return festivalList.value
})

const calendarAnnounceList = computed(() => {
  if (isFavorite.value) {
    if (filter.value !== '전체') {
      return announceList.value.filter((item) => {
        return item.is_favorite && item.lcategory.replace('#', '') === filter.value
      })
    }
    return announceList.value.filter((item) => {
      return item.is_favorite
    })
  } else if (filter.value !== '전체') {
    return announceList.value.filter((item) => {
      return item.lcategory.replace('#', '') === filter.value
    })
  }
  return announceList.value
})
function getRandomColorById(id) {
  const colors = [
    'bg-pastel-lavender',
    'bg-pastel-lilac',
    'bg-pastel-babyblue',
    'bg-pastel-sky',
    'bg-pastel-mint',
    'bg-pastel-lightgreen',
    'bg-pastel-babypink',
    'bg-pastel-rose',
    'bg-pastel-salmon',
    'bg-pastel-peach',
  ]
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

function addDaysISO(isoDate, days = 1) {
  const d = new Date(isoDate)
  d.setDate(d.getDate() + days)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const calendarOptions = reactive({
  headerToolbar: false,
  plugins: [dayGridPlugin, interactionPlugin],
  height: '100%',
  expandRows: true,
  navLinks: false, // prevent day numbers from becoming <a> links

  initialView: 'dayGridMonth',
  locale: 'ko',
  fixedWeekCount: false, // render 4~6 weeks dynamically (no extra trailing weeks)
  showNonCurrentDates: true, // show prev/next month dates (they'll appear in gray via CSS)
  dayHeaderFormat: { weekday: 'short' },
  dayHeaderContent: (arg) => {
    const viewType = arg.view?.type
    if (viewType === 'dayGridWeek') {
      const d = arg.date
      const day = d.getDay()
      const weekday = ['일', '월', '화', '수', '목', '금', '토'][day]
      const dateNum = d.getDate()
      const wkClass = day === 0 ? 'fc-kb-wk-sun' : day === 6 ? 'fc-kb-wk-sat' : 'fc-kb-wk-weekday'
      // YYYY-MM-DD 포맷으로 변환해서 선택일 비교
      const yyyy = d.getFullYear()
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      const dd = String(d.getDate()).padStart(2, '0')
      const iso = `${yyyy}-${mm}-${dd}`
      const selClass = clickDate.value && clickDate.value === iso ? ' fc-kb-date--selected' : ''
      return {
        html: `
          <div class="fc-kb-header">
            <div class="fc-kb-week ${wkClass}">${weekday}</div>
            <div class="fc-kb-date${selClass} ${wkClass}">${dateNum}</div>
          </div>
        `,
      }
    }
    // month view 등은 기본 텍스트 사용
    return { html: arg.text }
  },
  dayHeaderDidMount: (arg) => {
    // Only in week view; month view header has no specific date context
    const viewType = arg.view?.type
    if (viewType !== 'dayGridWeek') return

    const el = arg.el
    el.style.cursor = 'pointer'
    el.addEventListener('click', () => {
      const d = arg.date
      const yyyy = d.getFullYear()
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      const dd = String(d.getDate()).padStart(2, '0')
      const iso = `${yyyy}-${mm}-${dd}`

      // Update selected date
      clickDate.value = iso

      // Recompute list for the selected date (week view)
      const compact = iso.replaceAll('-', '')
      clickDateAnnounceList.value = announceList.value.filter((item) => {
        return (
          (item.reqst_start_date <= compact && item.reqst_end_date >= compact) ||
          (item.reqst_start_date <= compact && item.reqst_end_date === '')
        )
      })

      clickDateFestivalList.value = festivalList.value.filter((item) => {
        return item.event_startdate <= compact && item.event_enddate >= compact
      })

      // Move the calendar focus to this date (keeps week view, shifts the range if needed)
      const api = calendarRef.value?.getApi()
      api?.gotoDate(d)
      // Title will be updated by the datesSet listener
    })
  },
  dayCellContent: (arg) => {
    const viewType = arg.view?.type
    if (viewType === 'dayGridWeek') return ''
    const { date } = arg
    return { html: String(date.getDate()) }
  },

  dayCellClassNames: (arg) => {
    const viewType = arg.view?.type
    // 월간 뷰에서 다른 달 셀은 하이라이트 제외
    if (viewType !== 'dayGridWeek' && arg.isOther) return []

    const d = arg.date
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    const iso = `${yyyy}-${mm}-${dd}`

    return clickDate.value && clickDate.value === iso ? ['fc-kb-cell-selected'] : []
  },
  events: (fetchInfo, success) => {
    const rangeEndISO = fmtISO(fetchInfo.end)
    if (filter.value === '축제') {
      const festivalList = calendarFestivalList.value.map((a) => {
        const startISO = a.event_startdate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
        const hasEnd = !!a.event_enddate
        const rawEndISO = hasEnd
          ? a.event_enddate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
          : null
        const endISO = hasEnd ? (END_INCLUSIVE ? addDaysISO(rawEndISO, 1) : rawEndISO) : null // open-ended → single-day only

        return {
          id: a.festival_id,
          title: a.festival_title,
          start: startISO,
          end: endISO,
          allDay: true,
          extendedProps: {
            openEnded: !hasEnd,
          },
        }
      })
      success(filter.value === '축제' ? festivalList : list)
    }
    const list = calendarAnnounceList.value.map((a) => {
      const startISO = a.reqst_start_date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
      const hasEnd = !!a.reqst_end_date
      const rawEndISO = hasEnd
        ? a.reqst_end_date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
        : null
      const endISO = hasEnd ? (END_INCLUSIVE ? addDaysISO(rawEndISO, 1) : rawEndISO) : rangeEndISO // open-ended → stretch to view end

      return {
        id: a.announce_id,
        title: a.announce_title,
        start: startISO,
        end: endISO,
        allDay: true,
        extendedProps: {
          is_favorite: !!a.is_favorite,
          openEnded: !hasEnd,
        },
      }
    })
    success(filter.value === '축제' ? festivalList : list)
  },
  dateClick: (arg) => {
    clickDate.value = arg.dateStr

    const formatDate = clickDate.value.replaceAll('-', '')

    clickDateAnnounceList.value = announceList.value.filter((item) => {
      return (
        (item.reqst_start_date <= formatDate && item.reqst_end_date >= formatDate) ||
        (item.reqst_start_date <= formatDate && item.reqst_end_date === '')
      )
    })

    clickDateFestivalList.value = festivalList.value.filter((item) => {
      const start = item.event_startdate
      const end = item.event_enddate

      return start <= formatDate && formatDate <= end
    })

    detailView.value = true
    const api = calendarRef.value?.getApi()
    if (api) {
      api.changeView('dayGridWeek', arg.date)
      // (title will be updated by datesSet listener)
    }
  },
})

onMounted(() => {
  const api = calendarRef.value?.getApi()
  if (api) {
    currentTitle.value = api.view.title
    api.on('datesSet', (arg) => {
      if (detailView.value && clickDate.value) {
        const d = new Date(clickDate.value)
        const yy = String(d.getFullYear()).slice(2)
        const mm = d.getMonth() + 1
        currentTitle.value = `${yy}년 ${mm}월`
      } else {
        currentTitle.value = arg.view.title
      }
    })
  }
  // After mount, make sure size is computed once the flex layout settles
  requestAnimationFrame(() => {
    const api2 = calendarRef.value?.getApi()
    api2?.updateSize()
  })
})
// Ensure FullCalendar recalculates size when toggling detailView
watch(detailView, async () => {
  await nextTick()
  const api = calendarRef.value?.getApi()
  api?.updateSize()
})

// Refetch calendar events when filters change
watch([calendarAnnounceList, isFavorite, filter], () => {
  const api = calendarRef.value?.getApi()
  api?.refetchEvents()
})
function goPrev() {
  const api = calendarRef.value?.getApi()
  if (api) {
    api.prev()
    currentTitle.value = api.view.title
  }
}
function goNext() {
  const api = calendarRef.value?.getApi()
  if (api) {
    api.next()
    currentTitle.value = api.view.title
  }
}
function showMonth() {
  const api = calendarRef.value?.getApi()
  clickDate.value = null
  detailView.value = false
  if (api) {
    api.changeView('dayGridMonth', clickDate.value || undefined)
  }
}
</script>
<template>
  <div class="flex flex-col w-full flex-1 h-full">
    <div class="flex items-center justify-between py-2">
      <div>
        <div class="fc-custom-title bold text-18">
          {{ currentTitle }}
        </div>
        <ToggleSwitch :label="'즐겨찾기'" @click="isFavorite = !isFavorite" />
      </div>
      <button
        v-if="detailView"
        @click="showMonth"
        class="text-12 semibord bg-main rounded-[5px] px-2 py-1 mt-5 text-white"
      >
        달력보기
      </button>
    </div>

    <div class="flex justify-between">
      <DropdownFilter v-model:filter="filter" />
      <div class="flex items-center gap-1">
        <button type="button" class="fc-custom-prev bg-gray-100 rounded-[5px]" @click="goPrev">
          <Icon icon="material-symbols:arrow-back-2-rounded" class="size-6" />
        </button>
        <div>
          <p class="text-16">|</p>
        </div>
        <button type="button" class="fc-custom-next bg-gray-100 rounded-[5px]" @click="goNext">
          <Icon icon="material-symbols:arrow-back-2-rounded" class="size-6 rotate-180" />
        </button>
      </div>
    </div>

    <div class="flex flex-col flex-1 min-h-0">
      <div
        :class="
          detailView
            ? 'flex-none min-h-0 overflow-hidden relative h-[15rem] md:h-[360px] lg:h-[420px]'
            : 'flex-1 min-h-0 overflow-hidden relative'
        "
      >
        <FullCalendar ref="calendarRef" :options="calendarOptions" class="h-full">
          <template #eventContent="{ event }">
            <div
              class="flex items-center rounded-md px-2 py-1 w-full"
              :class="checkAnnounceEnd(event) ? 'bg-gray-200' : getRandomColorById(event.id)"
            >
              <Icon
                v-if="filter !== '축제'"
                icon="material-symbols:kid-star"
                :class="event.extendedProps.is_favorite ? 'text-yellow mr-1' : 'text-gray-300 mr-1'"
                class="size-4"
              />
              <span class="font-semibold text-12 text-center flex-1 truncate text-black">{{
                event.title
              }}</span>
            </div>
          </template>
        </FullCalendar>
      </div>

      <div
        v-if="detailView && filter !== '축제'"
        class="w-full flex-1 min-h-0 overflow-y-auto relative z-10 bg-white [&::-webkit-scrollbar]:hidden"
      >
        <AnnouncementCard
          v-for="a in displayedAnnounceList"
          :announcement="a"
          :key="a.announce_id"
        />
      </div>

      <div
        v-if="detailView && filter === '축제'"
        class="w-full flex-1 min-h-0 overflow-y-auto relative z-10 bg-white [&::-webkit-scrollbar]:hidden"
      >
        <FestivalCard
          v-for="festival in displayFestivalList"
          :festival="festival"
          :key="festival.festival_id"
        />
      </div>
    </div>
  </div>
</template>
<style>
/* =========================
   FullCalendar – Base
   ========================= */
.fc {
  --fc-border-color: #e5e7eb;
  font-size: 14px;
}
.fc-col-header-cell {
  font-size: 12px;
}
.fc-daygrid-day-number {
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
.fc-event-title,
.fc-ribbon__text {
  background: transparent;
  color: red;
  font-size: 11px;
  line-height: 20px;
}

/* =========================
   Grid Borders (single source of truth)
   ========================= */
/* Remove all borders for a clean look */
.fc-theme-standard td,
.fc-theme-standard th,
.fc .fc-scrollgrid,
.fc .fc-scrollgrid thead,
.fc .fc-scrollgrid tbody,
.fc .fc-scrollgrid table,
.fc .fc-scrollgrid td,
.fc .fc-scrollgrid th {
  border: 0 !important;
}

/* =========================
   Month view aesthetics
   ========================= */
/* Dim days from other months */
.fc-daygrid-day.fc-day-other .fc-daygrid-day-number,
.fc-daygrid-day.fc-day-other a.fc-daygrid-day-number {
  color: #5f5f5f !important;
  font-weight: 400;
}

/* Weekend colors (current month cells only) – works for <div> and <a> */
.fc-daygrid-day:not(.fc-day-other).fc-day-sun .fc-daygrid-day-number,
.fc-daygrid-day:not(.fc-day-other).fc-day-sun a.fc-daygrid-day-number {
  color: red !important;
  text-decoration: none;
}
.fc-daygrid-day:not(.fc-day-other).fc-day-sat .fc-daygrid-day-number,
.fc-daygrid-day:not(.fc-day-other).fc-day-sat a.fc-daygrid-day-number {
  color: blue !important;
  text-decoration: none;
}

/* Month view: color weekend weekday headers (일/토) */
.fc-daygrid .fc-col-header .fc-day-sun .fc-col-header-cell-cushion {
  color: red !important;
}
.fc-daygrid .fc-col-header .fc-day-sat .fc-col-header-cell-cushion {
  color: blue !important;
}

/* =========================
   Week view header (custom weekday + date badge)
   ========================= */
.fc-kb-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 6px 0 10px;
}
.fc-kb-week {
  font-size: 12px;
  line-height: 1;
  font-weight: 600;
}
.fc-kb-wk-sun {
  color: red;
}
.fc-kb-wk-sat {
  color: blue;
}
.fc-kb-wk-weekday {
  color: #111827;
}

/* Date badge */
.fc-kb-date {
  font-size: 12px;
  font-weight: 300;
  line-height: 1;
  padding: 8px 10px;
  border-radius: 12px;
  color: #111827;
}
.fc .fc-day-today .fc-kb-date {
  background: #c7d2fe;
}
/* Weekend color inside badge */
.fc-kb-date.fc-kb-wk-sun {
  color: red;
  font-weight: 300;
}
.fc-kb-date.fc-kb-wk-sat {
  color: blue;
  font-weight: 300;
}
/* Selected badge */
.fc-kb-date--selected {
  background: #93c5fd;
  color: #0f172a;
  font-weight: 300;
}
/* Selected cell subtle background */
.fc-kb-cell-selected {
  background: #f1f5f9;
}

/* =========================
   Layout normalization (reduce vertical shifts)
   ========================= */
.fc-dayGridMonth-view .fc-col-header-cell-cushion,
.fc-dayGridWeek-view .fc-col-header-cell-cushion {
  padding: 6px 0 10px !important;
}
.fc-dayGridWeek-view .fc-kb-header {
  padding: 6px 0 10px !important;
}
.fc .fc-col-header {
  min-height: 42px;
}

.fc .fc-event,
.fc .fc-event .fc-event-main {
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
}
</style>
