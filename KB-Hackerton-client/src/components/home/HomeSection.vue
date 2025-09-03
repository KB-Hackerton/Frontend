<script setup>
import HomeCard from '@/components/home/HomeCard.vue'

const props = defineProps({
  title: { type: String, required: true },
  moreText: { type: String, default: '더보기' },
  items: {
    type: Array,
    required: true,
    // 예: [{ title, dday, link }]
  },
  moreLink: { type: String, default: '/' }, // 더보기 클릭 시 이동할 링크
})
</script>

<template>
  <section class="bg-white py-4 mb-3">
    <div class="flex justify-between items-center px-3 mb-2">
      <h2 class="font-bold text-18">{{ title }}</h2>
      <router-link :to="moreLink" class="text-12 text-gray-400 cursor-pointer">
        {{ moreText }} &gt;
      </router-link>
    </div>

    <div class="flex gap-3 overflow-x-auto px-3">
      <HomeCard
        v-for="(item, index) in items"
        :key="index"
        :title="item.title"
        :dday="item.dday"
        :link="item.link"
      />
    </div>
  </section>
</template>
