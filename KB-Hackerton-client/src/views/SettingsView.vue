<script setup>
import AlarmTimePicker from '@/components/setting/AlarmTimePicker.vue'
import PushAlarmTimeModal from '@/components/setting/PushAlarmTimeModal.vue'
import PushNotificationToggle from '@/components/setting/PushNotificationToggle.vue'
import { computed, ref } from 'vue'

const setting = ref({
  announce_preference: true,
  sos_preference: false,
  is_alarm: false,
  alarm_start_time: '21:00',
  alarm_end_time: '09:00',
})

const openAlarmModal = ref(false)
const onToggleChange = (update) => {
  //알림 설정 API 연동
  setting.value[update] = !setting.value[update]

  if (update === 'is_alarm' && !setting.value.is_alarm) {
    openAlarmModal.value = false
  }
}

const setAlarmTime = (startTime, endTime) => {
  setting.value.alarm_start_time = startTime
  setting.value.alarm_end_time = endTime
  openAlarmModal.value = false
}
</script>

<template>
  <div class="flex flex-col w-full h-full px-3">
    <h1 class="text-16 bold">PUSH 알림 설정</h1>
    <div class="w-full border-b border-gray-300 py-4">
      <PushNotificationToggle
        :title="'공고 알림'"
        :isChecked="setting.announce_preference"
        @toggle="onToggleChange('announce_preference')"
      />
    </div>
    <div class="w-full border-b border-gray-300 py-4">
      <PushNotificationToggle
        :title="'SOS 알림'"
        :isChecked="setting.sos_preference"
        @toggle="onToggleChange('sos_preference')"
      />
    </div>
    <div class="w-full border-b border-gray-300 py-4 flex flex-col gap-3">
      <PushNotificationToggle
        :title="'push 알림 잠자기'"
        :isChecked="setting.is_alarm"
        @toggle="onToggleChange('is_alarm')"
      />
      <AlarmTimePicker
        :startTime="setting.alarm_start_time"
        :endTime="setting.alarm_end_time"
        :isDisabled="!setting.is_alarm"
        @click="openAlarmModal = true"
      />
    </div>

    <div class="w-full">
      <transition name="slide-up">
        <PushAlarmTimeModal
          v-if="openAlarmModal && setting.is_alarm"
          @close="openAlarmModal = false"
          :startTime="setting.alarm_start_time"
          :endTime="setting.alarm_end_time"
          @click="setAlarmTime"
        />
      </transition>
    </div>

    <div class="h-2 w-screen bg-gray-100 mt-10 -mx-7"></div>

    <h1 class="text-16 bold mt-6">앱 정보</h1>

    <div class="flex justify-between py-4 border-b border-gray-300 text-12 semibold texy-gray-400">
      <p>최초 가입일</p>
      <p>2025.0910</p>
    </div>

    <div class="flex justify-between py-4 border-b border-gray-300 text-12 semibold texy-gray-400">
      <p>앱 버전</p>
      <p>1.5.3</p>
    </div>
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
