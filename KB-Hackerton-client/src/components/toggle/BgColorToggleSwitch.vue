<script setup>
const emits = defineEmits(['click'])

const toggle = () => {
  emits('click')
}

const props = defineProps({
  label: { type: String, required: false },
  isChecked: { type: Boolean, required: true },
})
</script>

<template>
  <div class="flex items-center gap-2">
    <button
      @click="toggle"
      :class="[
        'relative inline-flex h-[1.6rem] w-12 items-center rounded-full transition-colors duration-300',
        isChecked ? 'bg-orange-100 ' : ' bg-gray-200',
      ]"
    >
      <span
        :class="[
          'inline-block h-5 w-5 transform rounded-full  transition-transform duration-300 bg-white',
          isChecked ? 'translate-x-[1.6rem] ' : 'translate-x-[0.2rem] ',
        ]"
      />
    </button>
    <span
      v-if="props.label"
      :class="['caption2 medium text-12', isChecked ? 'text-main' : 'text-gray-400']"
    >
      {{ props.label }}
    </span>
  </div>
</template>
