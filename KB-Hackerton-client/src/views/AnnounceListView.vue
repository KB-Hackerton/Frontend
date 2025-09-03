<script setup>
import SearchBar from '@/components/announce/SearchBar.vue'
import AnnouncementCard from '@/components/calendar/AnnouncementCard.vue'
import DropdownFilter from '@/components/calendar/DropdownFilter.vue'
import announce from '@/_dummy/announce'
import { computed, ref } from 'vue'

const filter = ref('전체')
const searched = ref('')
const appliedQuery = ref('') // 버튼 클릭 시에만 적용되는 검색어

// 검색 대상 필드 (널-세이프 문자열 비교)
const SEARCH_FIELDS = ['announce_title', 'hashtags', 'author', 'exc_InsttNm', 'lcategory']

const getTodayYmdNum = () => {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return Number(`${y}${m}${day}`)
}

const displayAnnounceList = computed(() => {
  const t = getTodayYmdNum()

  // 1) 상태/카테고리 1차 필터
  let base = []
  if (filter.value === '마감') {
    base = announce.filter((a) => a.reqst_end_date < t) // 마감
  } else if (filter.value === '접수중') {
    base = announce.filter((a) => a.reqst_start_date <= t && t <= a.reqst_end_date) // 접수중
  } else if (filter.value === '접수에정') {
    base = announce.filter((a) => a.reqst_start_date > t) // 접수예정
  } else if (filter.value === '즐겨찾기') {
    base = announce.filter((a) => a.is_favorite) // 즐겨찾기
  } else {
    base = announce.filter((a) => a.reqst_end_date >= t)
  }

  // 2) 검색어 2차 필터 (널-세이프 + 소문자 비교)
  const q = (appliedQuery.value || '').trim().toLowerCase() //버튼 클릭시에만 적용되는 검색어
  // const q = (searched.value || '').trim().toLowerCase() //버튼 없이 작동
  if (!q) return base

  return base.filter((item) =>
    SEARCH_FIELDS.some((k) => ((item?.[k] ?? '') + '').toLowerCase().includes(q)),
  )
})
const searchedAnnounce = () => {
  appliedQuery.value = searched.value
}
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <div class="flex gap-2 w-full">
      <DropdownFilter
        class=""
        :filter="filter"
        :options="[
          { value: '전체', label: '전체' },
          { value: '즐겨찾기', label: '즐겨찾기' },
          { value: '접수에정', label: '접수예정' },
          { value: '접수중', label: '접수중' },
          { value: '마감', label: '마감' },
        ]"
        @update:filter="filter = $event"
      />
      <SearchBar @search="searchedAnnounce" v-model:searched="searched" />
      <!-- <SearchBar v-model:searched="searched" /> // 버튼없이 작동 -->
    </div>

    <div class="flex flex-col gap-1 mt-3 overflow-scroll [&::-webkit-scrollbar]:hidden">
      <AnnouncementCard
        v-for="announce in displayAnnounceList"
        :key="announce.announce_id"
        :announcement="announce"
      />
    </div>
  </div>
</template>

<style scoped></style>
