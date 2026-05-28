import { createRouter, createWebHistory } from 'vue-router'
import HomeMagazine from '../pages/HomeMagazine.vue'
import Blog from '../pages/Blog.vue'
import BlogPost from '../pages/BlogPost.vue'
import Timeline from '../pages/Timeline.vue'

const routes = [
  { path: '/',           name: 'home',     component: HomeMagazine },
  { path: '/blog',       name: 'blog',     component: Blog },
  { path: '/blog/:slug', name: 'post',     component: BlogPost },
  { path: '/timeline',   name: 'timeline', component: Timeline },
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})
