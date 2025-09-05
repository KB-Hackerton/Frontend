<script setup>
import { useRoute } from 'vue-router'
import notice from '@/_dummy/notice_dummy'

const route = useRoute()

const noticeDetail = notice.find((n) => n.notice_id === Number(route.params.notice_id))
</script>

<template>
  <div class="flex flex-col items-center gap-4 mt-5">
    <h1 class="text-20 bold">{{ noticeDetail.title }}</h1>
    <p class="text-14 medium px-4">{{ noticeDetail.content }}</p>
    <p class="text-14">{{ noticeDetail.created_at }}</p>
  </div>
</template>

<style scoped></style>
