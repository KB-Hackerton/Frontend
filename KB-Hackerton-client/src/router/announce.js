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
  {
    path: '/announces/:announce_id/docs-check',
    name: 'announceDocsCheckList',
    component: () => import('@/views/AnnounceDocsChecklistView.vue'),
    meta: {
      title: '제출 서류 체크',
    },
  },
]
