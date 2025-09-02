<script setup>
import logoUrl from '@/assets/images/svg/mainLogo.svg?url'
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
    <form class="flex flex-col gap-8">
      <div>
        <label for="email" class="block text-16 text-gray-300">이메일</label>
        <input
          id="email"
          type="email"
          placeholder="이메일을 입력해 주세요."
          class="w-full border-b border-gray-200 py-2 text-16 outline-none placeholder:text-gray-200"
        />
      </div>

      <div>
        <label for="password" class="block text-16 text-gray-300">비밀번호</label>
        <input
          id="password"
          type="password"
          placeholder="비밀번호를 입력해 주세요."
          class="w-full border-b border-gray-200 py-2 text-16 outline-none placeholder:text-gray-200"
        />
      </div>

      <button
        type="submit"
        class="mx-auto w-[340px] h-[40px] bg-main text-white rounded-xl font-bold text-20 mt-2"
      >
        로그인
      </button>
    </form>

    <!-- 카카오 로그인 -->
    <button
      type="button"
      class="mx-auto w-[340px] h-[40px] bg-yellow text-black rounded-xl font-bold text-20 mt-4 flex items-center justify-center"
    >
      카카오로 이용하기
    </button>

    <!-- 하단 링크 -->
    <nav class="mt-10 flex justify-center gap-3 text-16 text-black">
      <RouterLink to="/find-password">비밀번호 찾기</RouterLink>
      <span> · </span>
      <RouterLink to="/signup">회원가입</RouterLink>
    </nav>
  </div>
</template>

<style scoped></style>
