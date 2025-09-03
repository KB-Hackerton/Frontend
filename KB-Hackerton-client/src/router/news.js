export default [
  {
    path: '/news-list',
    name: 'newsList',
    component: () => import('@/views/NewsListView.vue'),
    meta: {
      title: '뉴스',
    },
  },
]
