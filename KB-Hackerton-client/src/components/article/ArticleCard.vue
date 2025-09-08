<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  article: {
    type: Object,
    required: true,
  },
})

const openNewTab = (url) => {
  window.open(url, '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <div
    class="border border-gray-200 bg-[#FAF8F5] flex flex-col h-[11rem] px-3 justify-between rounded-[0.5rem] shadow-custom px-3 py-4"
  >
    <div class="text-12 bold mt-2 truncate">{{ props.article.title }}</div>
    <div class="flex-1 text-10 medium line-clamp-4 leading-5 mt-1">
      {{ props.article.content }}
    </div>
    <div class="flex justify-between">
      <div class="text-end text-10 bold">{{ props.article.published_at }}</div>
      <button class="text-12 text-main bold" @click="openNewTab(props.article.article_url)">
        더보기
      </button>
    </div>
  </div>
</template>

<style scoped></style>
