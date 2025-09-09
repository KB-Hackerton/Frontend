<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSosStore } from '@/stores/sos'
import SosFilterBar from '@/components/sos/SosFilterBar.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseModal from '@/components/common/BaseModal.vue'

const router = useRouter()
const sosStore = useSosStore()

const selectedCategory = ref([])
const expiresAt = ref('')
const title = ref('')
const content = ref('')
const imageFiles = ref([])
const previewUrls = ref([])

const showSuccessModal = ref(false)
const showFailModal = ref(false)

const labelMap = { 물품: 'stock', 인력: 'labor', 고장: 'equipment', 기타: 'etc' }

// 현재 시간으로 기본값 설정
onMounted(() => {
  const now = new Date()
  const hh = String(now.getHours()).padStart(2, '0')
  const mm = String(now.getMinutes()).padStart(2, '0')
  expiresAt.value = `${hh}:${mm}`
})

function handleImageUpload(event) {
  const files = Array.from(event.target.files)
  for (const file of files) {
    if (imageFiles.value.length >= 3) {
      alert('사진은 최대 3장까지 업로드할 수 있습니다.')
      break
    }
    imageFiles.value.push(file)
    previewUrls.value.push(URL.createObjectURL(file))
  }
  event.target.value = ''
}

function removeImage(index) {
  imageFiles.value.splice(index, 1)
  URL.revokeObjectURL(previewUrls.value[index])
  previewUrls.value.splice(index, 1)
}

async function createSos() {
  if (!selectedCategory.value) {
    alert('요청 카테고리를 선택해주세요.')
    return
  }
  if (!title.value) {
    alert('요청 제목을 입력해주세요.')
    return
  }
  if (!content.value) {
    alert('요청 내용을 입력해주세요.')
    return
  }
  if (!expiresAt.value) {
    alert('종료 시각을 입력해주세요.')
    return
  }

  try {
    const res = await sosStore.createSos({
      sos_type: labelMap[selectedCategory.value[0]],
      expires_at: expiresAt.value,
      sos_title: title.value,
      sos_content: content.value,
      images: imageFiles.value,
    })
    console.log('🟢 SOS 생성 성공:', res)
    showSuccessModal.value = true
  } catch (e) {
    console.error('❌ SOS 생성 실패', e)
    showFailModal.value = true
  }
}

function goToList() {
  router.push('/sos')
}
</script>

<template>
  <div class="p-4 space-y-6">
    <div>
      <p class="mb-2 font-bold text-14 text-black">요청 카테고리</p>
      <SosFilterBar v-model:selected="selectedCategory" :showAll="false" :multiple="false" />
    </div>

    <div>
      <p class="mb-1 font-bold text-14 text-black">
        SOS 종료시각
        <span class="text-12 text-gray-300">(최대 오늘 자정까지만 가능합니다)</span>
      </p>
      <input type="time" v-model="expiresAt" class="w-32 p-2 border rounded" />
    </div>

    <!-- 요청 제목 -->
    <div>
      <p class="mb-1 font-bold text-14 text-black">요청 제목</p>
      <input
        v-model="title"
        type="text"
        maxlength="30"
        placeholder="제목을 입력하세요"
        class="w-full p-2 border rounded"
      />
    </div>

    <!-- 요청 내용 -->
    <div>
      <p class="mb-1 font-bold text-14 text-black">
        요청 내용
        <span class="text-12 text-gray-300">(최대 100자)</span>
      </p>
      <textarea
        v-model="content"
        maxlength="100"
        rows="4"
        placeholder="내용을 입력하세요"
        class="w-full border rounded p-2"
      ></textarea>
    </div>

    <div>
      <p class="mb-1 font-bold text-14 text-black">
        사진
        <span class="text-12 text-gray-300">(최대 3장)</span>
      </p>
      <div class="flex items-center gap-3 flex-wrap">
        <label
          v-if="imageFiles.length < 3"
          for="image-upload"
          class="w-24 h-24 flex items-center justify-center border rounded-lg text-2xl text-gray-400 cursor-pointer"
        >
          +
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          multiple
          class="hidden"
          @change="handleImageUpload"
        />

        <div v-for="(url, index) in previewUrls" :key="index" class="relative">
          <img :src="url" alt="업로드된 이미지" class="w-24 h-24 rounded-lg border object-cover" />
          <button
            type="button"
            class="absolute top-1 right-1 w-5 h-5 flex items-center justify-center rounded-full bg-black bg-opacity-50 text-white text-12"
            @click="removeImage(index)"
          >
            ✕
          </button>
        </div>
      </div>
    </div>

    <BaseButton class="mt-6" @click="createSos">생성하기</BaseButton>
  </div>

  <BaseModal
    :show="showSuccessModal"
    title="SOS 생성 완료"
    message="정상적으로 SOS가 등록되었습니다.&#10; 목록 화면으로 이동합니다."
    confirmText="확인"
    @confirm="goToList"
    @close="goToList"
  />

  <BaseModal
    :show="showFailModal"
    title="SOS 생성 실패"
    message="SOS 등록에 실패했습니다.&#10; 다시 시도해주세요."
    confirmText="닫기"
    @confirm="showFailModal = false"
    @close="showFailModal = false"
  />
</template>
