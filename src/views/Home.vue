<template>
  <div class="home">
    <NavBar />
    
    <!-- 主要内容区域 -->
    <main class="main-content">
      <!-- 炫酷欢迎横幅 -->
      <section class="welcome-banner">
        <div class="banner-bg">
          <img src="/images/backgrounds/nature-premium.svg" alt="高级自然背景" class="banner-image"/>
        </div>
        <div class="banner-content">
          <h1 class="eco-title">
            <span class="eco-icon">🌱</span>
            绿色足迹
            <span class="eco-icon">🌍</span>
          </h1>
          <p class="eco-subtitle">记录每一次环保行动，共同守护地球家园</p>
        <div class="floating-leaves">
          <span class="leaf-fall" style="left: 10%; animation-delay: 0s;">🍃</span>
          <span class="leaf-fall" style="left: 30%; animation-delay: 1s;">🍂</span>
          <span class="leaf-fall" style="left: 50%; animation-delay: 2s;">🍁</span>
          <span class="leaf-fall" style="left: 70%; animation-delay: 3s;">🍃</span>
          <span class="leaf-fall" style="left: 90%; animation-delay: 4s;">🍂</span>
        </div>
        
        <!-- 装饰性背景元素 -->
        <div class="decorative-elements">
          <img src="/images/ui/decoration-leaves.svg" alt="装饰叶子" class="decoration-leaves"/>
          <img src="/images/ui/eco-pattern.svg" alt="环保图案" class="decoration-pattern"/>
        </div>
        </div>
        <div class="banner-stats" v-if="store.user.isLoggedIn">
          <div class="stat-item" @click="openStat('points')" style="cursor:pointer">
            <div class="stat-icon">🏆</div>
            <span class="stat-value">{{ store.user.totalPoints }}</span>
            <span class="stat-label">贡献值</span>
          </div>
          <div class="stat-item" @click="openStat('level')" style="cursor:pointer">
            <div class="stat-icon">⭐</div>
            <span class="stat-value">{{ store.user.level }}</span>
            <span class="stat-label">等级</span>
          </div>
        </div>
      </section>

      <!-- 核心功能入口 -->
      <section class="feature-grid">
        <div class="feature-card" @click="navigate('/action-record')">
          <div class="feature-icon">
            <img src="/images/icons/actions/record-action.svg" alt="记录行动" class="icon-image"/>
          </div>
          <h3>记录行动</h3>
          <p>记录环保行动，获取贡献值</p>
        </div>
        
        <div class="feature-card" @click="navigate('/footprint-data')">
          <div class="feature-icon">
            <img src="/images/icons/actions/data-analysis.svg" alt="足迹数据" class="icon-image"/>
          </div>
          <h3>足迹数据</h3>
          <p>查看环保数据统计</p>
        </div>
        
        <div class="feature-card" @click="navigate('/community-challenge')">
          <div class="feature-icon">
            <img src="/images/icons/actions/challenge-trophy.svg" alt="社群挑战" class="icon-image"/>
          </div>
          <h3>社群挑战</h3>
          <p>参与环保挑战活动</p>
        </div>
      </section>

      <!-- 个人贡献展示 -->
      <section class="personal-contributions" v-if="store.user.isLoggedIn">
        <h2>我的环保贡献</h2>
        <div class="contributions-grid">
          <div class="contribution-item" v-for="action in recentActions" :key="action.id" @click="openActionDetail(action)" style="cursor:pointer">
            <div class="action-type">{{ action.type }}</div>
            <div class="action-details">
              <p>{{ action.description }}</p>
              <span class="action-points">+{{ action.points }} 贡献值</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 热门挑战 -->
      <section class="popular-challenges">
      <h2>🔥 热门挑战</h2>
        <div class="challenge-list">
        <div class="challenge-item" v-for="challenge in challenges" :key="challenge.id" @click="navigate('/community-challenge')" style="cursor:pointer">
            <div class="challenge-header">
              <h3>{{ challenge.title }}</h3>
              <span class="challenge-difficulty">{{ challenge.difficulty }}</span>
            </div>
            <p>{{ challenge.description }}</p>
            <div class="challenge-stats">
              <span>👥 {{ challenge.participants }} 人参与</span>
              <span>🎁 {{ challenge.reward }} 积分奖励</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 精选知识 -->
      <section class="featured-knowledge">
        <h2>💡 环保知识</h2>
        <div class="knowledge-cards">
          <div class="knowledge-card" v-for="knowledge in featuredKnowledge" :key="knowledge.id" @click.prevent="navigate(`/knowledge/${knowledge.id}`)" style="cursor:pointer">
            <div class="knowledge-icon">{{ knowledge.icon }}</div>
            <h3>{{ knowledge.title }}</h3>
            <p>{{ knowledge.summary }}</p>
          </div>
        </div>
      </section>
      
      <!-- 详情模态 -->
      <Modal v-if="modal.show" :title="modal.title" @close="closeModal">
        <template v-if="modal.type === 'feature'">
          <p>{{ modal.data.description }}</p>
        </template>
        <template v-else-if="modal.type === 'action'">
          <p><strong>类型：</strong>{{ modal.data.type }}</p>
          <p>{{ modal.data.description }}</p>
          <p><strong>贡献值：</strong>+{{ modal.data.points }}</p>
        </template>
        <template v-else-if="modal.type === 'challenge'">
          <h4>{{ modal.data.title }}</h4>
          <p>{{ modal.data.description }}</p>
          <p>奖励：{{ modal.data.reward }} 积分</p>
        </template>
        <template v-else-if="modal.type === 'knowledge'">
          <h4>{{ modal.data.title }}</h4>
          <p>{{ modal.data.summary }}</p>
        </template>
        <template v-else>
          <div v-html="modal.data"></div>
        </template>
      </Modal>
    </main>
  </div>
      </template>

