<script setup>
import AlarmTimePicker from '@/components/setting/AlarmTimePicker.vue'
import PushAlarmTimeModal from '@/components/setting/PushAlarmTimeModal.vue'
import PushNotificationToggle from '@/components/setting/PushNotificationToggle.vue'
import { useAlarmStore } from '@/stores/alarm'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'

const alarmStore = useAlarmStore()

const { alarmData } = storeToRefs(alarmStore)

const errorModal = ref(false)
const errorMsg = ref('')

const openAlarmModal = ref(false)
const onToggleChange = async (update) => {
  alarmData.value[update] = !alarmData.value[update]

  await alarmStore.updateAlarm(alarmData.value)
  if (alarmStore.error) {
    errorMsg.value = '알람 설정에 실패해습니다.'
    errorModal.value = true
    alarmData.value[update] = !alarmData.value[update]
  }

  if (update === 'dndEnabled' && !alarmData.value.dndEnabled) {
    openAlarmModal.value = false
  }
}

const setAlarmTime = async (startTime, endTime) => {
  alarmData.value.dndStart = startTime
  alarmData.value.dndEnd = endTime

  await alarmStore.updateAlarm(alarmData.value)
  if (alarmStore.error) {
    errorMsg.value = '알람 설정에 실패했습니다.'
    errorModal.value = true
  }

  openAlarmModal.value = false
}

onMounted(async () => {
  await alarmStore.getAlarmData()
  if (alarmStore.error) {
    errorMsg.value = '알람 설정 목록을 불러오는데 실패했습니다.'
    errorModal.value = true
  }
})
</script>

<template>
  <div
    class="flex flex-col h-full px-3 mx-[-1rem] border-t border-b border-gray-100 mt-[-1rem] pt-7"
  >
    <div class="w-full bg-white rounded-2xl px-3 py-4 shadow-custom">
      <h1 class="text-16 bold">PUSH 알림 설정</h1>

      <div class="w-full py-4">
        <PushNotificationToggle
          :title="'공고 알림'"
          :isChecked="alarmData.announceEnabled"
          @toggle="onToggleChange('announceEnabled')"
        />
      </div>
      <div class="w-full py-4">
        <PushNotificationToggle
          :title="'SOS 알림'"
          :isChecked="alarmData.sosEnabled"
          @toggle="onToggleChange('sosEnabled')"
        />
      </div>
      <div class="w-full pt-4 pb-1 flex flex-col gap-3">
        <PushNotificationToggle
          :title="'push 알림 잠자기'"
          :isChecked="alarmData.dndEnabled"
          @toggle="onToggleChange('dndEnabled')"
        />
        <AlarmTimePicker
          :startTime="alarmData.dndStart"
          :endTime="alarmData.dndEnd"
          :isDisabled="!alarmData.dndEnabled"
          @click="openAlarmModal = true"
        />
      </div>
      <div class="w-full">
        <transition name="slide-up">
          <PushAlarmTimeModal
            v-if="openAlarmModal && alarmData.dndEnabled"
            @close="openAlarmModal = false"
            :startTime="alarmData.dndStart"
            :endTime="alarmData.dndEnd"
            @click="setAlarmTime"
          />
        </transition>
      </div>
    </div>

    <div class="w-full bg-white rounded-2xl px-3 py-4 shadow-custom mt-6">
      <h1 class="text-16 bold">앱 정보</h1>
      <div class="flex justify-between py-4 text-12 semibold texy-gray-400">
        <p>최초 가입일</p>
        <p class="text-gray-400">2025.0910</p>
      </div>
      <div class="flex justify-between pt-4 pb-1 text-12 semibold texy-gray-400">
        <p>앱 버전</p>
        <p class="text-gray-400">1.5.3</p>
      </div>
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

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px);
}
.slide-up-enter-to,
.slide-up-leave-from {
  opacity: 1;
  transform: translate(-50%, 0);
}
</style>
