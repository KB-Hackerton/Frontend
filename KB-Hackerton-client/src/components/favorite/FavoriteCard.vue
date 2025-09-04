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
      class="bg-white rounded-xl h-[8rem] flex flex-col justify-between shadow-[0px_4px_8px_1px_rgba(0,0,0,0.22)] p-4 hover:cursor-pointer"
      @click="navigate"
    >
      <div class="flex justify-between gap-4">
        <h1 class="text-start text-12 semibold">{{ props.favorite.announce_title }}</h1>
        <div class="flex flex-col items-center">
          <Icon icon="material-symbols:kid-star" class="size-7 text-green" />
          <div
            class="w-[2.5rem] h-[1.1rem] text-10 semibold rounded-[5px] flex items-center justify-center text-white"
            :class="
              Dday === '마감'
                ? 'bg-gray-300'
                : Dday === 'D-day'
                  ? 'bg-red'
                  : Number(Dday.replace('D-', '')) <= 5
                    ? 'bg-red'
                    : 'bg-blue'
            "
          >
            {{ Dday }}
          </div>
        </div>
      </div>
      <div>
        <div class="flex items-center justify-between">
          <button
            class="flex items-center reqular text-14 bg-pink-100 text-white p-1 px-2 rounded-[7px]"
            @click.stop="$router.push('/')"
          >
            서류 준비하기
            <Icon icon="material-symbols:arrow-forward-ios-rounded" />
          </button>
          <div class="flex flex-col items-end">
            <p class="text-10 bold">서류 준비도: 65%</p>
            <div class="w-[10rem] h-2 bg-gray-200 rounded-full">
              <div class="h-2 bg-blue rounded-full" style="width: 65%"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped></style>
