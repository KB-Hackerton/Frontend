<script setup>
import ErrorModal from '@/components/error/ErrorModal.vue'
import { useNoticeStore } from '@/stores/notice'
import { Icon } from '@iconify/vue'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const errorModal = ref(false)
const errorMsg = ref('')
const noticeStore = useNoticeStore()
const { noticeDetail } = storeToRefs(noticeStore)

const isInspectionNotice = computed(() => {
  const title = noticeDetail.value?.title ?? ''
  return /점검\s*안내/.test(title)
})

onMounted(async () => {
  const id = route.params.notice_id
  await noticeStore.getNoticeDetail(id)
  if (noticeStore.error) {
    errorMsg.value = '공지사항을 불러오는데 실패했습니다.'
    errorModal.value = true
  }
})
const extractedDateTime = computed(() => {
  if (!noticeDetail.value?.content) return null
  const regex = /(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})~(\d{2}:\d{2})/
  const match = noticeDetail.value.content.match(regex)
  if (match) {
    // ✅ 날짜 포맷을 한국식으로 변환
    const [year, month, day] = match[1].split('-')
    const formattedDate = `${year}년 ${Number(month)}월 ${Number(day)}일`
    return {
      date: formattedDate,
      startTime: match[2],
      endTime: match[3],
    }
  }
  return null
})

// 한국 시간으로 변환
const toKSTString = (d) => {
  const offsetDate = new Date(d.getTime() + 9 * 60 * 60 * 1000) // UTC+9
  const y = offsetDate.getUTCFullYear()
  const m = String(offsetDate.getUTCMonth() + 1).padStart(2, '0')
  const day = String(offsetDate.getUTCDate()).padStart(2, '0')
  const hh = String(offsetDate.getUTCHours()).padStart(2, '0')
  const mm = String(offsetDate.getUTCMinutes()).padStart(2, '0')
  const ss = String(offsetDate.getUTCSeconds()).padStart(2, '0')
  return `${y}-${m}-${day} ${hh}:${mm}:${ss}`
}

const createdAtKST = computed(() => {
  const iso = noticeDetail.value?.created_at
  if (!iso) return null
  const d = new Date(iso)
  if (isNaN(d)) return null
  return toKSTString(d)
})
</script>

<template>
  <div class="">
    <div class="w-full bg-[#FFFBF4] rounded-2xl px-4 shadow-custom pt-8">
      <div v-if="isInspectionNotice" class="flex items-center gap-2 mb-1">
        <div class="w-2 h-2 bg-orange-200 rounded-full"></div>
        <p class="text-[0.8rem] text-orange-200 semibold">중요 공지</p>
      </div>
      <h1 class="text-16 bold">{{ noticeDetail.title }}</h1>

      <div class="flex items-center gap-1 mt-[0.4rem] mb-4">
        <Icon icon="uil:calender" class="size-4 text-gray-400" />
        <p v-if="createdAtKST" class="text-14 medium text-gray-400">{{ createdAtKST }}</p>
      </div>

      <div v-if="extractedDateTime" class="bg-white border-l-4 border-orange-200 p-2">
        <div class="flex items-center gap-2">
          <Icon icon="bx:error" class="size-5 text-orange-200" />
          <p class="text-14 bold text-orange-200 flex flex-col">점검 일정</p>
        </div>
        <p class="text-12 pl-7 pt-1">
          {{
            `${extractedDateTime.date} ${extractedDateTime.startTime} ~ ${extractedDateTime.endTime}`
          }}
        </p>
      </div>
      <p class="text-14 medium mt-4 mb-4">{{ noticeDetail.content }}</p>

      <p class="text-12 text-gray-400 border-t pt-4 pb-9">
        문의사항이 있으시면 고객센터로 연락해 주세요.
      </p>
      <div
        v-if="errorModal"
        class="fixed inset-0 bg-black/55 z-[90]"
        @click="errorModal = false"
      ></div>
    </div>

    <ErrorModal
      v-if="errorModal"
      @close="errorModal = false"
      :title="errorMsg"
      class="z-[100] fixed top-1/3 left-1/2 -translate-x-1/2"
    />
  </div>
</template>

<style scoped></style>
