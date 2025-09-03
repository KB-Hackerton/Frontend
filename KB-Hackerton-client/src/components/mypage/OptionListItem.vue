<script setup>
import { Icon } from '@iconify/vue'

const props = defineProps({
  to: { type: String, default: null }, // 라우터 경로
  icon: { type: String, required: true }, // 아이콘
  label: { type: String, required: true }, // 텍스트
  showArrow: { type: Boolean, default: true }, // 오른쪽 화살표
  danger: { type: Boolean, default: false }, // 빨간색 강조 여부
  onClick: { type: Function, default: null }, // 클릭 이벤트 핸들러
})
</script>

<template>
  <div>
    <router-link v-if="to" :to="to" class="flex items-center justify-between p-4">
      <div class="flex items-center gap-3">
        <Icon :icon="icon" class="w-5 h-5" :class="danger ? 'text-red' : 'text-black'" />
        <span class="text-16" :class="danger ? 'text-red' : 'text-black'">{{ label }}</span>
      </div>
      <Icon v-if="showArrow" icon="icon-park-outline:right" class="w-4 h-4 text-black" />
    </router-link>

    <button v-else @click="onClick" class="flex items-center justify-between p-4 w-full text-left">
      <div class="flex items-center gap-3">
        <Icon :icon="icon" class="w-5 h-5" :class="danger ? 'text-red' : 'text-black'" />
        <span class="text-16" :class="danger ? 'text-red' : 'text-black'">{{ label }}</span>
      </div>
      <Icon v-if="showArrow" icon="icon-park-outline:right" class="w-4 h-4 text-black" />
    </button>
  </div>
</template>
