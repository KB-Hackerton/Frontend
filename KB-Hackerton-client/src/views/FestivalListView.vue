<script setup>
import { computed, ref } from 'vue'
import FestivalCard from '@/components/calendar/FestivalCard.vue'
import festival from '@/_dummy/festival'
import SearchBarNoneButton from '@/components/input/SearchBarNoneButton.vue'
import TagSelector from '@/components/common/TagSelector.vue'

const filter = ref('전체')
const searched = ref('')

// 검색 대상 필드 (널-세이프 문자열 비교)
const SEARCH_FIELDS = ['festival_title', 'overview', 'add1', 'add2']

const getTodayYmdNum = () => {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return Number(`${y}${m}${day}`)
}

const displayFestivalList = computed(() => {
  const t = getTodayYmdNum()

  // 1) 상태/카테고리 1차 필터
  let base = []
  if (filter.value === '마감') {
    base = festival.filter((a) => a.event_enddate < t) // 마감
  } else if (filter.value === '진행중') {
    base = festival.filter((a) => a.event_startdate <= t && t <= a.event_enddate) // 진행중
  } else if (filter.value === '진행전') {
    base = festival.filter((a) => a.event_startdate > t) // 진행전
  } else if (filter.value === '올해') {
    base = festival.filter((a) => String(a.event_enddate).slice(0, 4) === String(t).slice(0, 4)) // 올해
  } else {
    base = festival.filter((a) => a.event_enddate >= t)
  }

  // 2) 검색어 2차 필터 (널-세이프 + 소문자 비교)
  const q = (searched.value || '').trim().toLowerCase() //버튼 없이 작동
  if (!q) return base

  return base.filter((item) =>
    SEARCH_FIELDS.some((k) => ((item?.[k] ?? '') + '').toLowerCase().includes(q)),
  )
})
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <div class="flex gap-2 w-full flex-col">
      <SearchBarNoneButton v-model:searched="searched" />
      <TagSelector
        class=""
        :filter="filter"
        :tags="[
          { value: '전체', label: '전체' },
          { value: '진행전', label: '진행전' },
          { value: '진행중', label: '진행중' },
          { value: '올해', label: '올해' },
          { value: '마감', label: '마감' },
        ]"
        @update:filter="filter = $event"
      />
    </div>

    <div class="flex flex-col gap-1 mt-3 overflow-scroll [&::-webkit-scrollbar]:hidden">
      <FestivalCard
        v-for="festival in displayFestivalList"
        :festival="festival"
        :key="festival.festival_id"
      />
    </div>
  </div>
</template>

<style scoped></style>
