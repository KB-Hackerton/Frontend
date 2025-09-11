<script setup>
import ErrorModal from '@/components/error/ErrorModal.vue'
import { useAnnounceStore } from '@/stores/announce'
import { Icon } from '@iconify/vue'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const announceStore = useAnnounceStore()
const { announceDetail } = storeToRefs(announceStore)
const filePath = computed(() => announceDetail.value?.file_path_name || '')
const printFilePath = computed(() => announceDetail.value?.print_file_path_name || '')

const errorModal = ref(false)
const errorMsg = ref('')

const getTodayYmdNum = () => {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return Number(`${y}${m}${day}`)
}

const toYmdNumFromRaw = (raw) => {
  if (raw == null) return NaN
  const digits = String(raw).replace(/[^0-9]/g, '')
  if (digits.length !== 8) return NaN
  return Number(digits)
}

const announcementStatus = computed(() => {
  const t = getTodayYmdNum()
  const s = toYmdNumFromRaw(announceDetail.value.start_date)
  const e = toYmdNumFromRaw(announceDetail.value.end_date)

  if (t < s) return '접수예정'
  else if (t > e) return '마감'
  else if (t >= s && t <= e) {
    if (e - t < 5) {
      return '마감임박'
    }
    return '접수중'
  }
  return '접수중'
})

const openNewTab = (url) => {
  window.open(url, '_blank')
}
onMounted(async () => {
  const id = route.params.announce_id
  await announceStore.getAnnounceDetail(id)
  if (announceStore.error) {
    errorMsg.value = '공고 상세 정보를 불러오는데 실패했습니다.'
    errorModal.value = true
  }
})
</script>

