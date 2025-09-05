<script setup>
const isClicked = defineModel({ isClicked: Boolean, default: false })
const emits = defineEmits(['click'])

const toggle = () => {
  isClicked.value = !isClicked.value
  emits('click')
}

const props = defineProps({
  label: String,
})
</script>

<template>
  <div class="flex items-center gap-2">
    <button
      @click="toggle"
      :class="[
        'relative inline-flex h-5 w-12 items-center rounded-full transition-colors duration-300',
        isClicked ? 'border border-2 border-main ' : ' border border-2 border-gray-300',
      ]"
    >
      <span
        :class="[
          'inline-block h-3 w-3 transform rounded-full  transition-transform duration-300',
          isClicked ? 'translate-x-7 bg-main' : 'translate-x-1 bg-gray-300',
        ]"
      />
    </button>
    <span
      v-if="props.label"
      :class="['caption2 medium text-12', isClicked ? 'text-main' : 'text-gray-400']"
    >
      {{ props.label }}
    </span>
  </div>
</template>
