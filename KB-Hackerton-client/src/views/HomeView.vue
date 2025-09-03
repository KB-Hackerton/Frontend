<script setup>
import bannerImg from '@/assets/images/banner.png'
import HomeSection from '@/components/home/HomeSection.vue'
import HomeList from '@/components/home/HomeList.vue'

import announce from '@/_dummy/announce.json'
import festival from '@/_dummy/festival.json'
import article from '@/_dummy/articles.json'
import notice from '@/_dummy/notice.json'

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
  <div class="w-full min-h-screen bg-gray-100">
    <div class="w-full bg-white mb-3">
      <img :src="bannerImg" alt="경상났네 배너" class="w-full" />
    </div>

    <HomeSection
      title="최근 공고"
      moreText="공고 더보기"
      moreLink="/announce-list"
      :items="
        announce.slice(0, 3).map((a) => ({
          title: a.announce_title,
          dday: calcDday(a.reqst_end_date),
          link: `/`,
          // link: `/announce-list/${a.announce_id}`,
        }))
      "
    />

    <HomeSection
      title="최근 축제 정보"
      moreText="축제 더보기"
      moreLink="/festival-list"
      :items="
        festival.slice(0, 3).map((f) => ({
          title: f.festival_title,
          link: `/`,
          // link: `/festival-list/${f.festival_id}`,
        }))
      "
    />

    <!-- 관련 기사 -->
    <HomeList
      title="관련 기사"
      moreText="기사 더보기"
      moreLink="/article"
      :items="
        article.slice(0, 3).map((a) => ({
          title: a.title,
          link: `/`,
          // link: `/article/${a.article_id}`,
        }))
      "
    />

    <HomeSection
      title="최근 본 공고"
      moreText="공고 더보기"
      moreLink="/announce-list"
      :items="
        announce.slice(0, 3).map((a) => ({
          title: a.announce_title,
          dday: calcDday(a.reqst_end_date),
          link: `/`,
          // link: `/announce-list/${a.announce_id}`,
        }))
      "
    />

    <!-- 공지사항 -->
    <HomeList
      title="공지사항"
      moreText="공지사항 더보기"
      moreLink="/notice"
      :items="
        notice.slice(0, 3).map((n) => ({
          title: n.title,
          link: `/`,
          // link: `/notice/${n.notice_id}`,
        }))
      "
    />
  </div>
</template>

<style scoped></style>
