export default [
  {
    path: '/sos/create',
    name: 'sos-create',
    component: () => import('@/views/SosCreateView.vue'),
    meta: {
      title: '도와주이소',
    },
  },
  {
    path: '/sos/edit/:id',
    name: 'sos-edit',
    component: () => import('@/views/SosEditView.vue'),
    meta: {
      title: '도와주이소',
    },
  },
]
