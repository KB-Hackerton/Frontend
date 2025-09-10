<script setup>
defineProps({
  title: { type: String, default: '서울시 소상공인 마케팅 지원 사업' },
  target: { type: String, default: '서울 소재 소상공인, 창업 3년 미만' },
  support: { type: String, default: '온라인 광고비 최대 300만 원' },
  deadline: { type: String, default: '2025-09-30' },
  tags: {
    type: Array,
    default: () => ['#서울시', '#소매업', '#창업후기']
  }
})
</script>

<template>
  <div class="w-full max-w-md mx-auto">
    <!-- 상단 타이틀 -->
    <div class="flex items-center gap-2 mb-2">
      <span class="text-blue-500 text-xl">📢 AI가 골라준 맞춤 지원금</span>
    </div>

    <!-- 카드 -->
    <div class="bg-white rounded-2xl shadow-md p-4 border border-[#FFE1D0]">
      <h3 class="font-bold text-base mb-3">{{ title }}</h3>

      <div class="space-y-2 text-sm text-gray-700">
        <p class="flex items-center gap-2">
          <span class="text-gray-500">📍</span>
          <span>대상 {{ target }}</span>
        </p>
        <p class="flex items-center gap-2">
          <span class="text-gray-500">💰</span>
          <span>지원 {{ support }}</span>
        </p>
        <p class="flex items-center gap-2">
          <span class="text-gray-500">📅</span>
          <span>마감 {{ deadline }}</span>
        </p>
      </div>

      <!-- 태그 -->
      <div class="flex flex-wrap gap-2 mt-4">
        <span
          v-for="tag in tags"
          :key="tag"
          class="px-2 py-1 text-xs rounded-lg bg-blue-50 text-blue-600"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>
