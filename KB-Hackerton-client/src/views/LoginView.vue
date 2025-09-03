<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import logoUrl from '@/assets/images/svg/mainLogo.svg?url'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')

async function onSubmit() {
  const ok = await auth.loginUser(email.value, password.value)
  if (ok) {
    router.replace('/') // 로그인 성공 → 홈으로 이동
  }
}
</script>

<template>
  <div class="w-full h-full bg-white p-3">
    <!-- 로고 -->
    <img
      :src="logoUrl"
      alt="경상났네 로고"
      class="block h-[280px] w-auto object-contain object-center mx-auto mt-3 mb-10"
    />

    <!-- 로그인 폼 -->
    <form class="flex flex-col gap-6" @submit.prevent="onSubmit">
      <BaseInput
        id="email"
        v-model="email"
        type="email"
        label="이메일"
        placeholder="이메일을 입력해주세요."
        autocomplete="email"
      />

      <BaseInput
        id="password"
        v-model="password"
        type="password"
        label="비밀번호"
        placeholder="비밀번호를 입력해 주세요."
        autocomplete="current-password"
      />

      <p v-if="auth.error" class="text-red font-bold text-10 -mt-2 mb-1">{{ auth.error }}</p>

      <BaseButton type="submit" color="main">
        {{ auth.loading ? '로그인 중...' : '로그인' }}
      </BaseButton>
    </form>

    <!-- 카카오 로그인 -->
    <BaseButton color="yellow" class="mt-4 bg-yellow text-black">카카오로 이용하기</BaseButton>

    <!-- 하단 링크 -->
    <nav class="mt-10 flex justify-center gap-3 text-16 text-black">
      <RouterLink to="/find-password">비밀번호 찾기</RouterLink>
      <span> · </span>
      <RouterLink to="/signup">회원가입</RouterLink>
    </nav>
  </div>
</template>

<style scoped></style>
