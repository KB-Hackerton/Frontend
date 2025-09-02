<script setup>
import { ref, computed } from 'vue'
import BaseInput from '../common/BaseInput.vue'
import BaseButton from '../common/BaseButton.vue'

const emit = defineEmits(['complete'])

// 입력값 관리
const businessNum = ref('')
const ceoName = ref('')
const companyName = ref('')
const openDate = ref('')
const categoryMain = ref('')
const categoryMid = ref('')
const categorySub = ref('')
const address = ref('')
const addressDetail = ref('')
</script>

<template>
  <div class="flex flex-col gap-6 mt-5">
    <BaseInput
      id="businessNum"
      v-model="businessNum"
      label="사업자 등록번호"
      placeholder="사업자 등록번호를 입력해주세요."
      :required="true"
      description="- 없이 숫자만 기입하시기 바랍니다."
    />

    <BaseInput
      id="ceoName"
      v-model="ceoName"
      label="대표자 성명"
      placeholder="대표자 성명을 입력해주세요."
      :required="true"
      description="사업자 등록증의 성명과 동일해야 합니다."
    />

    <BaseInput
      id="companyName"
      v-model="companyName"
      label="상호명"
      placeholder="상호명을 입력해주세요."
      :required="true"
      description="사업자 등록증의 상호명과 동일해야 합니다."
    />

    <BaseInput
      id="openDate"
      v-model="openDate"
      type="date"
      label="개업일자"
      placeholder="YYYY-MM-DD"
      :required="true"
      description="사업자 등록증의 개업연월일과 동일해야 합니다."
    />

    <div>
      <label for="categoryMain" class="block font-semibold text-16 text-gray-300">
        업종 - 대분류 <span class="text-red">*</span>
      </label>
      <select
        id="categoryMain"
        v-model="categoryMain"
        class="w-full border-b py-2 text-16 outline-none"
      >
        <option>소매업</option>
        <option>음식점업</option>
        <option>보건의료업</option>
      </select>
    </div>

    <div>
      <label for="categoryMid" class="block font-semibold text-16 text-gray-300">
        업종 - 중분류 <span class="text-red">*</span>
      </label>
      <select
        id="categoryMid"
        v-model="categoryMid"
        class="w-full border-b py-2 text-16 outline-none"
      >
        <option>소매업</option>
        <option>음식점업</option>
        <option>보건의료업</option>
      </select>
    </div>

    <div>
      <label for="categorySub" class="block font-semibold text-16 text-gray-300">
        업종 - 소분류 <span class="text-red">*</span>
      </label>
      <select
        id="categorySub"
        v-model="categorySub"
        class="w-full border-b py-2 text-16 outline-none"
      >
        <option>소매업</option>
        <option>음식점업</option>
        <option>보건의료업</option>
      </select>
    </div>

    <div>
      <label for="address" class="block font-semibold text-16 text-gray-300">
        사업장 주소 <span class="text-red">*</span>
      </label>
      <div class="flex gap-2">
        <input
          id="address"
          v-model="address"
          type="text"
          placeholder="주소를 입력해주세요."
          class="flex-1 border-b border-gray-200 py-2 text-16 outline-none placeholder:text-gray-200"
        />
        <button
          type="button"
          class="w-20 h-8 font-bold text-10 flex items-center justify-center rounded-2xl border border-main bg-white text-main"
        >
          주소 찾기
        </button>
      </div>
    </div>

    <BaseInput
      id="addressDetail"
      v-model="addressDetail"
      label="사업장 상세 주소"
      placeholder="상세 주소를 입력해주세요."
    />

    <BaseButton color="main" class="mt-6" @click="emit('complete')">가입하기</BaseButton>
  </div>
</template>

<style scoped></style>
