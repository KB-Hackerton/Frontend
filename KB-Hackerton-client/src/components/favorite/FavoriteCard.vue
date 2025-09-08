<script setup>
import { Icon } from '@iconify/vue'
import { computed, defineProps } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  favorite: {
    type: Object,
    required: true,
  },
})

function parseDate(yyyymmdd) {
  const yyyy = yyyymmdd.slice(0, 4)
  const mm = yyyymmdd.slice(4, 6)
  const dd = yyyymmdd.slice(6, 8)
  return new Date(`${yyyy}-${mm}-${dd}`)
}

const Dday = computed(() => {
  if (!props.favorite.reqst_end_date) return 'D-?'

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const end = parseDate(props.favorite.reqst_end_date)
  end.setHours(0, 0, 0, 0)

  const dday = Math.ceil((end - today) / (1000 * 60 * 60 * 24))

  if (dday === 0) return 'D-day'

  if (dday > 0) return `D-${dday}`

  return '마감'
})
</script>

<template>
  <RouterLink
    :to="{ name: 'announceDetail', params: { announce_id: props.favorite.announce_id } }"
    custom
    v-slot="{ navigate }"
  >
    <div
      class="bg-white rounded-xl h-[9.8rem] flex flex-col justify-between border border-[#FFE1D0] shadow-custom px-4 py-3 pt-5 hover:cursor-pointer"
      @click="navigate"
    >
      <div class="flex justify-between flex-col w-full h-full">
        <div class="flex gap-2 justify-between h-full w-full">
          <h1 class="text-[0.8rem] bold text-start">{{ props.favorite.announce_title }}</h1>

          <div class="flex items-start justify-center gap-2">
            <div
              class="flex items-center justify-center border border-gray-200 rounded-[0.5rem] h-[1.5rem] w-[1.5rem]"
            >
              <Icon icon="material-symbols:kid-star" class="w-[1.2rem] h-auto text-[#FFE599]" />
            </div>
            <div
              class="rounded-full text-12 whitespace-nowrap items-center flex px-[0.4rem] h-[1.2rem]"
              :class="
                Dday === '마감'
                  ? 'bg-gray-100 text-gray-300'
                  : Number(Dday.replace('D-', '')) <= 5
                    ? 'bg-[#FEF2F2] text-[#E80813]'
                    : 'bg-[#EFF6FF] text-[#155DFC]'
              "
            >
              <Icon icon="mingcute:time-line" class="w-[0.8rem] h-auto" />
              <p class="text-[0.6rem] semibold pl-[0.2rem]">{{ Dday }}</p>
            </div>
          </div>
        </div>

        <div class="flex items-end justify-between">
          <button
            class="text-12 w-[6rem] semibold text-white bg-[#E46212] rounded-full py-[0.35rem]"
          >
            서류 준비하기
          </button>

          <p class="text-12 medium whitespace-nowrap">{{ `서류 준비도: 60%(6/10) ` }}</p>
        </div>
      </div>
      <div class="h-[0.7rem] bg-[#FFE1D0] rounded-full mt-4 mb-1">
        <div class="h-[0.7rem] bg-gradient2 rounded-full" style="width: 65%"></div>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped></style>
