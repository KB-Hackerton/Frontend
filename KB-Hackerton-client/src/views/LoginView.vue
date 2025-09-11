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
  auth.error = ''

  if (!email.value) {
    auth.error = '이메일을 입력해주세요.'
    return
  }
  if (!password.value) {
    auth.error = '비밀번호를 입력해주세요.'
    return
  }

  const ok = await auth.loginUser({ email: email.value, password: password.value })
  if (ok) router.replace('/')
}

function loginWithKakao() {
  const KAKAO_AUTH_URL =
    'https://kauth.kakao.com/oauth/authorize?client_id=be60204350fee47932696f434f86dae1&redirect_uri=https://gyeongsang-app.vercel.app/kakao-login&response_type=code'
  window.location.href = KAKAO_AUTH_URL
}
</script>

<template>
  <div class="w-full h-full bg-white p-3">
    <!-- 로고 -->
    <img
      :src="logoUrl"
      alt="경상났네 로고"
      class="block max-h-[280px] w-auto object-contain object-center mx-auto mt-3 mb-10"
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

      <p v-if="auth.error" role="alert" class="text-red font-bold text-10 -mt-2 mb-1">
        {{ auth.error }}
      </p>

      <BaseButton type="submit" color="main">
        {{ auth.loading ? '로그인 중...' : '로그인' }}
      </BaseButton>
    </form>

    <!-- 카카오 로그인 -->
    <BaseButton color="yellow" class="mt-4 bg-yellow text-black" @click="loginWithKakao"
      >카카오로 이용하기</BaseButton
    >

    <!-- 하단 링크 -->
    <nav class="mt-10 flex justify-center gap-3 text-16 text-black">
      <RouterLink to="/find-password">비밀번호 찾기</RouterLink>
      <span> · </span>
      <RouterLink to="/signup">회원가입</RouterLink>
    </nav>
  </div>
</template>

<style scoped></style>
