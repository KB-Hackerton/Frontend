export default [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
  },
  // {
  //   path: 'join',
  //   name: 'join',
  //   component: () => import('@/views/JoinView.vue'),
  //   meta: { title: '회원 가입' },
  // },
  // {
  //   path: 'find-password',
  //   name: 'find-password',
  //   component: () => import('@/views/FindPasswordView.vue'),
  //   meta: { title: '비밀번호 찾기' },
  // },
]
