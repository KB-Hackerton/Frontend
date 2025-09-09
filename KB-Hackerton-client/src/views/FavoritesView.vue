<script setup>
import ErrorModal from '@/components/error/ErrorModal.vue'
import FavoriteCard from '@/components/favorite/FavoriteCard.vue'
import { useFavoriteStore } from '@/stores/favorite'
import { Icon } from '@iconify/vue'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'

const favoriteStore = useFavoriteStore()
const { favoriteList } = storeToRefs(favoriteStore)
const errorModal = ref(false)
const errorMsg = ref('')

// 카드 간 간격(ms) — 원하면 60~120ms 사이에서 조절
const STAGGER = 90

onMounted(async () => {
  await favoriteStore.getFavoriteList()
  if (favoriteStore.error) {
    errorMsg.value = '즐겨찾기 목록을 불러오는데 실패했습니다.'
    errorModal.value = true
  }
})
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
        v-for="(announce, i) in favoriteList"
        :key="announce.announce_id"
        class="will-change-transform"
        :style="{ transitionDelay: `${i * STAGGER}ms` }"
      >
        <FavoriteCard :favorite="announce" />
      </div>
    </TransitionGroup>

    <div v-if="favoriteList.length === 0" class="mt-[10rem]">
      <div class="flex justify-center">
        <Icon
          icon="material-symbols:kid-star"
          class="w-[2.5rem] h-auto text-gray-300 mt-[-3.5rem] mr-[-2rem]"
        />
        <Icon icon="mi:document" class="w-[4.5em] h-auto text-gray-300" />
      </div>
      <p class="text-16 text-gray-300 semibold">즐겨찾기한 공고가 없습니다....</p>
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
