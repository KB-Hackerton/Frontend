export default [
  {
    path: '/festival-list',
    name: 'festivalList',
    component: () => import('@/views/FestivalListView.vue'),
    meta: {
      title: '공고 리스트',
    },
  },
]
