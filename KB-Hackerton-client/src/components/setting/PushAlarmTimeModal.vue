<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue'
import BaseButton from '../common/BaseButton.vue'
import { VueScrollPicker } from 'vue-scroll-picker'
import 'vue-scroll-picker/style.css'
import { Icon } from '@iconify/vue'

const props = defineProps({
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
})

const currentTime = ref(props.startTime)

const emit = defineEmits(['click'])

const startTime = ref(props.startTime)
const endTime = ref(props.endTime)

const clickStartTime = ref(true)
const clickEndTime = ref(false)

const selectStart = () => {
  clickStartTime.value = true
  clickEndTime.value = false
  currentTime.value = startTime.value
}
const selectEnd = () => {
  clickStartTime.value = false
  clickEndTime.value = true
  currentTime.value = endTime.value
}

// ===== Wheel Time Picker (vue-scroll-picker) =====
const minuteStep = 1
const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const minutes = Array.from({ length: 60 / minuteStep }, (_, i) =>
  String(i * minuteStep).padStart(2, '0'),
)

const pad2 = (s) => String(s).padStart(2, '0')
const split = (hhmm) => {
  const [h = '00', m = '00'] = String(hhmm || '00:00').split(':')
  return { h: pad2(h), m: pad2(m) }
}

const hour = ref(split(currentTime.value).h)
const minute = ref(split(currentTime.value).m)

// When currentTime target changes (start/end toggled), move wheels to it
watch(currentTime, (v) => {
  const { h, m } = split(v)
  if (h !== hour.value) hour.value = h
  if (m !== minute.value) minute.value = m
})

// When wheels move, update the active target and reflect to start/end
watch([hour, minute], ([h, m]) => {
  const v = `${h}:${m}`
  currentTime.value = v
  if (clickStartTime.value) {
    startTime.value = v
  } else {
    endTime.value = v
  }
})

const setAlarmTime = () => {
  emit('click', startTime.value, endTime.value)
}
</script>

<template>
  <div
    class="fixed bottom-0 left-1/2 -translate-x-1/2 z-10 md:max-w-[365px] flex flex-col items-center h-[31rem] w-full bg-gray-100 rounded-t-[2rem] shadow-[0px_-2px_4px_rgba(0,0,0,0.25)]"
  >
    <div class="flex w-full p-4">
      <p class="text-20 bold text-center flex-1 pl-14">알림 시간 설정</p>
      <Icon
        icon="material-symbols:add-rounded"
        class="size-8 rotate-45 mr-4"
        @click="$emit('close')"
      />
    </div>
    <div class="flex items-center gap-2 text-24 bold">
      <button :class="clickStartTime ? '' : 'text-gray-300'" @click="selectStart">
        {{ startTime }}
      </button>
      <p>~</p>
      <button :class="clickEndTime ? '' : 'text-gray-300'" @click="selectEnd">
        {{ endTime }}
      </button>
    </div>

    <!-- Wheel Time Picker -->
    <div class="relative w-full max-w-[22rem] mt-4 rounded-xl overflow-hidden">
      <!-- center fill bar across both columns -->
      <div
        data-indicator
        class="pointer-events-none absolute left-0 right-0 h-[50px] rounded-[12px] z-0 overflow-hidden"
        style="top: calc(50% - 25px)"
      >
        <div class="absolute inset-0 -mt-[4px] -mb-[4px] rounded-none" data-indicator-fill></div>
      </div>
      <div class="grid grid-cols-2 gap-0 px-4 relative z-20">
        <!-- Hour wheel -->
        <VueScrollPicker
          v-model="hour"
          :options="hours"
          :item-height="44"
          :visible-items="5"
          infinite
        />
        <!-- Minute wheel -->
        <VueScrollPicker
          v-model="minute"
          :options="minutes"
          :item-height="44"
          :visible-items="5"
          infinite
        />
      </div>
    </div>

    <BaseButton @click="setAlarmTime" class="mt-20"> 설정 </BaseButton>
  </div>
</template>

<style scoped>
:deep(.vue-scroll-picker) {
  height: 220px;
  position: relative;
  background: transparent;
}
:deep(.vue-scroll-picker-viewport) {
  background: transparent !important;
  box-shadow: none !important;
}
:deep(.vue-scroll-picker-viewport::before),
:deep(.vue-scroll-picker-viewport::after) {
  display: none !important;
  content: none !important;
}
:deep(.vue-scroll-picker:before),
:deep(.vue-scroll-picker:after),
:deep(.vue-scroll-picker .mask),
:deep(.vue-scroll-picker-mask) {
  background: transparent !important;
  opacity: 0 !important;
}
:deep(.vue-scroll-picker-list) {
  padding: 88px 0;
  background: transparent;
}
:deep(.vue-scroll-picker-item) {
  height: 44px;
  line-height: 44px;
  text-align: center;
  font-size: 22px;
  color: #9ca3af;
  opacity: 1;

  letter-spacing: 0.08em;
  transition:
    opacity 0.15s ease,
    color 0.15s ease,
    font-size 0.15s ease;
  display: block;
  width: 100%;
  position: relative;
  z-index: 100;
}
:deep(.vue-scroll-picker-item.selected),
:deep(.vue-scroll-picker-item.is-selected) {
  color: #ffffff !important;
  mix-blend-mode: normal !important;
  opacity: 1 !important;
  font-weight: 700;
  font-size: 24px;
  width: 100%;
}
:deep(.vue-scroll-picker-item.selected),
:deep(.vue-scroll-picker-item.is-selected),
:deep(.vue-scroll-picker-item[aria-selected='true']) {
  position: relative;
  z-index: 1; /* keep text above background */
}
:deep(.vue-scroll-picker-item.selected::before),
:deep(.vue-scroll-picker-item.is-selected::before),
:deep(.vue-scroll-picker-item[aria-selected='true']::before) {
  display: none !important;
  content: none !important;
}
:deep(.vue-scroll-picker-item[aria-selected='true']) {
  color: #ffffff !important;
  opacity: 1 !important;
  font-weight: 700 !important;
  font-size: 24px !important;
}
:deep(.vue-scroll-picker-item.active),
:deep(.vue-scroll-picker-item.current) {
  color: #ffffff !important;
  opacity: 1 !important;
  font-weight: 700 !important;
  font-size: 24px !important;
}
:deep(.vue-scroll-picker-item[aria-selected='true'] *),
:deep(.vue-scroll-picker-item.active *),
:deep(.vue-scroll-picker-item.current *) {
  color: #ffffff !important;
  opacity: 1 !important;
}
:deep(.vue-scroll-picker-item.selected *),
:deep(.vue-scroll-picker-item.is-selected *) {
  color: #ffffff !important;
  opacity: 1 !important;
}
:deep(.vue-scroll-picker-item *) {
  position: relative;
  z-index: 100;
}

