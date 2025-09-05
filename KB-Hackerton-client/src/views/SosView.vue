<script setup>
import { ref, computed } from 'vue'
import router from '@/router'
import SosFilterBar from '@/components/sos/SosFilterBar.vue'
import KakaoMap from '@/components/sos/KakaoMap.vue'
import SosList from '@/components/sos/SosList.vue'
import SosDetail from '@/components/sos/SosDetail.vue'
import sosData from '@/_dummy/sos.json'

// State
const sosItems = ref(sosData)
const selectedCategories = ref(['전체'])
const selectedItem = ref(null)

// Category Mapping
const typeMap = {
  stock: '물품',
  labor: '인력',
  equipment: '고장',
  etc: '기타',
}

// Computed
const filteredList = computed(() => {
  const cats = selectedCategories.value
  if (cats.includes('전체')) return sosItems.value
  return sosItems.value.filter((item) => cats.includes(typeMap[item.sos_type]))
})

// Handlers
function goToCreate() {
  router.push('/sos/create')
}

function handleSelect(item) {
  selectedItem.value = item
}

function closeDetail() {
  selectedItem.value = null
}

function handleEdit(item) {
  router.push({
    name: 'sos-edit',
    params: { id: item.sos_id },
    state: { item },
  })
}
</script>

<template>
  <div class="relative h-full flex flex-col bg-white">
    <SosFilterBar v-if="!selectedItem" v-model:selected="selectedCategories" class="z-20" />

    <div class="absolute inset-0">
      <KakaoMap :items="filteredList" :selected="selectedItem" @select="handleSelect" />
    </div>

    <div
      class="absolute bottom-0 left-0 right-0 max-h-[50%] min-h-[50%] bg-white rounded-t-2xl p-4 z-[999] overflow-y-auto"
    >
      <template v-if="selectedItem">
        <SosDetail :item="selectedItem" :isOwner="true" @close="closeDetail" @edit="handleEdit" />
      </template>
      <template v-else>
        <div class="font-bold text-20 px-1">SOS 목록</div>
        <SosList :items="filteredList" @select="handleSelect" />
      </template>
    </div>

    <button
      v-if="!selectedItem"
      @click="goToCreate"
      class="absolute bottom-[52%] right-4 rounded-2xl px-4 py-2 bg-main text-white text-18 z-[1000]"
    >
      +
    </button>
  </div>
</template>
