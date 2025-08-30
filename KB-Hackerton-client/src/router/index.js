import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: () => import('@/views/CalendarView.vue'), // lazy
    },
    {
      path: '/sos',
      name: 'sos',
      component: () => import('@/views/SosView.vue'), // lazy
    },
    {
      path: '/chat',
      name: 'chat-list',
      component: () => import('@/views/ChatListView.vue'), // lazy
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: () => import('@/views/FavoritesView.vue'), // lazy
    },
  ],
})

export default router
