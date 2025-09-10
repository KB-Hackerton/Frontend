<script setup>
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  title: { type: String, default: '인기 지원 사업' },
  items: {
    type: Array,
  },
  limit: { type: Number, default: 3 },
})

const TONES = [
  { card: 'bg-[#FFFBEA]', badge: 'bg-[#F3C562] text-white' }, // Gold
  { card: 'bg-[#EDEDED]', badge: 'bg-[#BDBDBD] text-white' }, // Silver
  { card: 'bg-[#F6B3A0]', badge: 'bg-[#E06C4E] text-white' }, // Bronze
]

const list = computed(() =>
  props.items.slice(0, props.limit).map((it, idx) => ({
    ...it,
    rank: idx + 1,
    tone: TONES[idx] ?? { card: 'bg-white', badge: 'bg-gray-300 text-gray-800' },
  })),
)
</script>

<template>
  <!-- 제목은 카드 밖 -->
  <h3 class="p-6 text-[18px] font-bold">{{ title }}</h3>

  <!-- 카드: 리스트만 감싸기 -->
  <section
    class="max-w-lg mx-auto bg-white rounded-xl shadow-md p-5 border border-[#FFE1D0] mb-2 mx-4"
  >
    <ul class="space-y-2">
      <li
        v-for="item in list"
        :key="item.announceId"
        class="rounded-lg px-3 py-2 relative shadow-md"
        :class="item.tone.card"
      >
        <div class="flex items-center justify-between">
          <!-- 왼쪽: 랭킹 배지 + 제목 -->
          <div class="flex items-center gap-2 min-w-0">
            <div
              class="w-6 h-6 flex items-center justify-center rounded-full text-[12px] font-bold shrink-0"
              :class="item.tone.badge"
            >
              {{ item.rank }}
            </div>
            <p class="text-[13px] font-medium text-gray-800 truncate">
              {{ item.announceTitle }}
            </p>
          </div>

          <!-- 오른쪽: 조회수 -->
          <div class="flex items-center gap-1 shrink-0 text-[11px] text-gray-600">
            <Icon icon="mdi:eye-outline" class="w-3.5 h-3.5" />
            <span>{{ item.viewNum }} 명</span>
          </div>
        </div>
      </li>
    </ul>
  </section>
</template>
