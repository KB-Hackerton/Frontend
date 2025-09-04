<script setup>
import announce from '@/_dummy/announce'
import { useRoute } from 'vue-router'

const route = useRoute()
const announceDetail = announce.find((a) => a.announce_id === Number(route.params.announce_id))
const printFilePath = announceDetail.print_file_path_name
const filePath = announceDetail.file_path_name

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
    class="flex flex-col h-full gap-8 items-center overflow-scroll [&::-webkit-scrollbar]:hidden pt-3"
  >
    <h1 class="text-18 bold text-center px-4">{{ announceDetail.announce_title }}</h1>
    <p class="text-14 text-center semibold">
      {{
        `신청기간 ${announceDetail.reqst_start_date} ~ ${announceDetail.reqst_end_date ? announceDetail.reqst_end_date : '예산소진시 까지'}`
      }}
    </p>
    <p v-html="announceDetail.description" class="text-14 text-center px-4 medium"></p>

    <a
      v-if="announceDetail.print_file_path_name"
      :href="printFilePath"
      class="inline-block px-3 text-12 bold bg-gray-100 py-1 rounded-[0.5rem] shadow-custom"
      >{{ announceDetail.print_file_name }}</a
    >

    <div class="flex flex-col items-center">
      <h2 class="text-16 bold">신청 대상</h2>
      <li class="text-14 semibold mt-2">{{ announceDetail.taget_name }}</li>
    </div>

    <div class="flex flex-col items-center">
      <h2 class="text-16 bold">신청 및 접수</h2>
      <p class="text-12 medium whitespace-pre-line text-center mt-2">
        {{ announceDetail.how_to_register }}
      </p>
    </div>

    <div class="flex flex-col items-center gap-5">
      <div class="flex flex-col">
        <h2 class="text-16 bold text-center">제출 서류</h2>
        <li v-for="(document, i) in documents" :key="i" class="text-12 semibold mt-2 mx-10">
          {{ document }}
        </li>
      </div>
      <a
        v-if="announceDetail.file_path_name"
        :href="filePath"
        class="inline-block px-3 text-12 bold bg-gray-100 py-1 rounded-[0.5rem] shadow-custom"
        >{{ announceDetail.file_name }}</a
      >
    </div>

    <div class="flex flex-col items-center">
      <h2 class="text-16 bold">문의처</h2>
      <p class="text-12 semibold mt-2">{{ announceDetail.call_company }}</p>
    </div>

    <div class="flex flex-col items-center text-14 semibold">
      <h2>{{ announceDetail.author }}</h2>
      <p>{{ announceDetail.exc_InsttNm }}</p>
    </div>

    <p class="text-14 semibold mb-10">{{ `공고등록일: ${announceDetail.pub_date}` }}</p>
  </div>
</template>

<style scoped></style>
