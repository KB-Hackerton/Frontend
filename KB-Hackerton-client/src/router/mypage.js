export default [
  {
    path: '/mypage',
    name: 'mypage',
    component: () => import('@/views/MyPageView.vue'),
    meta: {
      title: '마이페이지',
    },
  },
]