<script>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../store'
import NavBar from '../components/NavBar.vue'
import Modal from '../components/Modal.vue'
import knowledgeData from '../data/knowledge'

export default {
  name: 'Home',
  components: { NavBar, Modal },
  setup() {
    const recentActions = computed(() => store.actions.slice(0, 3))
    const modal = ref({ show: false, title: '', type: '', data: null })

    const router = useRouter()
    function navigate(route) { router.push(route) }

    function openStat(key) {
      if (key === 'points') {
        modal.value = { show: true, title: '贡献值', type: 'info', data: `当前贡献值：<strong>${store.user.totalPoints}</strong>` }
      } else if (key === 'level') {
        modal.value = { show: true, title: '等级', type: 'info', data: `当前等级：<strong>${store.user.level}</strong>` }
      }
    }

    function openActionDetail(action) {
      modal.value = { show: true, title: '行动详情', type: 'action', data: action }
    }

    function openChallenge(challenge) {
      modal.value = { show: true, title: challenge.title, type: 'challenge', data: challenge }
    }

    function openKnowledge(knowledge) {
      modal.value = { show: true, title: knowledge.title, type: 'knowledge', data: knowledge }
    }

    function closeModal() { modal.value.show = false }

    const challenges = [
      { id: 1, title: '7天零塑料挑战', description: '连续7天不使用一次性塑料制品', difficulty: '中等', participants: 1234, reward: 100 },
      { id: 2, title: '垃圾分类达人', description: '正确分类垃圾100次', difficulty: '简单', participants: 856, reward: 50 },
      { id: 3, title: '绿色出行月', description: '一个月内选择绿色出行方式20次', difficulty: '困难', participants: 432, reward: 200 }
    ]

    const featuredKnowledge = knowledgeData.slice(0, 3)

    return {
      store,
      recentActions,
      challenges,
      featuredKnowledge,
      modal,
      navigate,
      openStat,
      openActionDetail,
      openChallenge,
      openKnowledge,
      closeModal
    }
  }
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  /* 移除固定背景，使用body的主题背景 */
  background: transparent;
  --text-heading: #123e2e;
  --text-main: #153a34;
  --text-muted: #6b7780;
  --accent: #27ae60;
  --accent-2: #3498db;
}

