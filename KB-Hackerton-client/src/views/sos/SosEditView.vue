<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSosStore } from '@/stores/sos'
import SosFilterBar from '@/components/sos/SosFilterBar.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseModal from '@/components/common/BaseModal.vue'

const route = useRoute()
const router = useRouter()
const sosStore = useSosStore()

const selectedCategory = ref([])
const expiresAt = ref('')
const title = ref('')
const content = ref('')
const imageFiles = ref([]) // 실제 File 객체
const previewUrls = ref([]) // 미리보기 URL

const showSuccessModal = ref(false)
const showFailModal = ref(false)

const typeMap = { stock: '물품', labor: '인력', equipment: '고장', etc: '기타' }
const labelMap = Object.fromEntries(Object.entries(typeMap).map(([k, v]) => [v, k]))

// 초기값 세팅
onMounted(async () => {
  try {
    const res = await sosStore.fetchDetail(route.params.id)
    console.log('🟢 SOS 상세 조회 성공', res)

    const data = res.data

    selectedCategory.value = [typeMap[data.sos_type]]
    title.value = data.sos_title
    content.value = data.sos_content

    if (data.expires_at) {
      const date = new Date(data.expires_at)
      const hh = String(date.getHours()).padStart(2, '0')
      const mm = String(date.getMinutes()).padStart(2, '0')
      expiresAt.value = `${hh}:${mm}`
    }

    previewUrls.value = data.image_keys || []
  } catch (e) {
    console.error('❌ 상세 조회 실패', e)
  }
})

// 이미지 업로드
function handleImageUpload(event) {
  const files = Array.from(event.target.files)
  for (const file of files) {
    if (imageFiles.value.length + previewUrls.value.length >= 3) {
      alert('사진은 최대 3장까지 업로드할 수 있습니다.')
      break
    }
    imageFiles.value.push(file)
    previewUrls.value.push(URL.createObjectURL(file))
  }
  event.target.value = ''
}

function removeImage(index) {
  previewUrls.value.splice(index, 1)
  if (imageFiles.value[index]) {
    imageFiles.value.splice(index, 1)
  }
}

// 수정 요청
async function editSos() {
  if (!title.value || !content.value) {
    alert('제목과 내용을 입력해주세요.')
    return
  }

  try {
    const res = await sosStore.updateSos(route.params.id, {
      sos_type: labelMap[selectedCategory.value[0]],
      expires_at: expiresAt.value, // HH:mm 그대로
      sos_title: title.value,
      sos_content: content.value,
      images: imageFiles.value, // 새로 업로드한 파일들
    })

    console.log('🟢 SOS 수정 성공:', res)
    showSuccessModal.value = true
  } catch (e) {
    console.error('❌ SOS 수정 실패', e)
    showFailModal.value = true
  }
}

function goToList() {
  showSuccessModal.value = false
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
      <input type="time" v-model="expiresAt" class="w-32 border rounded p-2" />
    </div>

    <div>
      <p class="mb-1 font-bold text-14 text-black">요청 제목</p>
      <input
        v-model="title"
        type="text"
        maxlength="30"
        placeholder="제목을 입력하세요"
        class="w-full border rounded p-2"
      />
    </div>

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
      <p class="font-bold text-14 text-black mb-1">
        사진
        <span class="text-12 text-gray-300">(최대 3장)</span>
      </p>
      <div class="flex flex-wrap items-center gap-3">
        <label
          v-if="previewUrls.length < 3"
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

    <BaseButton class="mt-6" @click="editSos">수정하기</BaseButton>
  </div>

  <BaseModal
    :show="showSuccessModal"
    title="SOS 수정 완료"
    message="정상적으로 SOS가 수정되었습니다.&#10; 목록 화면으로 이동합니다."
    confirmText="확인"
    @confirm="goToList"
    @close="goToList"
  />

  <BaseModal
    :show="showFailModal"
    title="SOS 수정 실패"
    message="SOS 수정에 실패했습니다.&#10; 다시 시도해주세요."
    confirmText="닫기"
    @confirm="showFailModal = false"
    @close="showFailModal = false"
  />
</template>
