export default [
  {
    path: '/notice-list',
    name: 'noticeList',
    component: () => import('@/views/NoticeListView.vue'),
    meta: {
      title: '공지사항',
    },
  },
]
