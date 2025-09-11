export default [
  {
    path: '/mypage',
    name: 'mypage',
    component: () => import('@/views/MyPageView.vue'),
    meta: { title: '마이페이지' },
  },
  {
    path: '/mypage/business-edit',
    name: 'business-edit',
    component: () => import('@/views/edit/BusinessEditView.vue'),
    meta: { title: '사업정보 수정' },
  },
  {
    path: '/mypage/password-edit',
    name: 'password-edit',
    component: () => import('@/views/edit/PasswordEditView.vue'),
    meta: { title: '비밀번호 수정' },
  },
  {
    path: '/chatbot',
    name: 'chatbot',
    component: () => import('@/views/Chatbot.vue'),
    meta: { title: '챗봇' },
  },
]
