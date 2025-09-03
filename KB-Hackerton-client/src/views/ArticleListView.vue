<script setup>
import SearchBar from '@/components/announce/SearchBar.vue'
import { computed, ref, watch } from 'vue'
import article from '@/_dummy/article'
import Paging from '@/components/common/Paging.vue'

import { useRoute, useRouter } from 'vue-router'
import ArticleCard from '@/components/article/ArticleCard.vue'

const route = useRoute()
const router = useRouter()
const pageSize = 5

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
  if (!q) return article
  const SEARCH_FIELDS = ['title', 'content']
  return article.filter((item) =>
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

const displayArticleList = computed(() => {
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
</script>

<template>
  <div class="flex flex-col w-full h-full justify-between">
    <div>
      <div class="flex justify-between gap-4 items-center pt-3">
        <h1 class="text-24 bold px-4 shrink-0">뉴스</h1>
        <SearchBar @search="searchedAnnounce" v-model:searched="searched" />
        <!-- <SearchBar v-model:searched="searched" /> // 버튼없이 작동 -->
      </div>
      <div class="bg-gray-100 h-[0.5rem] mx-[-1rem] mt-2"></div>
      <div class="mt-3 mx-[-1rem] overflow-scroll [&::-webkit-scrollbar]:hidden">
        <ArticleCard
          v-for="article in displayArticleList"
          :key="article.article_id"
          :article="article"
        />
      </div>
    </div>

    <div class="flex justify-center pb-1">
      <Paging :totalPages="totalPages" :currentPage="currentPage" @goTo="goTo" />
    </div>
  </div>
</template>

<style scoped></style>
