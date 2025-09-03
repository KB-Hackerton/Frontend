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
    class="border-b border-gray-200 flex flex-col h-[7rem] px-3 justify-between pt-3 pb-1"
    @click="openNewTab(article.article_url)"
  >
    <div class="text-12 bold mt-2 truncate">{{ props.article.title }}</div>
    <div class="text-10 medium pr-16 line-clamp-2 leading-6">{{ props.article.content }}</div>
    <div class="text-end text-10 bold">{{ props.article.published_at }}</div>
  </div>
</template>

<style scoped></style>
