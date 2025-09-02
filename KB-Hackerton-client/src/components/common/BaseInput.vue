<script setup>
defineProps({
  id: String,
  type: { type: String, default: 'text' },
  modelValue: String,
  placeholder: String,
  autocomplete: String,
  label: String,
})
defineEmits(['update:modelValue'])
</script>

<template>
  <div>
    <label :for="id" class="block text-16 text-gray-300">{{ label }}</label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      class="w-full border-b border-gray-200 py-2 text-16 outline-none placeholder:text-gray-200"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>
