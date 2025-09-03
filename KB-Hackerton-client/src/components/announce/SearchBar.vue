<script setup>
import { Icon } from '@iconify/vue'
import { defineEmits } from 'vue'

const emit = defineEmits(['search'])
const searched = defineModel('searched')
</script>

<template>
  <div class="flex gap-2 h-full w-full">
    <div class="flex items-center border border-black rounded-[7px] h-[1.8rem] gap-2 flex-1">
      <Icon icon="material-symbols:search-rounded" class="size-6 ml-2" />
      <input
        type="text"
        placeholder="검색어를 입력해주세요"
        v-model.trim="searched"
        class="w-full rounded-xl h-full pl-[2px] text-14 medium"
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
    <button
      class="h-[1.8rem] w-[2.5rem] border border-black rounded-[7px] text-14 memdium"
      @click="emit('search')"
    >
      검색
    </button>
  </div>
</template>

<style scoped></style>
