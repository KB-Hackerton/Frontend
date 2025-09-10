<script setup>
const props = defineProps({
  title: { type: String, required: true },
  items: {
    type: Array,
    required: true,
    // 예: [{ id, title, link }]
  },
  moreText: { type: String, default: '더보기' },
  moreLink: { type: String, default: '/' },
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

    <div class="bg-white rounded-xl shadow mx-3 border border-[#FFE1D0] divide-y divide-[#FFE1D0]">
      <router-link
        v-for="(item, i) in items"
        :key="i"
        :to="item.link"
        class="block p-4 text-12 hover:bg-gray-50"
      >
        {{ item.title }}
      </router-link>
    </div>
  </section>
</template>
