export default [
  {
    path: '/announce-list',
    name: 'announceList',
    component: () => import('@/views/AnnounceListView.vue'),
    meta: {
      title: '공고 리스트',
    },
  },
]
