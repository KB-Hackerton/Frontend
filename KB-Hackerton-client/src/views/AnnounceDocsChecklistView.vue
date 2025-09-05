<script setup>
import { useRouter } from 'vue-router'
import announceDocuments from '@/_dummy/announceDocuments'
import { computed, reactive, ref, watch } from 'vue'
import DocumentChecklistItem from '@/components/Document/DocumentChecklistItem.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const router = useRouter()

const src = announceDocuments.find(
  (d) => d.announce_id === Number(router.currentRoute.value.params.announce_id),
)

const checkList = reactive({
  ...src,
  documents: src?.documents ? src.documents.map((d) => ({ ...d })) : [],
})

const displayDocuments = reactive({
  ...src,
  documents: src?.documents ? src.documents.map((d) => ({ ...d })) : [],
})

function parseDate(yyyymmdd) {
  const yyyy = yyyymmdd.slice(0, 4)
  const mm = yyyymmdd.slice(4, 6)
  const dd = yyyymmdd.slice(6, 8)
  return new Date(`${yyyy}-${mm}-${dd}`)
}

const checkPercent = computed(() => {
  const total = checkList.documents.length
  const checked = checkList.documents.filter((item) => item.checked).length
  return Number((checked / total) * 100).toFixed(0)
})

// 애니메이션용 퍼센트 값 (텍스트/바 공용)
const displayPercent = ref(0)

// checkPercent가 변할 때 숫자/바가 부드럽게 보간되도록 rAF로 트윈
watch(
  checkPercent,
  (newVal, oldVal) => {
    const from = Number(oldVal ?? 0)
    const to = Number(newVal)
    const duration = 450 // ms
    let start

    const step = (ts) => {
      if (!start) start = ts
      const t = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic
      const value = from + (to - from) * eased
      displayPercent.value = Math.round(value)
      if (t < 1) requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  },
  { immediate: true },
)

const Dday = computed(() => {
  if (!checkList.reqst_end_date) return ''

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const end = parseDate(checkList.reqst_end_date)
  end.setHours(0, 0, 0, 0)

  const dday = Math.ceil((end - today) / (1000 * 60 * 60 * 24))

  if (dday === 0) return 'D-day'

  if (dday > 0) return `D-${dday}`

  return '마감'
})

const updatedCheckList = () => {
  //저장 버튼 클릭시 저장 API 연동

  checkList.documents.splice(
    0,
    checkList.documents.length,
    ...displayDocuments.documents.map((d) => ({ ...d })),
  )
}
</script>

<template>
  <div class="flex flex-col items-center justify-between h-full w-full">
    <div class="w-full">
      <h1 class="text-16 text-center bold px-8">{{ checkList.announce_title }}</h1>
      <p class="text-12 text-center semibold mt-5">
        {{
          `신청기간: ${checkList.reqst_start_date} ~ ${checkList.reqst_end_date ? checkList.reqst_end_date : '예산소진시 까지'} ${Dday === '' ? '' : `(${Dday})`}`
        }}
      </p>
      <div class="flex flex-col items-center mt-5">
        <p class="text-10 bold">{{ `서류 준비도: ${displayPercent}%` }}</p>
        <div class="w-[15rem] h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            class="h-3 bg-blue rounded-full transition-all duration-300 ease-out"
            :style="{ width: displayPercent + '%' }"
          ></div>
        </div>
      </div>
      <div class="flex flex-col gap-3 mt-5 w-full ml-6">
        <DocumentChecklistItem
          v-for="document in displayDocuments.documents"
          v-model="document.checked"
          :label="document.name"
          :key="document.id"
        />
      </div>
    </div>

    <BaseButton type="submit" color="main" class="w-full mb-6" @click="updatedCheckList"
      >저장</BaseButton
    >
  </div>
</template>

<style scoped></style>
