export default [
  {
    path: '/sos/create',
    name: 'sos-create',
    component: () => import('@/views/sos/SosCreateView.vue'),
    meta: { title: '도와주이소' },
  },
  {
    path: '/sos/edit/:id',
    name: 'sos-edit',
    component: () => import('@/views/sos/SosEditView.vue'),
    meta: { title: '도와주이소' },
  },
]
