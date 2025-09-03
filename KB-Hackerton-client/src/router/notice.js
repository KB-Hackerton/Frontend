export default [
  {
    path: '/notice-list',
    name: 'noticeList',
    component: () => import('@/views/NoticeListView.vue'),
    meta: {
      title: '공고 리스트',
    },
  },
]
