<script setup>
import FavoriteCard from '@/components/favorite/FavoriteCard.vue'
import announce from '@/_dummy/announce.json'

const favoriteAnnounceList = announce.filter((a) => a.is_favorite)
// 카드 간 간격(ms) — 원하면 60~120ms 사이에서 조절
const STAGGER = 90
</script>

<template>
  <div
    class="mx-[-1rem] px-[1rem] text-center flex flex-col gap-5 mb-10 border-t border-[#FFE1D0] mt-[-1rem] pt-[1.5rem]"
  >
    <TransitionGroup
      appear
      tag="div"
      class="flex flex-col gap-5"
      enter-from-class="opacity-0 translate-y-4"
      enter-active-class="transition duration-500 ease-out"
      enter-to-class="opacity-100 translate-y-0"
      leave-from-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-300 ease-in"
      leave-to-class="opacity-0 translate-y-4"
      move-class="transition-transform duration-300 ease-in-out"
    >
      <!-- 여기서 래퍼 div에 transition-delay를 동적으로 바인딩 -->
      <div
        v-for="(announce, i) in favoriteAnnounceList"
        :key="announce.announce_id"
        class="will-change-transform"
        :style="{ transitionDelay: `${i * STAGGER}ms` }"
      >
        <FavoriteCard :favorite="announce" />
      </div>
    </TransitionGroup>
  </div>
</template>