/* -- Force remove top/bottom white background bands -- */
:deep(.vue-scroll-picker),
:deep(.vue-scroll-picker *),
:deep(.vue-scroll-picker-viewport),
:deep(.vue-scroll-picker-viewport *),
:deep(.vue-scroll-picker-list) {
  background: transparent !important;
  box-shadow: none !important;
}
:deep(.vue-scroll-picker-column) {
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
}
:deep(.vue-scroll-picker-column::before),
:deep(.vue-scroll-picker-column::after),
:deep(.vue-scroll-picker-item::before),
:deep(.vue-scroll-picker-item::after),
:deep(.vue-scroll-picker-cover),
:deep(.vue-scroll-picker .cover),
:deep(.vue-scroll-picker .mask-top),
:deep(.vue-scroll-picker .mask-bottom) {
  display: none !important;
  background: transparent !important;
  box-shadow: none !important;
}

/* Remove inner separator lines completely */
:deep(.vue-scroll-picker-column::before),
:deep(.vue-scroll-picker-column::after),
:deep(.vue-scroll-picker-viewport::before),
:deep(.vue-scroll-picker-viewport::after),
:deep(.vue-scroll-picker-list::before),
:deep(.vue-scroll-picker-list::after),
:deep(.vue-scroll-picker::before),
:deep(.vue-scroll-picker::after) {
  display: none !important;
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
  content: none !important;
}

/* Solid blue indicator without any lines */
[data-indicator] {
  background: transparent !important;
  border: none !important;
  border-top: none !important;
  border-bottom: none !important;
  outline: none !important;
  box-shadow: none !important;
  transform: translateZ(0);
  background-clip: padding-box;
  backface-visibility: hidden;
  will-change: transform;
  display: block !important;
}

[data-indicator-fill] {
  position: absolute;
  top: -2px;
  bottom: -2px;
  left: -2px;
  right: -2px;
  border-radius: 14px;
  background: #5ea7df !important;
  border: 0 !important;
  outline: none !important;
  transform: translateZ(0);
  box-shadow: none !important;
}
[data-indicator-fill]::after {
  content: '';
  position: absolute;
  top: -2px;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px; /* cover any subpixel seam */
  background: #5ea7df; /* same blue */
  pointer-events: none;
}

/* Remove default selection overlay (top/bottom borders) */
:deep(.vue-scroll-picker .selection),
:deep(.vue-scroll-picker .selection::before),
:deep(.vue-scroll-picker .selection::after) {
  border: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
}

/* Kill any possible hairlines on items/columns */
:deep(.vue-scroll-picker-item),
:deep(.vue-scroll-picker-item.selected) {
  border-top: none !important;
  border-bottom: none !important;
  box-shadow: none !important;
  outline: none !important;
  background-image: none !important;
}

:deep(.vue-scroll-picker-column) {
  border-top: none !important;
  border-bottom: none !important;
  box-shadow: none !important;
}

/* Final kill-switch for any residual hairlines */
:deep(.vue-scroll-picker *::before),
:deep(.vue-scroll-picker *::after) {
  display: none !important;
  content: none !important;
  background: transparent !important;
  border: 0 !important;
  box-shadow: none !important;
}

/* Final pass: nuke residual gradients/masks that draw the thin white lines */
:deep(.vue-scroll-picker),
:deep(.vue-scroll-picker-viewport),
:deep(.vue-scroll-picker-column),
:deep(.vue-scroll-picker-list) {
  background: transparent !important;
  background-image: none !important;
  -webkit-mask-image: none !important;
  mask-image: none !important;
}

/* Ensure the blue indicator paints above any library overlays but below text */
[data-indicator] {
  z-index: 0 !important;
}
:deep(.vue-scroll-picker-item) {
  z-index: 100 !important;
  position: relative;
}

/* Remove overlay layers that draw the faint top/bottom lines */
:deep(.vue-scroll-picker-layer-top),
:deep(.vue-scroll-picker-layer-bottom) {
  display: none !important;
  background: transparent !important;
  border: 0 !important;
  box-shadow: none !important;
  pointer-events: none !important;
}
</style>