.main-content {
  padding: 30px;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.welcome-banner {
  position: relative;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 25px;
  padding: 50px 40px;
  margin-bottom: 50px;
  text-align: center;
  box-shadow: 0 12px 30px rgba(34, 139, 34, 0.06);
  border: 1px solid rgba(100, 220, 170, 0.35);
  overflow: hidden;
  min-height: 300px;
}

.banner-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  filter: brightness(0.7) contrast(1.05) saturate(1.05);
  z-index: 0;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-content {
  position: relative;
  z-index: 1;
}

.eco-title {
  font-size: 3rem;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  font-weight: 800;
  background: linear-gradient(90deg, #00ff9d, #00d4ff, #8a2be2, #ff6ec7);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  text-shadow: 0 6px 12px rgba(0, 0, 0, 0.12);
  animation: gradientShift 6s linear infinite;
}

.eco-icon {
  font-size: 2.5rem;
  animation: ecoFloat 3s ease-in-out infinite, iconSpin 8s linear infinite;
  transform-origin: center;
}

.eco-icon:nth-child(2) {
  animation-delay: 1.5s;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes iconSpin {
  0% { transform: rotate(0deg); }
  50% { transform: rotate(8deg); }
  100% { transform: rotate(0deg); }
}

.eco-subtitle {
  font-size: 1.3rem;
  color: var(--text-muted);
  margin-bottom: 30px;
  font-weight: 300;
}

.floating-leaves {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 2;
}

.decorative-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
  opacity: 0.1;
}

.decoration-leaves {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 80px;
  height: 40px;
  opacity: 0.6;
}

.decoration-pattern {
  position: absolute;
  bottom: 10px;
  left: 10px;
  width: 60px;
  height: 60px;
  opacity: 0.4;
}

.leaf-fall {
  position: absolute;
  font-size: 1.5rem;
  opacity: 0.7;
}

.banner-content h1 {
  font-size: 2.5rem;
  color: var(--text-heading);
  margin-bottom: 10px;
}

.banner-content p {
  font-size: 1.2rem;
  color: var(--text-main);
}

.banner-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 30px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 2rem;
  font-weight: bold;
  color: var(--accent);
}

.stat-label {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 25px;
  margin-bottom: 50px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 20px;
  padding: 36px 28px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.32s cubic-bezier(0.2, 0.9, 0.2, 1), box-shadow 0.32s;
  box-shadow: 0 8px 30px rgba(18, 62, 46, 0.06);
  border: 1px solid rgba(20, 120, 90, 0.06);
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 0.36s ease;
}

.feature-card:hover::before {
  transform: scaleX(1);
}

.feature-card:hover {
  transform: translateY(-10px) scale(1.03);
  box-shadow: 0 20px 60px rgba(18, 62, 46, 0.08);
}

.feature-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 18px auto;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.28s ease;
  background: linear-gradient(180deg, rgba(39,174,96,0.06), rgba(52,152,219,0.04));
  border-radius: 14px;
}

.icon-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.feature-card:hover .feature-icon {
  transform: scale(1.1) rotate(5deg);
}

.feature-card h3 {
  color: var(--text-heading);
  margin-bottom: 15px;
  font-size: 1.3rem;
  font-weight: 600;
}

.feature-card p {
  color: var(--text-muted);
  font-size: 1rem;
  line-height: 1.5;
}

.personal-contributions,
.popular-challenges,
.featured-knowledge {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 30px;
}

.contributions-grid {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.contribution-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background: #fbfdfb;
  border-radius: 10px;
  border-left: 4px solid var(--accent);
}

.action-type {
  background: var(--accent);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  margin-right: 15px;
  font-size: 0.9rem;
}

.action-details {
  flex: 1;
  color: var(--text-main);
}

.action-points {
  color: var(--accent);
  font-weight: bold;
}

.challenge-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.challenge-item {
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 20px;
  background: #fafafa;
}

.challenge-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}


.challenge-difficulty {
  background: var(--accent-2);
  color: white;
  padding: 3px 8px;
  border-radius: 5px;
  font-size: 0.8rem;
}

.challenge-stats {
  display: flex;
  gap: 20px;
  margin-top: 15px;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.knowledge-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.knowledge-card {
  text-align: center;
  padding: 25px;
  background: #f8f9fa;
  border-radius: 10px;
}

.knowledge-icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
}

.knowledge-icon {
  color: var(--accent);
}

/* Buttons used in quick actions and banners */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: transform 0.16s ease, box-shadow 0.16s ease, opacity 0.12s;
}

.btn--primary {
  background: linear-gradient(180deg, var(--accent), color-mix(in srgb, var(--accent-2) 30%));
  color: #fff;
  box-shadow: 0 8px 30px rgba(39,174,96,0.12);
}

.btn--ghost {
  background: transparent;
  border: 1px solid rgba(20,120,90,0.12);
  color: var(--text-main);
}

/* Floating leaves animation */
.leaf-fall {
  animation: leafFall 9s linear infinite;
  will-change: transform, opacity;
}

@keyframes leafFall {
  0% { transform: translateY(-15vh) rotate(0deg) scale(0.9); opacity: 0; }
  10% { opacity: 1; }
  50% { transform: translateY(40vh) rotate(120deg) scale(1); opacity: 0.9; }
  100% { transform: translateY(110vh) rotate(360deg) scale(0.8); opacity: 0; }
}

/* Soft overlay + vignette on banner-bg to make content pop */
.banner-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(0,0,0,0.06));
  pointer-events: none;
  mix-blend-mode: multiply;
  backdrop-filter: blur(2px) saturate(1.03);
  z-index: 0;
}

/* small modal entrance polish for scoped elements inside Home (non-intrusive) */
.modal-window { transition: transform 0.28s cubic-bezier(.2,.9,.2,1), opacity 0.22s; }

@media (max-width: 768px) {
  .banner-stats {
    gap: 20px;
  }
  
  .challenge-stats {
    flex-direction: column;
    gap: 10px;
  }
}
</style>