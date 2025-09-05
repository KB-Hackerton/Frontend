<script setup>
import { ref, onMounted } from 'vue'
import SosFilterBar from '@/components/sos/SosFilterBar.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const selectedCategory = ref('')
const expiresAt = ref('')
const content = ref('')
const imageFiles = ref([])

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
    imageFiles.value.push(URL.createObjectURL(file))
  }
  event.target.value = '' // 같은 파일 다시 선택 가능하도록 초기화
}

function removeImage(index) {
  imageFiles.value.splice(index, 1)
}

function createSos() {
  if (!content.value) {
    alert('요청 내용을 입력해주세요.')
    return
  }

  const today = new Date()
  const [hh, mm] = expiresAt.value.split(':')
  const expireDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hh, mm)

  if (expireDate < today) {
    alert('현재 시간 이후로만 설정할 수 있습니다.')
    return
  }

  const newSos = {
    sos_id: Date.now(),
    sos_type: selectedCategory.value,
    expires_at: expireDate.toISOString(),
    sos_content: content.value,
    sos_image: [...imageFiles.value],
  }

  console.log('생성된 SOS:', newSos)
  alert('SOS가 등록되었습니다! (프론트 전용)')
}
</script>

<template>
  <div class="p-4 space-y-6">
    <!-- 요청 카테고리 -->
    <div>
      <p class="font-bold text-14 text-black mb-2">요청 카테고리</p>
      <!-- SosFilterBar에서 전체 옵션 제거한 버전 사용 -->
      <SosFilterBar v-model:selected="selectedCategory" :showAll="false" :multiple="false" />
    </div>

    <!-- SOS 종료시간 -->
    <div>
      <p class="font-bold text-14 text-black mb-1">
        SOS 종료시각 <span class="text-12 text-gray-300">(최대 오늘 자정까지만 가능합니다)</span>
      </p>
      <input type="time" v-model="expiresAt" class="border rounded p-2 w-32" />
    </div>

    <!-- 요청 내용 -->
    <div>
      <p class="font-bold text-14 text-black mb-1">
        요청 내용 <span class="text-12 text-gray-300">(최대 100자)</span>
      </p>
      <textarea
        v-model="content"
        maxlength="100"
        rows="4"
        placeholder="내용을 입력하세요"
        class="w-full border rounded p-2"
      ></textarea>
    </div>

    <!-- 사진 업로드 -->
    <div>
      <p class="font-bold text-14 text-black mb-1">
        사진 <span class="text-12 text-gray-300">(최대 3장)</span>
      </p>
      <div class="flex items-center gap-3 flex-wrap">
        <!-- 추가 버튼 -->
        <label
          v-if="imageFiles.length < 3"
          for="image-upload"
          class="w-24 h-24 border rounded-lg flex items-center justify-center text-2xl text-gray-400 cursor-pointer"
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

        <!-- 업로드된 이미지 목록 -->
        <div v-for="(img, index) in imageFiles" :key="index" class="relative">
          <img :src="img" alt="업로드된 이미지" class="w-24 h-24 object-cover rounded-lg border" />
          <button
            type="button"
            class="absolute top-1 right-1 bg-black bg-opacity-50 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            @click="removeImage(index)"
          >
            ✕
          </button>
        </div>
      </div>
    </div>

    <!-- 등록 버튼 -->
    <BaseButton class="mt-6" @click="createSos"> 등록하기 </BaseButton>
  </div>
</template>
