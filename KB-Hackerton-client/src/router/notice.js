export default [
  {
    path: '/notice-list',
    name: 'noticeList',
    component: () => import('@/views/NoticeListView.vue'),
    meta: {
      title: '공지사항',
    },
  },
  {
    path: '/notice-detail/:notice_id',
    name: 'noticeDetail',
    component: () => import('@/views/NoticeDetailView.vue'),
    meta: {
      title: '공지사항',
    },
  },
]
