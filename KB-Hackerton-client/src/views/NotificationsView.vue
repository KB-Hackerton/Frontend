<script setup>
import NotificationCard from '@/components/notification/NotificationCard.vue'
import { computed, onMounted, ref } from 'vue'
import NotificationModal from '@/components/modal/NotificationModal.vue'
import RoundedDropdownFilter from '@/components/common/RoundedDropdownFilter.vue'
import { useNotificationStore } from '@/stores/notification'
import { storeToRefs } from 'pinia'
import ErrorModal from '@/components/error/ErrorModal.vue'
import { Icon } from '@iconify/vue'

const notificationStore = useNotificationStore()
const { notificationList } = storeToRefs(notificationStore)
const isModal = ref(false)
const modalData = ref(null)
const filter = ref('all')
const errorModal = ref(false)
const errorMsg = ref('')

const displayNotificationList = computed(() => {
  if (filter.value === 'sos') return notificationList.value.filter((n) => n.notiType === 'sos')
  else if (filter.value === 'announce')
    return notificationList.value.filter((n) => n.notiType === 'announce')
  return notificationList.value
})

const openModal = (notification) => {
  isModal.value = true
  modalData.value = notification
}

const isReadNotification = async (notificationId) => {
  await notificationStore.readNotification(notificationId)
  if (notificationStore.error) {
    errorMsg.value = '알림을 읽는데 실패했습니다'
    errorModal.value = true
  } else {
    notificationList.value.find((n) => n.notificationId === notificationId).isRead = true
  }

  isModal.value = false
}

const goDetail = (notification) => {
  isModal.value = false
  //api 연동 하면서 로직 만들기
  //알림 관련 페이지로 이동
}

const notificationDelete = async (notificationId) => {
  //알림 단일 삭제
  await notificationStore.deleteNotification(notificationId)
  if (notificationStore.error) {
    errorMsg.value = '알림을 삭제하는데 실패했습니다'
    errorModal.value = true
  } else {
    notificationList.value = notificationList.value.filter(
      (n) => n.notificationId !== notificationId,
    )
  }
}

const notificationAllDelete = async () => {
  //알림 전체 삭제
  await notificationStore.deleteAllNotification()
  if (notificationStore.error) {
    errorMsg.value = notificationStore.error.message
    errorModal.value = true
  } else {
    notificationList.value = []
  }
}

const notificationAllRead = async () => {
  //전체읽음 처리
  await notificationStore.allReadNotification()
  if (notificationStore.error) {
    errorMsg.value = '알림 전체읽음을 실패했습니다'
    errorModal.value = true
  } else {
    notificationList.value.forEach((n) => {
      n.isRead = true
    })
  }
}

onMounted(async () => {
  await notificationStore.getNotificationList()
  if (notificationStore.error) {
    errorMsg.value = '알림 목록을 불러오는데 실패했습니다.'
    errorModal.value = true
  }
})
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <div
      class="flex justify-between border-t border-b border-gray-100 py-3 mt-[-1rem] mx-[-1rem] px-[1rem]"
    >
      <RoundedDropdownFilter
        :options="[
          { value: 'all', label: '전체' },
          { value: 'sos', label: 'SOS' },
          { value: 'announce', label: '공고' },
        ]"
        :filter="filter"
        @update:filter="filter = $event"
      />

      <button
        class="text-10 semibold text-white bg-main rounded-[10px] px-4 py-1 shadow-custom"
        @click="notificationAllRead"
      >
        전체읽음 처리
      </button>
    </div>

    <div
      v-if="notificationList"
      class="overflow-scroll h-full [&::-webkit-scrollbar]:hidden mt-4 flex flex-col gap-3"
    >
      <NotificationCard
        v-for="notification in displayNotificationList"
        :notification="notification"
        :key="notification.notificationId"
        @click="openModal(notification)"
        @delete="notificationDelete(notification.notificationId)"
      />
    </div>

    <button
      class="fixed bottom-[100px] right-[0.8rem] text-10 semibold text-white bg-main rounded-[12px] px-4 py-2 shadow-custom z-[50]"
      @click="notificationAllDelete"
    >
      알림 전체 삭제
    </button>
    <div v-if="isModal" class="fixed inset-0 bg-black/55 z-[90]" @click="isModal = false"></div>

    <NotificationModal
      v-if="isModal"
      @close="isReadNotification(modalData.notificationId)"
      @click="goDetail(modalData)"
      class="z-[100] fixed top-1/3 left-1/2 -translate-x-1/2"
      :notification="modalData"
    />

    <div
      class="flex flex-col justify-center items-center text-14 semibold text-gray-300 mt-[5rem]"
      v-if="notificationList.length === 0"
    >
      <Icon icon="ix:alarm-bell-filled" class="size-10" />
      <p class="mt-1 text-16">알림이 없습니다....</p>
    </div>

    <div
      v-if="errorModal"
      class="fixed inset-0 bg-black/55 z-[90]"
      @click="errorModal = false"
    ></div>

    <ErrorModal
      v-if="errorModal"
      @close="errorModal = false"
      :title="errorMsg"
      class="z-[100] fixed top-1/3 left-1/2 -translate-x-1/2"
    />
  </div>
</template>

<style scoped></style>
