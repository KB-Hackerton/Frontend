<script setup>
import SearchBar from '@/components/announce/SearchBar.vue'
import NoticeCard from '@/components/notice/NoticeCard.vue'
import { computed, onMounted, ref, watch } from 'vue'
import Paging from '@/components/common/Paging.vue'
import { useRoute, useRouter } from 'vue-router'
import { useNoticeStore } from '@/stores/notice'
import { storeToRefs } from 'pinia'
import notice from '@/api/notice'
import ErrorModal from '@/components/error/ErrorModal.vue'

const noticeStore = useNoticeStore()
const { noticeList } = storeToRefs(noticeStore)
const route = useRoute()
const router = useRouter()
const pageSize = 8
const errorModal = ref(false)
const errorMsg = ref('')

// --- 라우트 쿼리 변화에 반응 (동일 라우트 내에서 쿼리만 바뀔 때도 동기화)
watch(
  () => route.query.page,
  (p) => {
    const next = Math.max(1, Number(p) || 1)
    if (currentPage.value !== next) currentPage.value = next
  },
)

watch(
  () => route.query.q,
  (q) => {
    const str = typeof q === 'string' ? q : ''
    if (searched.value !== str) searched.value = str
    if (appliedQuery.value !== str) appliedQuery.value = str
  },
)

// 컴포넌트 초기 진입 시 URL에서 값 읽기
const searched = ref(route.query.q || '')
const appliedQuery = ref(route.query.q || '')
const currentPage = ref(Number(route.query.page) || 1)

// 필터링 이후의 총건수/총페이지를 계산하기 위해 computed로 전환
const filteredNoticeList = computed(() => {
  const q = (appliedQuery.value || '').trim().toLowerCase()
  if (!q) return noticeList.value
  const SEARCH_FIELDS = ['title', 'content']
  return noticeList.value.filter((item) =>
    SEARCH_FIELDS.some((k) => ((item?.[k] ?? '') + '').toLowerCase().includes(q)),
  )
})

const totalCount = computed(() => {
  return filteredNoticeList.value.length
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(totalCount.value / pageSize))
})

//검색어나 현재 페이지 상태가 바뀔 때 URL에 반영
watch([currentPage, appliedQuery], ([p, q]) => {
  router.replace({
    query: {
      ...route.query,
      page: String(p),
      q: q || undefined, // 검색어 없으면 쿼리 제거
    },
  })
})

watch(totalPages, (tp) => {
  if (tp < currentPage.value) {
    currentPage.value = tp
  }
  if (currentPage.value < 1) {
    currentPage.value = 1
  }
})

const displaynoticeList = computed(() => {
  const base = filteredNoticeList.value
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return base.slice(start, end)
})

const searchedAnnounce = () => {
  appliedQuery.value = searched.value
  currentPage.value = 1
}

const goTo = (p) => {
  const clamped = Math.min(Math.max(1, Number(p) || 1), totalPages.value)
  currentPage.value = clamped
}
onMounted(async () => {
  await noticeStore.getNoticeList()
  if (noticeStore.error) {
    errorMsg.value = '공지사항 목록을 불러오는데 실패했습니다.'
    errorModal.value = true
  }
})
</script>

<template>
  <div class="flex flex-col w-full h-full justify-between">
    <div>
      <div class="flex justify-between gap-4 items-center pt-3">
        <h1 class="text-24 bold shrink-0">공지사항</h1>
        <SearchBar @search="searchedAnnounce" v-model:searched="searched" />
        <!-- <SearchBar v-model:searched="searched" /> // 버튼없이 작동 -->
      </div>
      <div class="bg-gray-100 h-[0.5rem] mx-[-1rem] mt-3"></div>
      <div class="mt-1 mx-[-1rem]">
        <NoticeCard v-for="notice in displaynoticeList" :key="notice.notice_id" :notice="notice" />
      </div>
    </div>

    <div class="flex justify-center pb-1">
      <Paging :totalPages="totalPages" :currentPage="currentPage" @goTo="goTo" />
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
