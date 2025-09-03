<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed } from 'vue'

const props = defineProps({
  filter: { type: String, default: 'ALL' },

  options: {
    type: Array,
    default: () => [
      { label: '전체', value: '전체' },
      { label: '금융', value: '금융' },
      { label: '기술', value: '기술' },
      { label: '인력', value: '인력' },
      { label: '수출', value: '수출' },
      { label: '내수', value: '내수' },
      { label: '창업', value: '창업' },
      { label: '경영', value: '경영' },
      { label: '기타', value: '기타' },
      { label: '축제', value: '축제' },
    ],
  },
})

const emit = defineEmits(['update:filter'])
const open = ref(false)

const currentLabel = computed(() => {
  return props.options.find((o) => o.value === props.filter)?.label ?? '전체'
})
</script>

<template>
  <div>
    <button
      class="flex items-center gap-1 w-[5rem] h-[1.8rem] bg-main rounded-[8px] px-2 shadow-custom"
      @click="open = !open"
    >
      <span class="bold text-12 text-white flex-1">{{ currentLabel }}</span>
      <Icon
        v-if="!open"
        icon="material-symbols:keyboard-arrow-down-rounded"
        class="w-6 h-6 text-white"
      />
      <Icon
        v-else
        icon="material-symbols:keyboard-arrow-down-rounded"
        class="w-6 h-6 text-white rotate-180"
      />
    </button>

    <Transition
      enter-active-class="transition ease-out duration-150"
      enter-from-class="opacity-0 -translate-y-2 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition ease-in duration-120"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 -translate-y-2 scale-95"
    >
      <div
        v-if="open"
        class="absolute bg-main w-[5rem] rounded-[8px] z-50 pb-3 origin-top transform-gpu shadow-custom"
      >
        <div
          v-for="option in options"
          :key="option.value"
          class="py-1 hover:bg-green hover:rounded-[8px] cursor-pointer pl-4"
          @click="(emit('update:filter', option.value), (open = false))"
        >
          <span class="bold text-12 text-white">{{ option.label }}</span>
        </div>
      </div>
    </Transition>
  </div>
</template>
