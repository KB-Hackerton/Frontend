<script setup>
import { onMounted, computed } from 'vue' // onMounted와 computed를 가져옵니다.
import { useHomeStore } from '@/stores/home' // 방금 만든 home.js 스토어를 가져옵니다.
import bannerImg from '@/assets/images/banner.png'
import HomeSection from '@/components/home/HomeSection.vue'
import HomeList from '@/components/home/HomeList.vue'
import HomeTabSection from '@/components/home/HomeTableSection.vue'
import PopularPrograms from '@/components/home/PopularPrograms.vue'
import AiRecommandation from '@/components/home/AiRecommandation.vue'
import { storeToRefs } from 'pinia'

// 더미 데이터는 이제 필요 없으므로 삭제하거나 주석 처리합니다.
// import announce from '@/_dummy/announce.json'
// import article from '@/_dummy/articles.json'
// import notice from '@/_dummy/notice.json'

// Pinia 스토어를 사용합니다.
const homeStore = useHomeStore()

// Pinia 스토어의 상태를 Vue 컴포넌트에서 사용하도록 연결합니다.
const loading = computed(() => homeStore.loading)
const error = computed(() => homeStore.error)
const { homeData } = storeToRefs(homeStore)

// 컴포넌트가 마운트될 때 API를 호출합니다.
onMounted(async () => {
  await homeStore.getHomeData()
  if (homeStore.error) {
    console.error('❌ 홈 데이터 불러오기 실패')
  } else {
    console.log('🟢 홈 데이터 불러오기 성공', homeStore.homeData)
  }
})

// 날짜 계산 함수는 그대로 둡니다.
function calcDday(dateStr) {
  if (!dateStr) return null
  const yyyy = dateStr.slice(0, 4)
  const mm = dateStr.slice(4, 6)
  const dd = dateStr.slice(6, 8)
  const endDate = new Date(`${yyyy}-${mm}-${dd}`)
  const today = new Date()
  return Math.max(0, Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)))
}
</script>
<template>
  <div class="mx-[-1rem] min-h-screen">
    <div class="w-full bg-white mb-3">
      <img :src="bannerImg" alt="경상났네 배너" class="w-full" />
    </div>

    <AiRecommandation />

    <PopularPrograms :items="homeData.announce_ranking || []" />

    <HomeTabSection />

    <HomeSection
      title="최근 본 공고"
      moreText="공고 더보기"
      moreLink="/announce-list"
      :items="
        homeData.recent_view_announce?.slice(0, 3).map((a) => ({
          title: a.announce_title,
          dday: calcDday(a.reqst_end_date),
          link: `/announce-list/${a.announce_id}`,
        })) || []
      "
    />

    <HomeList
      title="최근 기사"
      moreText="기사 더보기"
      moreLink="/article"
      :items="
        homeData.recent_article?.slice(0, 3).map((a) => ({
          title: a.title,
          link: `/article/${a.article_id}`,
        })) || []
      "
    />

    <HomeList
      title="공지사항"
      moreText="공지사항 더보기"
      moreLink="/notice-list"
      :items="
        homeData.recentAnnounce?.slice(0, 3).map((n) => ({
          title: n.announceTitle,
          link: `/notice-list/${n.announceId}`,
        })) || []
      "
    />
  </div>
</template>
<style scoped></style>
