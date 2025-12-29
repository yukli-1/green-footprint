<template>
  <div class="badge-system">
    <div class="badge-header">
      <h2>🏅 勋章系统</h2>
      <p>收集环保勋章，记录成长历程</p>
    </div>

    <!-- 勋章分类标签 -->
    <div class="badge-categories">
      <button 
        v-for="category in categories" 
        :key="category.id"
        class="category-btn"
        :class="{ active: activeCategory === category.id }"
        @click="setActiveCategory(category.id)"
      >
        <span class="category-icon">{{ category.icon }}</span>
        <span class="category-name">{{ category.name }}</span>
        <span class="category-count">({{ getBadgeCount(category.id) }})</span>
      </button>
    </div>

    <!-- 勋章展示网格 -->
    <div class="badges-grid">
      <div 
        v-for="badge in filteredBadges" 
        :key="badge.id"
        class="badge-card"
        :class="{ 
          earned: badge.earned, 
          locked: !badge.earned,
          preview: previewBadge === badge.id 
        }"
        @click="showBadgeDetail(badge)"
        @mouseenter="showPreview(badge)"
        @mouseleave="hidePreview"
      >
        <div class="badge-visual">
          <div class="badge-icon">
            <span v-if="badge.earned">{{ badge.icon }}</span>
            <span v-else class="locked-icon">🔒</span>
          </div>
          <div class="badge-rarity" :class="badge.rarity">
            {{ getRarityText(badge.rarity) }}
          </div>
        </div>
        
        <div class="badge-info">
          <h3>{{ badge.name }}</h3>
          <p class="badge-description">{{ badge.description }}</p>
          <div class="badge-progress" v-if="!badge.earned">
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                :style="{ width: badge.progress + '%' }"
              ></div>
            </div>
            <span class="progress-text">{{ badge.progress }}% 完成</span>
          </div>
          <div class="badge-earned-info" v-if="badge.earned">
            <span class="earned-date">{{ formatDate(badge.earnedAt) }}</span>
            <span class="badge-points">+{{ badge.points }} 积分</span>
          </div>
        </div>

        <!-- 快速预览 -->
        <div class="badge-preview" v-if="previewBadge === badge.id && !badge.earned">
          <h4>{{ badge.name }}</h4>
          <p>{{ badge.requirement }}</p>
          <div class="preview-stats">
            <div class="stat-item">
              <span>⭐ 稀有度：</span>
              <span :class="badge.rarity">{{ getRarityText(badge.rarity) }}</span>
            </div>
            <div class="stat-item">
              <span>🎁 积分奖励：</span>
              <span>{{ badge.points }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 成就进度统计 -->
    <div class="achievement-stats">
      <h3>📊 成就统计</h3>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">🏆</div>
          <div class="stat-value">{{ earnedBadges.length }}</div>
          <div class="stat-label">已获得勋章</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🎯</div>
          <div class="stat-value">{{ totalBadges }}</div>
          <div class="stat-label">总勋章数</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⭐</div>
          <div class="stat-value">{{ completionRate }}%</div>
          <div class="stat-label">完成率</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">💎</div>
          <div class="stat-value">{{ legendaryCount }}</div>
          <div class="stat-label">传说勋章</div>
        </div>
      </div>
    </div>

    <!-- 勋章详情模态框 -->
    <div v-if="showDetailModal" class="modal-overlay" @click="closeDetail">
      <div class="detail-modal" @click.stop>
        <div class="detail-header">
          <div class="detail-visual">
            <div class="detail-icon">
              <span v-if="selectedBadge?.earned">{{ selectedBadge?.icon }}</span>
              <span v-else class="locked-icon">🔒</span>
            </div>
            <div class="detail-rarity" :class="selectedBadge?.rarity">
              {{ getRarityText(selectedBadge?.rarity) }}
            </div>
          </div>
          <div class="detail-title">
            <h2>{{ selectedBadge?.name }}</h2>
            <p>{{ selectedBadge?.description }}</p>
          </div>
        </div>

        <div class="detail-content">
          <div class="detail-section">
            <h4>📋 获得条件</h4>
            <p>{{ selectedBadge?.requirement }}</p>
          </div>

          <div class="detail-section">
            <h4>🎯 完成进度</h4>
            <div v-if="!selectedBadge?.earned" class="progress-detail">
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: selectedBadge?.progress + '%' }"
                ></div>
              </div>
              <div class="progress-info">
                <span>当前：{{ selectedBadge?.current }} / {{ selectedBadge?.target }}</span>
                <span>{{ selectedBadge?.progress }}%</span>
              </div>
            </div>
            <div v-else class="completed-info">
              <span>✅ 已于 {{ formatDate(selectedBadge?.earnedAt) }} 获得</span>
            </div>
          </div>

          <div class="detail-section">
            <h4>🎁 奖励内容</h4>
            <div class="rewards-list">
              <div class="reward-item">
                <span class="reward-icon">🌟</span>
                <span class="reward-text">{{ selectedBadge?.points }} 积分</span>
              </div>
              <div class="reward-item" v-if="selectedBadge?.bonusRewards">
                <span class="reward-icon">🎁</span>
                <span class="reward-text">{{ selectedBadge?.bonusRewards }}</span>
              </div>
            </div>
          </div>

          <div class="detail-section" v-if="selectedBadge?.tips">
            <h4>💡 获得技巧</h4>
            <ul>
              <li v-for="tip in selectedBadge?.tips" :key="tip">{{ tip }}</li>
            </ul>
          </div>

          <div class="detail-section">
            <h4>📊 数据统计</h4>
            <div class="badge-stats">
              <div class="stat-row">
                <span>获得人数：</span>
                <span>{{ selectedBadge?.earnedBy || 0 }} 人</span>
              </div>
              <div class="stat-row">
                <span>稀有度排名：</span>
                <span>第 {{ selectedBadge?.rarityRank || 1 }} 位</span>
              </div>
            </div>
          </div>
        </div>

        <div class="detail-actions">
          <button 
            v-if="!selectedBadge?.earned"
            class="action-btn primary"
            @click="focusOnTask"
          >
            🎯 专注任务
          </button>
          <button 
            v-if="selectedBadge?.earned"
            class="action-btn secondary"
            @click="shareBadge"
          >
            📤 分享成就
          </button>
          <button class="action-btn" @click="closeDetail">
            关闭
          </button>
        </div>
      </div>
    </div>

    <!-- 勋章解锁动画 -->
    <div v-if="unlockAnimation" class="unlock-animation">
      <div class="animation-content">
        <div class="unlock-icon">🎉</div>
        <h2>恭喜解锁勋章！</h2>
        <div class="new-badge">
          <span class="badge-emoji">{{ newBadge?.icon }}</span>
          <span class="badge-name">{{ newBadge?.name }}</span>
        </div>
        <p>+{{ newBadge?.points }} 积分已到账</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { store } from '../store'

