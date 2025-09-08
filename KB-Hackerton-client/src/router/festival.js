export default [
  {
    path: '/festival-list',
    name: 'festivalList',
    component: () => import('@/views/FestivalListView.vue'),
    meta: {
      title: '축제 리스트',
      bg: 'ivory',
    },
  },
  {
    path: '/festival-detail/:festival_id',
    name: 'festivalDetail',
    component: () => import('@/views/FestivalDetailView.vue'),
    meta: {
      title: '축제',
      bg: 'ivory',
    },
  },
]
