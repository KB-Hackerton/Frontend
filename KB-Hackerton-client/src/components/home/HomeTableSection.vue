<script setup>
import { ref, computed, onMounted } from 'vue'
import { useHomeStore } from '@/stores/home' // home 스토어 가져오기

const homeStore = useHomeStore()

const activeTab = ref('공고')
const tabs = ['공고', '축제']

// Pinia 스토어에서 데이터 가져오기
const homeData = computed(() => homeStore.homeData)

// 탭에 따라 필터링된 항목을 계산
const filteredItems = computed(() => {
  if (activeTab.value === '공고') {
    return (homeData.value.recent_announce || []).slice(0, 3).map((a) => ({
      title: a.announce_title, // DTO에 맞게 필드명 수정
      link: `/announce-list/${a.announceId}`, // 링크 수정
    }))
  } else {
    return (homeData.value.recent_festival || []).slice(0, 3).map((f) => ({
      title: f.festival_title, // DTO에 맞게 필드명 수정
      link: `/festival/${f.festival_id}`, // 링크 수정
    }))
  }
})

// 컴포넌트가 마운트될 때 데이터 가져오기
onMounted(() => {
  homeStore.getHomeData()
})
</script>

<template>
  <section class="p-6 rounded-lg">
    <h2 class="text-18 font-bold mb-3">신규</h2>
    <div class="flex gap-5 mb-4">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="activeTab = tab"
        class="pb-2 text-[12px] font-semibold"
        :class="
          activeTab === tab ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-300'
        "
      >
        {{ tab }}
      </button>
    </div>

    <div v-if="homeStore.loading">로딩 중...</div>
    <div v-else-if="homeStore.error">데이터 로딩에 실패했습니다.</div>
    <div v-else>
      <ul class="flex flex-col gap-3">
        <li
          v-for="(item, i) in filteredItems"
          :key="i"
          class="flex items-center justify-between bg-white px-4 py-2.5 rounded-2xl shadow-lg border border-[#FADECB]"
        >
          <span class="text-[12px] font-medium text-gray-700 truncate max-w-[75%]">
            {{ item.title }}
          </span>
          <router-link
            :to="item.link"
            class="flex items-center justify-center bg-main text-white text-[7px] font-semibold px-4 py-1 rounded-lg shadow-md hover:bg-orange-600 transition"
          >
            상세보기
          </router-link>
        </li>
      </ul>
    </div>
  </section>
</template>
