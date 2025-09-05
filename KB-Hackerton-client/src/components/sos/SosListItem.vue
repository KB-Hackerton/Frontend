<script setup>
import { computed } from 'vue'

const props = defineProps({
  item: { type: Object, required: true },
})

const emit = defineEmits(['select'])

const urgency = computed(() => {
  if (!props.item.expires_at) return { text: '보통', color: 'text-green' }

  const now = new Date()
  const end = new Date(props.item.expires_at)
  const diffMin = (end.getTime() - now.getTime()) / (1000 * 60)

  if (diffMin <= 5) {
    return { text: '급함', color: 'text-red' }
  }
  return { text: '보통', color: 'text-green' }
})
</script>

<template>
  <button
    type="button"
    class="w-full text-left p-4 hover:bg-gray-50"
    @click="$emit('select', item)"
  >
    <div class="flex items-center gap-3">
      <img
        v-if="item.profile_image?.[0]?.profile_image_url"
        :src="item.profile_image[0].profile_image_url"
        alt="프로필"
        class="w-12 h-12 rounded-xl object-cover bg-gray-100"
      />
      <div
        v-else
        class="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center text-gray-500 text-12"
      >
        {{ item.typeLabel }}
      </div>

      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2">
          <p class="font-semibold text-[14px] truncate">
            {{ item.business?.business_nm }}
          </p>
          <span class="text-12">
            <span :class="urgency.color">
              {{ urgency.text }}
            </span>
            ·
            {{ item.typeLabel }}
          </span>
        </div>

        <p class="mt-1 text-14 text-gray-300 truncate">
          {{ item.sos_title }}
        </p>
      </div>
    </div>
  </button>
</template>
