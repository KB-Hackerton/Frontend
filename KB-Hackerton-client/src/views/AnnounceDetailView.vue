<script setup>
import announce from '@/_dummy/announce'
import { Icon } from '@iconify/vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const announceDetail = announce.find((a) => a.announce_id === Number(route.params.announce_id))
const printFilePath = announceDetail.print_file_path_name
const filePath = announceDetail.file_path_name

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
  const s = toYmdNumFromRaw(announceDetail.reqst_start_date)
  const e = toYmdNumFromRaw(announceDetail.reqst_end_date)

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

const documents = [
  '지원 신청서 1부',
  '사업계획서 1부',
  '개인정보 수집 · 이용 제공 동의서 1부',
  '참여서약서 1부',
  '주민등록초본 1부',
  '가족관계증명서 각 1부 (본인 기준 1, 父 기준 1, 母 기준 1, 총 3부, 기혼자일 경우 배우자 기준 1부 추가 제출)',
  '사실증명(사업자등록사실여부) 1부 <사업자등록 없는 자>',
  '사실증명(총사업자등록내역) 1부 <초기창업자, 폐업이력이 있는 자>',
  '증명서에 따라 추가서류 요청할 수 있음',
  '사업자등록증 및 임대차계약서(사본) 1부 <초기창업자>',
  '국세 완납증명서 및 지방세 완납증명서 1부',
  '4대 보험 가입확인서 1부',
  '소상공인지식배움터 온라인 교육 수료증 2부 (반드시 2과목 이상 수료) (https://edu.sbiz.or.kr/edu/main/main.do)',
]
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

    <div class="px-[1rem] mt-[-3.5rem]">
      <di class="flex flex-col bg-white gap-1 rounded-[0.7rem] shadow-custom p-5 shadow-custom">
        <h1 class="text-14 bold">{{ announceDetail.announce_title }}</h1>
        <div class="flex items-center gap-1">
          <Icon icon="prime:calendar" class="size-4" />
          <p class="text-12 medium">
            {{
              `신청기간 ${announceDetail.reqst_start_date} ~ ${announceDetail.reqst_end_date ? announceDetail.reqst_end_date : '예산소진시 까지'}`
            }}
          </p>
        </div>
        <div class="flex items-center gap-1">
          <Icon icon="bx:map" class="size-4" />
          <p class="text-12 medium">{{ announceDetail.exc_InsttNm }}</p>
        </div>
      </di>

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
          <icon icon="lucide:users" class="size-4 text-orange-200" />
          <p class="text-14 bold">신청 내용</p>
        </div>

        <div class="flex items-startgap-1 bg-[#FFF7F5] rounded-[0.7rem] p-3 mt-5">
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
      >
        <div class="flex items-center gap-1 border-b-2 border-orange-200 pb-1">
          <Icon icon="fluent:document-text-32-regular" class="size-4 text-orange-200" />
          <p class="text-14 bold">제출 서류</p>
        </div>

        <div class="flex flex-col items-start gap-1 w-full">
          <ul class="list-disc list-outside pl-4">
            <li
              v-for="(document, i) in documents"
              :key="i"
              class="text-12 semibold mt-2 marker:text-orange-200 marker:text-14"
            >
              {{ document }}
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
        <div class="bg-[#FFF7F5] rounded-[0.7rem] p-3 flex items-center gap-2">
          <Icon icon="ph:arrow-square-out-bold" class="size-4 text-orange-200" />
          <button
            @click="openNewTab(announceDetail.link)"
            class="text-10 text-orange-200 bold w-full text-start"
          >
            {{ announceDetail.link }}
          </button>
        </div>
      </div>

      <div
        class="flex flex-col bg-white gap-1 rounded-[0.7rem] shadow-custom p-5 shadow-custom mt-5"
      >
        <div class="flex items-center gap-1 border-b-2 border-orange-200 pb-1">
          <Icon icon="tdesign:call" class="size-4 text-orange-200" />
          <p class="text-14 bold">문의처</p>
        </div>

        <div class="flex items-startgap-1 bg-[#FFF7F5] rounded-[0.7rem] p-3 mt-5">
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
        <p class="text-12 medium mt-3">{{ announceDetail.exc_InsttNm }}</p>

        <div class="bg-gray-100 rounded-[0.5rem] w-full px-2 py-[0.4rem] mt-3">
          <p class="text-10 mideum text-gray-300">
            {{ `공고등록일: ${announceDetail.pub_date}` }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
