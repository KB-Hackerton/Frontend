<script setup>
import DropdownFilter from '@/components/calendar/DropdownFilter.vue'
import NotificationCard from '@/components/notification/NotificationCard.vue'
import notification from '@/_dummy/notification'
import { computed, ref } from 'vue'
import NotificationModal from '@/components/modal/NotificationModal.vue'

const displayNotificationList = computed(() => {
  return notification
})

const isModal = ref(false)
const modalData = ref(null)

const openModal = (notification) => {
  isModal.value = true
  modalData.value = notification
}

const isReadNotification = (notification) => {
  notification.is_read = true
  isModal.value = false
  //api 연동 하면서 나머지 로직 만들기
}

const goDetail = (notification) => {
  isModal.value = false
  //api 연동 하면서 로직 만들기
  //알림 관련 페이지로 이동
}

const notificationDelete = (notification) => {
  //api 연동 하면서 로직 만들기
  //알림 삭제
}

const notificationAllDelete = () => {
  //api 연동 하면서 로직 만들기
  //알림 전체 삭제
}

const notificationAllRead = () => {
  //api 연동 하면서 로직 만들기
  //전체읽음 처리
}
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <div class="flex justify-between">
      <DropdownFilter
        :options="[
          { value: 'sos', label: 'SOS' },
          { value: 'announce', label: '공고' },
        ]"
      />
      <button
        class="text-10 semibold text-white bg-main rounded-[10px] px-4 py-1 shadow-custom"
        @click="notificationAllRead"
      >
        전체읽음 처리
      </button>
    </div>

    <div class="overflow-scroll [&::-webkit-scrollbar]:hidden mt-3">
      <NotificationCard
        v-for="notification in displayNotificationList"
        :notification="notification"
        :key="notification.notification_id"
        @click="openModal(notification)"
        @delete="notificationDelete(notification)"
      />
    </div>

    <button
      class="fixed bottom-[100px] right-[0.8rem] text-10 semibold text-white bg-main rounded-[12px] px-4 py-2 shadow-custom z-[50]"
      @click="notificationAllDelete"
    >
      알림 전체 삭제
    </button>
    <div v-if="isModal" class="fixed inset-0 bg-gray-300/65 z-[90]" @click="isModal = false"></div>

    <NotificationModal
      v-if="isModal"
      @close="isReadNotification(notification)"
      @click="goDetail(notification)"
      class="z-[100] fixed top-1/3 left-1/2 -translate-x-1/2"
      :notification="modalData"
    />
  </div>
</template>

<style scoped></style>
