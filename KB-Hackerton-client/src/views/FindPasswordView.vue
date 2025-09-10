<script setup>
import { ref } from 'vue'
import FindPasswordStepEmail from '@/components/find-password/FindPasswordStepEmail.vue'
import FindPasswordStepReset from '@/components/find-password/FindPasswordStepReset.vue'

const step = ref(1)
const verifiedEmail = ref('')

function goNext() {
  verifiedEmail.value = email
  step.value = 2
}
</script>

<template>
  <div>
    <FindPasswordStepEmail v-if="step === 1" @success="goNext" />
    <FindPasswordStepReset v-else :email="verifiedEmail" />
  </div>
</template>