export default {
  name: 'BadgeSystem',
  setup() {
    const activeCategory = ref('all')
    const previewBadge = ref(null)
    const showDetailModal = ref(false)
    const selectedBadge = ref(null)
    const unlockAnimation = ref(false)
    const newBadge = ref(null)

    const categories = [
      { id: 'all', name: '全部', icon: '🌟' },
      { id: 'action', name: '行动类', icon: '🏃' },
      { id: 'challenge', name: '挑战类', icon: '🏆' },
      { id: 'special', name: '特殊类', icon: '💎' },
      { id: 'milestone', name: '里程碑', icon: '🎯' }
    ]

    const allBadges = [
      // 行动类勋章
      {
        id: 1,
        name: '环保新手',
        icon: '🌱',
        category: 'action',
        rarity: 'common',
        description: '完成第一次环保行动',
        requirement: '完成任意1次环保行动',
        points: 10,
        earned: true,
        earnedAt: new Date().toISOString(),
        progress: 100,
        current: 1,
        target: 1,
        earnedBy: 1234,
        rarityRank: 5,
        tips: ['选择简单的环保行动开始', '垃圾分类是很好的入门选择']
      },
      {
        id: 2,
        name: '分类达人',
        icon: '♻️',
        category: 'action',
        rarity: 'uncommon',
        description: '垃圾分类达到10次',
        requirement: '完成10次垃圾分类行动',
        points: 30,
        earned: false,
        progress: 60,
        current: 6,
        target: 10,
        earnedBy: 856,
        rarityRank: 4,
        tips: ['每天坚持分类垃圾', '学习更多分类知识', '分享给家人朋友']
      },
      {
        id: 3,
        name: '绿色出行者',
        icon: '🚲',
        category: 'action',
        rarity: 'rare',
        description: '绿色出行达到20次',
        requirement: '完成20次绿色出行行动',
        points: 50,
        earned: false,
        progress: 35,
        current: 7,
        target: 20,
        earnedBy: 432,
        rarityRank: 3,
        tips: ['选择公共交通或骑行', '记录每次绿色出行', '邀请朋友一起参与']
      },
      
      // 挑战类勋章
      {
        id: 4,
        name: '挑战新手',
        icon: '🎯',
        category: 'challenge',
        rarity: 'common',
        description: '完成第一个环保挑战',
        requirement: '完成任意1个环保挑战',
        points: 25,
        earned: true,
        earnedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 100,
        current: 1,
        target: 1,
        earnedBy: 987,
        rarityRank: 5
      },
      {
        id: 5,
        name: '挑战达人',
        icon: '🏆',
        category: 'challenge',
        rarity: 'rare',
        description: '完成10个环保挑战',
        requirement: '完成10个不同类型的环保挑战',
        points: 100,
        earned: false,
        progress: 20,
        current: 2,
        target: 10,
        earnedBy: 234,
        rarityRank: 2,
        bonusRewards: '专属头像框',
        tips: ['尝试不同类型的挑战', '坚持完成每日挑战', '参与社群活动']
      },
      
      // 特殊类勋章
      {
        id: 6,
        name: '环保传播者',
        icon: '📢',
        category: 'special',
        rarity: 'epic',
        description: '邀请5位朋友加入',
        requirement: '成功邀请5位朋友注册并完成首次行动',
        points: 80,
        earned: false,
        progress: 40,
        current: 2,
        target: 5,
        earnedBy: 123,
        rarityRank: 2,
        bonusRewards: '环保使者称号'
      },
      {
        id: 7,
        name: '绿色守护神',
        icon: '🌍',
        category: 'special',
        rarity: 'legendary',
        description: '累计减少碳排放1000kg',
        requirement: '通过环保行动累计减少1000kg碳排放',
        points: 200,
        earned: false,
        progress: 15,
        current: 150,
        target: 1000,
        earnedBy: 45,
        rarityRank: 1,
        bonusRewards: '传说级勋章 + 专属徽章'
      },
      
      // 里程碑勋章
      {
        id: 8,
        name: '百日环保',
        icon: '📅',
        category: 'milestone',
        rarity: 'uncommon',
        description: '连续100天记录环保行动',
        requirement: '连续100天都有环保行动记录',
        points: 60,
        earned: false,
        progress: 25,
        current: 25,
        target: 100,
        earnedBy: 567,
        rarityRank: 4
      },
      {
        id: 9,
        name: '千分达人',
        icon: '⭐',
        category: 'milestone',
        rarity: 'rare',
        description: '累计获得1000积分',
        requirement: '总积分达到1000分',
        points: 50,
        earned: false,
        progress: 45,
        current: 450,
        target: 1000,
        earnedBy: 789,
        rarityRank: 3
      }
    ]

    const filteredBadges = computed(() => {
      if (activeCategory.value === 'all') {
        return allBadges
      }
      return allBadges.filter(badge => badge.category === activeCategory.value)
    })

    const earnedBadges = computed(() => {
      return allBadges.filter(badge => badge.earned)
    })

    const totalBadges = computed(() => {
      return allBadges.length
    })

    const completionRate = computed(() => {
      return Math.round((earnedBadges.value.length / totalBadges.value) * 100)
    })

    const legendaryCount = computed(() => {
      return earnedBadges.value.filter(badge => badge.rarity === 'legendary').length
    })

    const getBadgeCount = (categoryId) => {
      if (categoryId === 'all') return allBadges.length
      return allBadges.filter(badge => badge.category === categoryId).length
    }

    const getRarityText = (rarity) => {
      const rarityMap = {
        'common': '普通',
        'uncommon': '稀有',
        'rare': '罕见',
        'epic': '史诗',
        'legendary': '传说'
      }
      return rarityMap[rarity] || rarity
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-CN')
    }

    const setActiveCategory = (categoryId) => {
      activeCategory.value = categoryId
    }

    const showPreview = (badge) => {
      if (!badge.earned) {
        previewBadge.value = badge.id
      }
    }

    const hidePreview = () => {
      previewBadge.value = null
    }

    const showBadgeDetail = (badge) => {
      selectedBadge.value = badge
      showDetailModal.value = true
    }

    const closeDetail = () => {
      showDetailModal.value = false
      selectedBadge.value = null
    }

    const focusOnTask = () => {
      closeDetail()
      alert('已添加到专注任务列表！')
    }

    const shareBadge = () => {
      alert(`分享成就：${selectedBadge.value?.name}`)
    }

    const showUnlockAnimation = (badge) => {
      newBadge.value = badge
      unlockAnimation.value = true
      setTimeout(() => {
        unlockAnimation.value = false
        newBadge.value = null
      }, 3000)
    }

    return {
      store,
      activeCategory,
      previewBadge,
      showDetailModal,
      selectedBadge,
      unlockAnimation,
      newBadge,
      categories,
      allBadges,
      filteredBadges,
      earnedBadges,
      totalBadges,
      completionRate,
      legendaryCount,
      getBadgeCount,
      getRarityText,
      formatDate,
      setActiveCategory,
      showPreview,
      hidePreview,
      showBadgeDetail,
      closeDetail,
      focusOnTask,
      shareBadge,
      showUnlockAnimation
    }
  }
}
</script>

