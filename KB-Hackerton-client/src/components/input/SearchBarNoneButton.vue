<script setup>
import { Icon } from '@iconify/vue'
import { defineEmits } from 'vue'

const emit = defineEmits(['search'])
const searched = defineModel('searched')
const props = defineProps({
  placeholder: { type: String, default: '검색어를 입력해주세요', required: false },
})
</script>

<template>
  <div class="flex gap-2 h-full w-full">
    <div
      class="flex items-center border border-gray-200 rounded-[7px] h-[2rem] gap-2 flex-1 bg-white shadow"
    >
      <Icon icon="material-symbols:search-rounded" class="size-6 ml-2" />
      <input
        type="text"
        :placeholder="props.placeholder"
        v-model.trim="searched"
        class="w-full rounded-xl h-full pl-[2px] text-14 medium placeholder:text-gray-300"
        style="outline: none; border: none; box-shadow: none"
        @keyup.enter="emit('search')"
      />
      <Icon
        v-if="searched"
        icon="material-symbols:close-rounded"
        class="size-6 mr-2"
        @click="((searched = ''), emit('search'))"
      />
    </div>
  </div>
</template>

<style scoped></style>
