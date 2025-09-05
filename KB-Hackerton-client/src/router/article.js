export default [
  {
    path: '/article',
    name: 'article',
    component: () => import('@/views/ArticleListView.vue'),
    meta: {
      title: '뉴스',
    },
  },
]
