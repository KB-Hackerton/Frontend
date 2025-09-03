export default [
  {
    path: '/festival-list',
    name: 'festivalList',
    component: () => import('@/views/FestivalListView.vue'),
    meta: {
      title: '축제 리스트',
    },
  },
]
