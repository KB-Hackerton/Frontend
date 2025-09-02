<script setup>
import { RouterView } from 'vue-router'
import TopNavigationBar from '@/components/layouts/TopNavigationBar.vue'
import BottomNavigationBar from '@/components/layouts/BottomNavigationBar.vue'
</script>

<template>
  <div class="font-sans flex justify-center text-black w-full h-dvh overflow-hidden">
    <div class="relative w-full h-dvh md:max-w-[365px] flex flex-col overflow-hidden">
      <TopNavigationBar />

      <div class="pt-[56px] pb-[60px] flex-1 min-h-0 flex flex-col items-stretch overflow-hidden">
        <RouterView />
      </div>

      <BottomNavigationBar />
    </div>
  </div>
</template>
