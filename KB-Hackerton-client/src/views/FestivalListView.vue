<script setup>
import { computed, onMounted, ref } from 'vue'
import FestivalCard from '@/components/calendar/FestivalCard.vue'
import SearchBarNoneButton from '@/components/input/SearchBarNoneButton.vue'
import TagSelector from '@/components/common/TagSelector.vue'
import { useFestivalStore } from '@/stores/festival'
import { storeToRefs } from 'pinia'
import ErrorModal from '@/components/error/ErrorModal.vue'

const festivalStore = useFestivalStore()
const { festivalList } = storeToRefs(festivalStore)
const filter = ref('전체')
const searched = ref('')

const errorModal = ref(false)
const errorMsg = ref('')

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
  const src = Array.isArray(festivalList.value) ? festivalList.value : []

  // 1) 상태/카테고리 1차 필터
  let base = []
  if (filter.value === '마감') {
    base = src.filter((a) => a.event_enddate < t) // 마감
  } else if (filter.value === '진행중') {
    base = src.filter((a) => a.event_startdate <= t && t <= a.event_enddate) // 진행중
  } else if (filter.value === '진행전') {
    base = src.filter((a) => a.event_startdate > t) // 진행전
  } else if (filter.value === '올해') {
    base = src.filter((a) => String(a.event_enddate).slice(0, 4) === String(t).slice(0, 4)) // 올해
  } else {
    base = src.filter((a) => a.event_enddate >= t)
  }

  // 2) 검색어 2차 필터 (널-세이프 + 소문자 비교)
  const q = (searched.value || '').trim().toLowerCase() //버튼 없이 작동
  if (!q) return base

  return base.filter((item) =>
    SEARCH_FIELDS.some((k) => ((item?.[k] ?? '') + '').toLowerCase().includes(q)),
  )
})

onMounted(async () => {
  await festivalStore.getFestivalList()
  if (festivalStore.error) {
    errorMsg.value = '축제 목록을 불러오는데 실패했습니다.'
    errorModal.value = true
  }
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

    <div
      v-if="errorModal"
      class="fixed inset-0 bg-black/55 z-[90]"
      @click="errorModal = false"
    ></div>

    <ErrorModal
      v-if="errorModal"
      @close="errorModal = false"
      :title="errorMsg"
      class="z-[100] fixed top-1/3 left-1/2 -translate-x-1/2"
    />
  </div>
</template>

<style scoped></style>
