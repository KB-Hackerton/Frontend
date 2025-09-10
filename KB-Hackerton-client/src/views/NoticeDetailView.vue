<script setup>
import ErrorModal from '@/components/error/ErrorModal.vue'
import { useNoticeStore } from '@/stores/notice'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const errorModal = ref(false)
const errorMsg = ref('')
const noticeStore = useNoticeStore()
const { noticeDetail } = storeToRefs(noticeStore)

onMounted(async () => {
  const id = route.params.notice_id
  await noticeStore.getNoticeDetail(id)
  if (noticeStore.error) {
    errorMsg.value = '공지사항을 불러오는데 실패했습니다.'
    errorModal.value = true
  }
})
</script>

<template>
  <div class="flex flex-col items-center gap-4 mt-5">
    <h1 class="text-20 bold">{{ noticeDetail.title }}</h1>

    <p class="text-14 medium px-4">{{ noticeDetail.content }}</p>
    <p class="text-14">{{ noticeDetail.created_at }}</p>

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

<style scoped></style>
