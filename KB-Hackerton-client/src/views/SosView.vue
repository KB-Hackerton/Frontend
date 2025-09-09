<script setup>
import { ref, computed, onMounted } from 'vue'
import router from '@/router'
import { useSosStore } from '@/stores/sos'
import SosFilterBar from '@/components/sos/SosFilterBar.vue'
import KakaoMap from '@/components/sos/KakaoMap.vue'
import SosList from '@/components/sos/SosList.vue'
import SosDetail from '@/components/sos/SosDetail.vue'

const sosStore = useSosStore()

const sosItems = ref([])
const selectedCategories = ref(['전체'])
const selectedItem = ref(null)

const typeMap = { stock: '물품', labor: '인력', equipment: '고장', etc: '기타' }

const filteredList = computed(() => {
  const cats = selectedCategories.value
  if (cats.includes('전체')) return sosItems.value
  return sosItems.value.filter((item) => cats.includes(typeMap[item.sos_type]))
})

function goToCreate() {
  router.push('/sos/create')
}

async function handleSelect(item) {
  try {
    const detail = await sosStore.fetchDetail(item.sos_id)
    selectedItem.value = detail.data
    console.log('🟢 SOS 상세 불러오기 성공')
  } catch (e) {
    console.error('❌ SOS 상세 불러오기 실패', e)
  }
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

async function handleDelete(id) {
  try {
    await sosStore.deleteSos(id)
    console.log('🟢 SOS 삭제 성공')
    selectedItem.value = null // 상세창 닫기
    await fetchList() // 목록 다시 불러오기
  } catch (e) {
    console.error('❌ SOS 삭제 실패', e)
  }
}

async function fetchList() {
  try {
    const res = await sosStore.fetchList()
    sosItems.value = res
    console.log('🟢 SOS 목록 불러오기 성공')
  } catch (e) {
    console.error('❌ SOS 목록 불러오기 실패', e)
  }
}

onMounted(fetchList)
</script>

<template>
  <div class="relative h-full flex flex-col bg-white">
    <SosFilterBar v-if="!selectedItem" v-model:selected="selectedCategories" class="z-20" />

    <div class="absolute inset-0">
      <KakaoMap :items="filteredList" :selected="selectedItem" @select="handleSelect" />
    </div>

    <div
      class="absolute bottom-0 left-0 right-0 max-h-[50%] min-h-[50%] bg-white rounded-t-2xl p-4 z-[9] overflow-y-auto"
    >
      <template v-if="selectedItem">
        <SosDetail
          :item="selectedItem"
          :isOwner="true"
          @close="closeDetail"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </template>
      <template v-else>
        <div class="font-bold text-20 px-1">SOS 목록</div>
        <SosList :items="filteredList" @select="handleSelect" />
      </template>
    </div>

    <button
      v-if="!selectedItem"
      @click="goToCreate"
      class="absolute bottom-[52%] right-4 rounded-2xl px-4 py-2 bg-main text-white text-18 z-[10]"
    >
      +
    </button>
  </div>
</template>
