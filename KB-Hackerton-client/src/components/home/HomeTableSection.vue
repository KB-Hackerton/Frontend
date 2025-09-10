<script setup>
import { ref, computed } from 'vue'
import announce from '@/_dummy/announce.json'
import festival from '@/_dummy/festival.json'

const activeTab = ref('지원금')
const tabs = ['지원금', '축제']

const filteredItems = computed(() => {
  return activeTab.value === '지원금'
    ? announce.slice(0, 3).map((a) => ({
      title: a.announce_title,
      link: `/`,
    }))
    : festival.slice(0, 3).map((f) => ({
      title: f.festival_title,
      link: `/`,
    }))
})
</script>

<template>
  <section class=" p-6  rounded-lg ">

    <h2 class="text-18 font-bold mb-3">신규</h2>

    <div class="flex gap-5  mb-4">
      <button v-for="tab in tabs" :key="tab" @click="activeTab = tab"
        class="pb-2 text-[12px] font-semibold"
        :class="
          activeTab === tab
            ? 'text-orange-500 border-b-2 border-orange-500'
            : 'text-gray-300'
        "
      >
        {{ tab }}
      </button>
    </div>

    <ul class="flex flex-col gap-3">
      <li
        v-for="(item, i) in filteredItems"
        :key="i"
        class="flex items-center justify-between bg-white px-4 py-2.5 rounded-2xl shadow-lg border border-[#FADECB]"
      >
  <span class="text-[12px] font-medium text-gray-700 truncate">
    {{ item.title }}
  </span>
        <button
          class="flex items-center justify-center bg-main text-white text-[7px] font-semibold px-4 py-1 rounded-lg shadow-md hover:bg-orange-600 transition"
        >
          상세보기
        </button>
      </li>
    </ul>
  </section>
</template>
