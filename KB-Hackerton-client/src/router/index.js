import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: '홈',
      },
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: () => import('@/views/CalendarView.vue'),
      meta: {
        title: '캘린더',
      },
    },
    {
      path: '/sos',
      name: 'sos',
      component: () => import('@/views/SosView.vue'),
      meta: {
        title: 'SOS',
      },
    },
    {
      path: '/chat-list',
      name: 'chat-list',
      component: () => import('@/views/ChatListView.vue'),
      meta: {
        title: '채팅 목록',
      },
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: () => import('@/views/FavoritesView.vue'),
      meta: {
        title: '즐겨찾기',
      },
    },
    {
      path: '/notifications',
      name: 'notifications',
      component: () => import('@/views/NotificationsView.vue'),
      meta: {
        title: '알림',
      },
    },
  ],
})

export default router
