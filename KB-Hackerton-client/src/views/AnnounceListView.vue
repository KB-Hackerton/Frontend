<script setup>
import AnnouncementCard from '@/components/calendar/AnnouncementCard.vue'

import { computed, onMounted, ref } from 'vue'
import SearchBarNoneButton from '@/components/input/SearchBarNoneButton.vue'
import TagSelector from '@/components/common/TagSelector.vue'
import { useAnnounceStore } from '@/stores/announce'
import { useFavoriteStore } from '@/stores/favorite'
import { storeToRefs } from 'pinia'
import ErrorModal from '@/components/error/ErrorModal.vue'

const announceStore = useAnnounceStore()
const favoriteStore = useFavoriteStore()
const filter = ref('전체')
const searched = ref('')

const errorModal = ref(false)
const errorMsg = ref('')

const { announceList } = storeToRefs(announceStore)

// 검색 대상 필드 (널-세이프 문자열 비교)
const SEARCH_FIELDS = ['title', 'exc_Instt_nm', 'lcategory']

const getTodayYmdNum = () => {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return Number(`${y}${m}${day}`)
}

const displayAnnounceList = computed(() => {
  const t = getTodayYmdNum()
  const src = Array.isArray(announceList.value) ? announceList.value : []

  // 1) 상태/카테고리 1차 필터
  let base = []
  if (filter.value === '마감') {
    base = src.filter((a) => a.end_date < t && a.end_date !== null) // 마감
  } else if (filter.value === '접수중') {
    base = src.filter((a) => (a.start_date <= t || a.pub_date <= t) && t <= a.end_date) // 접수중
  } else if (filter.value === '접수에정') {
    base = src.filter((a) => a.start_date > t || a.pub_date > t) // 접수예정
  } else if (filter.value === '즐겨찾기') {
    base = src.filter((a) => a.favorite) // 즐겨찾기
  } else {
    base = src.filter((a) => a.end_date >= t || a.end_date === null)
  }

  // 2) 검색어 2차 필터 (널-세이프 + 소문자 비교)
  const q = (searched.value || '').trim().toLowerCase() //버튼 없이 작동
  if (!q) return base

  return base.filter((item) =>
    SEARCH_FIELDS.some((k) => ((item?.[k] ?? '') + '').toLowerCase().includes(q)),
  )
})

const setFavorite = async (id, isFavorite) => {
  if (isFavorite) {
    await favoriteStore.deleteFavorite(id)
    if (favoriteStore.error !== null) {
      errorMsg.value = '즐겨찾기 취소에 실패했습니다.'
      errorModal.value = true
      return
    }
  } else {
    await favoriteStore.setFavorite(id)
    if (favoriteStore.error !== null) {
      errorMsg.value = '즐겨찾기 등록에 실패했습니다.'
      errorModal.value = true
      return
    }
  }

  const item = announceList.value?.find((it) => String(it.announce_id) === String(id))
  if (item) {
    item.favorite = !isFavorite
  }
}
onMounted(async () => {
  await announceStore.getAnnounceList()
  if (announceStore.error) {
    errorMsg.value = '공고 목록을 불러오는데 실패했습니다.'
    errorModal.value = true
  }
})
</script>

<template>
  <div
    class="h-full flex flex-col mx-[-1rem] border-t border-[#FFE1D0] mt-[-1rem] px-[1rem] pt-[1rem]"
  >
    <div class="flex gap-2 w-full flex flex-col">
      <SearchBarNoneButton v-model:searched="searched" />
      <TagSelector
        class=""
        :filter="filter"
        :tags="[
          { value: '전체', label: '전체' },
          { value: '즐겨찾기', label: '즐겨찾기' },
          { value: '접수에정', label: '접수예정' },
          { value: '접수중', label: '접수중' },
          { value: '마감', label: '마감' },
        ]"
        @update:filter="filter = $event"
      />
    </div>

    <div class="flex flex-col gap-1 mt-3 overflow-scroll [&::-webkit-scrollbar]:hidden">
      <AnnouncementCard
        v-for="announce in displayAnnounceList"
        :key="announce.announce_id"
        :announcement="announce"
        @updated="(id, isFavorite) => setFavorite(id, isFavorite)"
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