<template>
  <div
    class="flex flex-col mx-[-1rem] mt-[-2rem] gap-8 items-center overflow-scroll [&::-webkit-scrollbar]:hidden] pb-[2rem]"
  >
    <div class="bg-orange-300 w-full flex flex-col gap-1 py-10 px-[1rem]">
      <div class="bg-gray-100 rounded-full px-2 py-[0.1rem] text-orange-300 w-fit flex self-end">
        <p class="text-12 mideum">{{ announcementStatus }}</p>
      </div>

      <div class="flex flex-col items-center">
        <Icon icon="lucide:building-2" class="size-10 text-white" />
        <p class="text-12 mideum text-white">{{ `${announceDetail.lcategory} 지원 사업` }}</p>
      </div>
    </div>

    <div class="w-full px-[1rem] mt-[-3.5rem]">
      <div class="flex flex-col bg-white gap-1 rounded-[0.7rem] shadow-custom p-5 shadow-custom">
        <h1 class="text-14 bold">{{ announceDetail.announce_title }}</h1>
        <div class="flex items-center gap-1">
          <Icon icon="prime:calendar" class="size-4" />
          <p class="text-12 medium">
            {{
              `신청기간 ${announceDetail.start_date || announceDetail.pub_date} ~ ${announceDetail.end_date ? announceDetail.end_date : '예산소진시 까지'}`
            }}
          </p>
        </div>
        <div class="flex items-center gap-1">
          <Icon icon="bx:map" class="size-4" />
          <p class="text-12 medium">{{ announceDetail.exc_instt_nm }}</p>
        </div>
      </div>

      <div
        class="flex flex-col bg-white gap-1 rounded-[0.7rem] shadow-custom p-5 shadow-custom mt-5"
      >
        <div class="flex items-center gap-1 border-b-2 border-orange-200 pb-1">
          <Icon icon="fluent:document-text-32-regular" class="size-4 text-orange-200" />
          <h2 class="text-14 bold">설명</h2>
        </div>
        <p v-html="announceDetail.description" class="text-10 medium text-center mt-4"></p>
      </div>

      <div
        class="flex flex-col bg-white gap-1 rounded-[0.7rem] shadow-custom p-5 shadow-custom mt-5"
      >
        <div class="flex items-center gap-1 border-b-2 border-orange-200 pb-1">
          <Icon icon="lucide:users" class="w-5 h-5 text-orange-500" />
          <p class="text-14 bold">신청 내용</p>
        </div>

        <div class="flex items-start gap-1 bg-[#FFF7F5] rounded-[0.7rem] p-3 mt-5">
          <ul class="list-disc list-outside pl-4">
            <li class="marker:text-orange-200 marker:text-14 text-10 semibold">
              {{ announceDetail.hashtags }}
            </li>
          </ul>
        </div>

        <div class="flex flex-col mt-4">
          <h2 class="text-16 bold">신청 및 접수</h2>
          <p class="text-12 medium whitespace-pre-line mt-1">
            {{ announceDetail.how_to_register }}
          </p>
        </div>

        <a
          v-if="announceDetail.print_file_path_name"
          :href="printFilePath"
          class="inline-block px-3 text-12 bold bg-gray-100 py-1 rounded-[0.5rem] shadow-custom text-center mt-4"
          >{{ announceDetail.print_file_name }}</a
        >
      </div>

      <div
        class="flex flex-col bg-white gap-1 rounded-[0.7rem] shadow-custom p-5 shadow-custom mt-5"
        v-if="announceDetail.checklist?.length !== 0 && announceDetail.file_path_name"
      >
        <div class="flex items-center gap-1 border-b-2 border-orange-200 pb-1">
          <Icon icon="fluent:document-text-32-regular" class="size-4 text-orange-200" />
          <p class="text-14 bold">제출 서류</p>
        </div>

        <div class="flex flex-col items-start gap-1 w-full">
          <ul class="list-disc list-outside pl-4">
            <li
              v-for="(document, i) in announceDetail.checklist"
              :key="i"
              class="text-12 semibold mt-2 marker:text-orange-200 marker:text-14"
            >
              {{ document.title }}
            </li>
          </ul>
        </div>
        <a
          v-if="announceDetail.file_path_name"
          :href="filePath"
          class="inline-block px-3 text-12 bold bg-gray-100 py-1 rounded-[0.5rem] shadow-custom text-center mt-4"
          >{{ announceDetail.file_name }}</a
        >
      </div>

      <div class="bg-white gap-1 rounded-[0.7rem] shadow-custom p-5 shadow-custom mt-5">
        <button
          class="bg-[#FFF7F5] rounded-[0.7rem] w-full p-3 flex items-center gap-2"
          @click="openNewTab(announceDetail.link)"
        >
          <Icon icon="ph:arrow-square-out-bold" class="w-5 h-5 shrink-0 text-orange-500" />
          <p
            class="text-10 text-orange-200 bold text-start min-w-0 truncate"
            :title="announceDetail.link"
          >
            {{ announceDetail.link }}
          </p>
        </button>
      </div>

      <div
        class="flex flex-col bg-white gap-1 rounded-[0.7rem] shadow-custom p-5 shadow-custom mt-5"
      >
        <div class="flex items-center gap-1 border-b-2 border-orange-200 pb-1">
          <Icon icon="tdesign:call" class="size-4 text-orange-200" />
          <p class="text-14 bold">문의처</p>
        </div>

        <div class="flex items-start gap-1 bg-[#FFF7F5] rounded-[0.7rem] p-3 mt-5">
          <ul class="list-disc list-outside pl-4">
            <li class="marker:text-orange-200 marker:text-14 text-10 semibold">
              {{ announceDetail.call_company }}
            </li>
          </ul>
        </div>
      </div>

      <div
        class="flex flex-col bg-white gap-1 rounded-[0.7rem] shadow-custom p-5 shadow-custom mt-5"
      >
        <div class="flex items-center gap-1 border-b-2 border-orange-200 pb-1">
          <Icon icon="fluent:document-text-32-regular" class="size-4 text-orange-200" />
          <p class="text-14 bold">출처 관리자</p>
        </div>
        <p class="text-12 medium mt-3">{{ announceDetail.exc_instt_nm }}</p>

        <div class="bg-gray-100 rounded-[0.5rem] w-full px-2 py-[0.4rem] mt-3">
          <p class="text-10 mideum text-gray-300">
            {{ `공고등록일: ${announceDetail.pub_date}` }}
          </p>
        </div>
      </div>
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

<style scoped></style>
