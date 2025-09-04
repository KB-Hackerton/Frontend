export default [
  {
    path: '/announce-list',
    name: 'announceList',
    component: () => import('@/views/AnnounceListView.vue'),
    meta: {
      title: '공고 리스트',
    },
  },
  {
    path: '/announce-detail/:announce_id',
    name: 'announceDetail',
    component: () => import('@/views/AnnounceDetailView.vue'),
    meta: {
      title: '공고',
    },
  },
]
