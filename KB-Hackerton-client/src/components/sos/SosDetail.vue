<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '../common/BaseButton.vue'
import SosDelete from '@/components/sos/SosDelete.vue'

// Router
const router = useRouter()

// Props & Emits
const props = defineProps({
  item: { type: Object, required: true },
  isOwner: { type: Boolean, default: true }, // 내가 올린 SOS인지 여부
})
const emit = defineEmits(['close', 'chat', 'edit', 'delete'])

// State
const showDeleteModal = ref(false)

// Type Mapping
const typeMap = { stock: '물품', labor: '인력', equipment: '고장', etc: '기타' }
const typeLabel = computed(() => typeMap[props.item.sos_type] ?? '기타')

// Computed
const expireTime = computed(() => {
  if (!props.item.expires_at) return ''
  const date = new Date(props.item.expires_at)
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
})

const urgency = computed(() => {
  if (!props.item.expires_at) return { text: '보통', color: 'text-green' }

  const now = new Date()
  const end = new Date(props.item.expires_at)
  const diffMin = (end.getTime() - now.getTime()) / (1000 * 60)

  return diffMin <= 5 ? { text: '급함', color: 'text-red' } : { text: '보통', color: 'text-green' }
})

// Methods
function goToEdit(item) {
  router.push({ name: 'sos-edit', params: { id: item.sos_id } })
}

function handleDelete() {
  console.log('삭제 진행!')
  showDeleteModal.value = false
}
</script>

<template>
  <div class="space-y-2 px-1">
    <div class="flex justify-between items-start">
      <div class="flex items-end gap-2">
        <h2 class="text-20 font-bold">{{ item.business?.business_nm }}</h2>
        <span v-if="item.member?.badge" class="font-medium text-12 text-gradient">
          {{ item.member?.badge }}
        </span>
      </div>
      <button @click="$emit('close')" class="text-gray-400">✕</button>
    </div>

    <div class="space-y-1">
      <p class="text-12 text-gray-300">소분류 · 나와의 거리 : 900m</p>
      <p class="text-14 text-black">
        {{ item.business?.business_addr }} {{ item.business?.business_addr_detail }}
      </p>
    </div>

    <div>
      <div class="mb-2 flex items-end">
        <p class="font-bold text-20">내용</p>
        <p class="ml-2 text-12 text-gray-300">채팅 중 (3건)</p>
      </div>

      <div>
        <p class="text-14 text-gray-300">
          <span :class="urgency.color">{{ urgency.text }}</span> · {{ typeLabel }} · 오늘
          {{ expireTime }} 까지
        </p>
      </div>

      <div class="font-medium mt-2 text-14 text-black">
        <p>제목: {{ item.sos_title }}</p>
        <p>내용: {{ item.sos_content }}</p>
      </div>
    </div>

    <div v-if="item.sos_image?.length" class="flex gap-2 overflow-x-auto">
      <img
        v-for="img in item.sos_image"
        :key="img.sos_image_id"
        :src="img.storage_key"
        alt="sos 이미지"
        class="w-24 h-24 rounded-lg object-cover"
      />
    </div>

    <div v-if="isOwner" class="mt-6 flex gap-3">
      <BaseButton color="gray" class="flex-1" @click="showDeleteModal = true">삭제하기</BaseButton>
      <BaseButton class="flex-1" @click="goToEdit(item)">수정하기</BaseButton>
    </div>
    <BaseButton v-else class="mt-6" @click="$emit('chat', item)"> 채팅하기 </BaseButton>
  </div>

  <SosDelete :show="showDeleteModal" @close="showDeleteModal = false" @confirm="handleDelete" />
</template>
