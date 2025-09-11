<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import {useSignupStore} from '@/stores/signup.js'


const route = useRoute()
const router = useRouter()
const AuthStore = useAuthStore()
const SignupStore = useSignupStore()


onMounted(async () => {
  const code = route.query.code
  console.log('카카오 code:', code)

  if (!code) {
    alert('카카오 로그인 코드가 없습니다.')
    router.push('/login')
    return
  }

  await AuthStore.kakaoLoginApi(code)

  if (AuthStore.refreshToken?.value) {

    router.push('/')
  } else if (
    AuthStore.refreshToken?.value === undefined ||
    AuthStore.refreshToken?.value === null
  ) {
    // undefined 또는 null이면 회원가입으로
    const data = {email: AuthStore.kakakoEmail , password: ''}
    SignupStore.setPersonalInfo(data)
    router.push('/signup')
  }

})
</script>
