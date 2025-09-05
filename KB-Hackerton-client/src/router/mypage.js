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
]
