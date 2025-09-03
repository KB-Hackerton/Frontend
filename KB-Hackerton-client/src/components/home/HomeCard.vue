<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  title: { type: String, required: true },
  dday: { type: [Number, String], default: null },
  buttonText: { type: String, default: '상세보기' },
  link: { type: String, required: true },
})

const router = useRouter()

function goDetail() {
  router.push(props.link)
}
</script>

<template>
  <div
    class="w-[110px] h-[120px] bg-gray-100 rounded-xl shadow-md mb-2 p-3 flex flex-col justify-between"
  >
    <div v-if="dday !== null" class="text-12 text-main">D-{{ dday }}</div>
    <div v-else>🎊</div>
    <p class="text-10 text-black mt-2 flex-1">
      {{ title }}
    </p>

    <!-- 버튼 -->
    <button
      type="button"
      class="w-[80px] h-[20px] bg-main text-8 text-white rounded-xl self-center"
      @click="goDetail"
    >
      {{ buttonText }}
    </button>
  </div>
</template>
