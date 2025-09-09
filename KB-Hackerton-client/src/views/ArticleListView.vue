<script setup>
import { computed, ref, watch, nextTick, onMounted } from 'vue'
import Paging from '@/components/common/Paging.vue'
import { useRoute, useRouter } from 'vue-router'
import ArticleCard from '@/components/article/ArticleCard.vue'
import SearchBarNoneButton from '@/components/input/SearchBarNoneButton.vue'
import { useArticleStore } from '@/stores/article'
import { storeToRefs } from 'pinia'
import ErrorModal from '@/components/error/ErrorModal.vue'

const route = useRoute()
const router = useRouter()
const pageSize = 5

const errorModal = ref(false)
const errorMsg = ref('')

const articleStore = useArticleStore()
const { articleList } = storeToRefs(articleStore)

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

let __searchSyncTimer
watch(searched, (val) => {
  if (__searchSyncTimer) clearTimeout(__searchSyncTimer)
  __searchSyncTimer = setTimeout(() => {
    appliedQuery.value = val
    currentPage.value = 1
  }, 250)
})

// 필터링 이후의 총건수/총페이지를 계산하기 위해 computed로 전환
const filteredNoticeList = computed(() => {
  const q = (appliedQuery.value || '').trim().toLowerCase()
  if (!q) return articleList.value
  const SEARCH_FIELDS = ['title', 'content']
  return articleList.value.filter((item) =>
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

const goTo = async (p) => {
  const clamped = Math.min(Math.max(1, Number(p) || 1), totalPages.value)
  currentPage.value = clamped
  await nextTick()
  const el = document.querySelector('.flex.flex-col.w-full.h-full.justify-between')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

onMounted(async () => {
  await articleStore.getArticleList()
  if (articleStore.error) {
    errorMsg.value = '뉴스 목록을 불러오는데 실패했습니다.'
    errorModal.value = true
  }
})
</script>

<template>
  <div class="flex flex-col w-full h-full justify-between mt-[-1.5rem]">
    <div>
      <div class="flex justify-between gap-4 items-center pt-3">
        <SearchBarNoneButton v-model:searched="searched" :placeholder="'뉴스 검색....'" />
      </div>
      <div class="bg-gray-100 h-[0.5rem] mx-[-1rem] mt-2"></div>
      <div class="mt-3 flex flex-col gap-3">
        <ArticleCard
          v-for="article in displayArticleList"
          :key="article.article_id"
          :article="article"
        />
      </div>
    </div>

    <div class="flex justify-center pt-2 pb-[3rem]">
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
