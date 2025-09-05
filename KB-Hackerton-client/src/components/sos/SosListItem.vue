<script setup>
import { computed } from 'vue'

// Props & Emits
const props = defineProps({
  item: { type: Object, required: true },
})
const emit = defineEmits(['select'])

// Computed
const urgency = computed(() => {
  if (!props.item.expires_at) return { text: '보통', color: 'text-green' }

  const now = new Date()
  const end = new Date(props.item.expires_at)
  const diffMin = (end.getTime() - now.getTime()) / (1000 * 60)

  return diffMin <= 5 ? { text: '급함', color: 'text-red' } : { text: '보통', color: 'text-green' }
})
</script>

<template>
  <button type="button" class="w-full p-4 text-left" @click="$emit('select', item)">
    <div class="flex items-center gap-3">
      <img
        v-if="item.profile_image?.[0]?.profile_image_url"
        :src="item.profile_image[0].profile_image_url"
        alt="프로필"
        class="w-12 h-12 rounded-xl bg-gray-100 object-cover"
      />
      <div
        v-else
        class="w-12 h-12 rounded-xl flex items-center justify-center bg-gray-200 text-gray-300 text-12"
      >
        {{ item.typeLabel }}
      </div>

      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-2">
          <p class="truncate font-semibold text-14">
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

        <p class="mt-1 truncate text-14 text-gray-300">
          {{ item.sos_title }}
        </p>
      </div>
    </div>
  </button>
</template>
