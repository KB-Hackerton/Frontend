import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DefaultLayout from '@/components/layouts/DefaultLayout.vue'

import user from '@/router/user.js'
import announce from '@/router/announce.js'
import festival from '@/router/festival.js'
import notice from '@/router/notice.js'
import mypage from '@/router/mypage.js'
import article from '@/router/article.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
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
            title: '달력 함 봐라',
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
        ...user,
        ...announce,
        ...festival,
        ...notice,
        ...mypage,
        ...article,
      ],
    },
  ],
})

export default router
