<script setup>
import FavoriteCard from '@/components/favorite/FavoriteCard.vue'
import announce from '@/_dummy/announce.json'

const favoriteAnnounceList = announce.filter((a) => a.is_favorite)
</script>

<template>
  <div
    class="mx-[-1rem] px-[1rem] text-center flex flex-col gap-5 mb-10 border-t border-[#FFE1D0] mt-[-1rem] pt-[1.5rem]"
  >
    <FavoriteCard
      v-for="announce in favoriteAnnounceList"
      :key="announce.announce_id"
      :favorite="announce"
    />
  </div>
</template>

<style scoped></style>