<style scoped>
.badge-system {
  background: white;
  border-radius: 25px;
  padding: 40px;
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.12);
  max-width: 1400px;
  margin: 0 auto;
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.badge-header {
  text-align: center;
  margin-bottom: 30px;
}

.badge-header h2 {
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 1.8rem;
}

.badge-header p {
  color: #7f8c8d;
  font-size: 1.1rem;
}

.badge-categories {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
  justify-content: center;
}

.category-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #f8f9fa;
  border: 2px solid #e0e0e0;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.category-btn.active {
  background: #f39c12;
  border-color: #f39c12;
  color: white;
}

.category-icon {
  font-size: 1.1rem;
}

.category-count {
  font-size: 0.8rem;
  opacity: 0.8;
}

.badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}

.badge-card {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 25px;
  border: 2px solid #e0e0e0;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: visible;
}

.badge-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.badge-card.earned {
  border-color: #27ae60;
  background: linear-gradient(135deg, #f1f8e9 0%, #dcedc8 100%);
}

.badge-card.locked {
  opacity: 0.7;
  border-color: #bdc3c7;
}

.badge-visual {
  text-align: center;
  margin-bottom: 15px;
  position: relative;
}

.badge-icon {
  font-size: 4rem;
  margin-bottom: 15px;
  position: relative;
  display: inline-block;
}

.locked-icon {
  color: #bdc3c7;
  position: relative;
}

.badge-icon.earned {
  animation: badgeShine 3s ease-in-out infinite;
}

@keyframes badgeShine {
  0%, 100% { 
    transform: scale(1) rotate(0deg);
    filter: brightness(1);
  }
  50% { 
    transform: scale(1.05) rotate(2deg);
    filter: brightness(1.2);
  }
}

.badge-icon.legendary {
  animation: legendaryPulse 2s ease-in-out infinite;
}

@keyframes legendaryPulse {
  0%, 100% { 
    box-shadow: 0 0 10px rgba(243, 156, 18, 0.5);
    transform: scale(1);
  }
  50% { 
    box-shadow: 0 0 25px rgba(243, 156, 18, 0.8);
    transform: scale(1.1);
  }
}

.badge-rarity {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 15px;
  font-size: 0.7rem;
  font-weight: bold;
  color: white;
}

.badge-rarity.common { background: #95a5a6; }
.badge-rarity.uncommon { background: #27ae60; }
.badge-rarity.rare { background: #3498db; }
.badge-rarity.epic { background: #9b59b6; }
.badge-rarity.legendary { 
  background: linear-gradient(135deg, #f39c12, #e67e22);
  animation: legendary-glow 2s ease-in-out infinite;
}

@keyframes legendary-glow {
  0%, 100% { box-shadow: 0 0 10px rgba(243, 156, 18, 0.5); }
  50% { box-shadow: 0 0 20px rgba(243, 156, 18, 0.8); }
}

.badge-info h3 {
  color: #2c3e50;
  margin-bottom: 8px;
  text-align: center;
}

.badge-description {
  color: #7f8c8d;
  font-size: 0.9rem;
  line-height: 1.4;
  text-align: center;
  margin-bottom: 15px;
}

.badge-progress {
  margin-top: 15px;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: #ecf0f1;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #27ae60, #2ecc71);
  transition: width 0.5s ease;
}

.progress-text {
  font-size: 0.8rem;
  color: #7f8c8d;
  text-align: right;
  display: block;
}

.badge-earned-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  font-size: 0.8rem;
}

.earned-date {
  color: #7f8c8d;
}

.badge-points {
  color: #27ae60;
  font-weight: bold;
}

.badge-preview {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 15px;
  margin-top: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 100;
}

.badge-preview h4 {
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 1rem;
}

.badge-preview p {
  color: #7f8c8d;
  font-size: 0.8rem;
  margin-bottom: 10px;
  line-height: 1.3;
}

.preview-stats {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
}

.stat-item span:first-child {
  color: #7f8c8d;
}

.stat-item span:last-child {
  font-weight: bold;
  color: #2c3e50;
}

.stat-item span.common { color: #95a5a6; }
.stat-item span.uncommon { color: #27ae60; }
.stat-item span.rare { color: #3498db; }
.stat-item span.epic { color: #9b59b6; }
.stat-item span.legendary { color: #f39c12; }

.achievement-stats {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 40px;
}

.achievement-stats h3 {
  color: #2c3e50;
  margin-bottom: 25px;
  text-align: center;
  font-size: 1.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  text-align: center;
  padding: 25px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
}

.stat-icon {
  font-size: 2rem;
  margin-bottom: 10px;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: #27ae60;
  margin-bottom: 5px;
}

.stat-label {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.detail-modal {
  background: white;
  border-radius: 20px;
  padding: 30px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.detail-header {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.detail-visual {
  text-align: center;
  margin-right: 20px;
}

.detail-icon {
  font-size: 4rem;
  margin-bottom: 10px;
}

.detail-rarity {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: bold;
  color: white;
}

.detail-title h2 {
  color: #2c3e50;
  margin-bottom: 8px;
}

.detail-title p {
  color: #7f8c8d;
  line-height: 1.4;
}

.detail-section {
  margin-bottom: 20px;
}

.detail-section h4 {
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 1.1rem;
}

.detail-section p {
  color: #7f8c8d;
  line-height: 1.5;
}

.progress-detail {
  margin-bottom: 10px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #7f8c8d;
}

.completed-info {
  color: #27ae60;
  font-weight: bold;
}

.rewards-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.reward-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 8px;
}

.reward-icon {
  font-size: 1.2rem;
}

.reward-text {
  color: #2c3e50;
  font-weight: bold;
}

.detail-section ul {
  margin: 0;
  padding-left: 20px;
}

.detail-section li {
  color: #7f8c8d;
  margin-bottom: 8px;
  line-height: 1.4;
}

.badge-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.stat-row span:first-child {
  color: #7f8c8d;
}

.stat-row span:last-child {
  color: #2c3e50;
  font-weight: bold;
}

.detail-actions {
  display: flex;
  gap: 15px;
  margin-top: 25px;
}

.action-btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s ease;
}

.action-btn.primary {
  background: #27ae60;
  color: white;
}

.action-btn.primary:hover {
  background: #219a52;
}

.action-btn.secondary {
  background: #3498db;
  color: white;
}

.action-btn.secondary:hover {
  background: #2980b9;
}

.action-btn:not(.primary):not(.secondary) {
  background: #e0e0e0;
  color: #7f8c8d;
}

.action-btn:not(.primary):not(.secondary):hover {
  background: #bdc3c7;
}

.unlock-animation {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.3);
  z-index: 2000;
  text-align: center;
  animation: unlock-pop 0.5s ease-out;
}

@keyframes unlock-pop {
  0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
  100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
}

.animation-content h2 {
  color: #27ae60;
  margin-bottom: 20px;
  font-size: 1.8rem;
}

.unlock-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  animation: bounce 1s ease-in-out infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-20px); }
  60% { transform: translateY(-10px); }
}

.new-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 15px;
}

.badge-emoji {
  font-size: 2.5rem;
}

.badge-name {
  font-size: 1.3rem;
  color: #2c3e50;
  font-weight: bold;
}

.animation-content p {
  color: #27ae60;
  font-weight: bold;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .badge-system {
    padding: 20px;
  }
  
  .badge-categories {
    flex-direction: column;
    align-items: stretch;
  }
  
  .badges-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .detail-header {
    flex-direction: column;
    text-align: center;
  }
  
  .detail-visual {
    margin-right: 0;
    margin-bottom: 20px;
  }
  
  .detail-actions {
    flex-direction: column;
  }
}
</style>