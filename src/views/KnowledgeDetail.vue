<template>
  <div class="knowledge-detail">
    <NavBar />
    <div class="container">
      <button class="back" @click="$router.back()">← 返回</button>
      <div class="content-card">
        <h1>{{ item.icon }} {{ item.title }}</h1>
        <p class="summary">{{ item.summary }}</p>
        <div class="article" v-html="item.contentHtml"></div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '../components/NavBar.vue'
import { useRoute } from 'vue-router'

import knowledgeData from '../data/knowledge'

export default {
  name: 'KnowledgeDetail',
  components: { NavBar },
  setup() {
    const route = useRoute()
    const id = Number(route.params.id || route.query.id || 1)
    const item = knowledgeData.find(k => k.id === id) || { id: 0, icon: '🌱', title: '未知', summary: '', contentHtml: '<p>暂无内容</p>' }
    return { item }
  }
}
</script>

<style scoped>
.container { max-width: 900px; margin: 30px auto; padding: 20px; }
.back { background: transparent; border: none; color: var(--accent); cursor: pointer; margin-bottom: 10px }
.content-card { background: white; padding: 24px; border-radius: 12px; box-shadow: 0 12px 30px rgba(0,0,0,0.06) }
.content-card h1 { margin-bottom: 10px; color: var(--text-heading) }
.summary { color: var(--text-muted); margin-bottom: 18px }
.article h3 { color: var(--text-main) }
.article p, .article li { color: var(--text-main); line-height: 1.6 }
</style>
