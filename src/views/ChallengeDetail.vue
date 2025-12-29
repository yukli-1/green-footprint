<template>
  <div class="challenge-detail">
    <NavBar />
    
    <div class="content-container">
      <!-- 返回按钮 -->
      <div class="back-button" @click="goBack">
        <span class="back-icon">←</span>
        <span>返回挑战列表</span>
      </div>
      
      <!-- 挑战头部信息 -->
      <section class="challenge-header">
        <div class="challenge-visual">
          <img :src="getChallengeImage(challenge.type)" :alt="challenge.title" class="challenge-image"/>
          <div class="challenge-badge" :class="challenge.status">
            {{ getStatusText(challenge.status) }}
          </div>
        </div>
        
        <div class="challenge-info">
          <h1>{{ challenge.title }}</h1>
          <div class="challenge-meta">
            <div class="meta-item">
              <span class="meta-icon">🏷️</span>
              <span>{{ challenge.type }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-icon">👥</span>
              <span>{{ challenge.participants }} 人参与</span>
            </div>
            <div class="meta-item">
              <span class="meta-icon">⏰</span>
              <span>{{ getRemainingTime(challenge.deadline) }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-icon">🎁</span>
              <span>{{ challenge.reward }} 积分奖励</span>
            </div>
          </div>
          
          <div class="creator-info">
            <span class="creator-label">创建者：</span>
            <span class="creator-name">{{ challenge.creator }}</span>
          </div>
        </div>
      </section>
      
      <!-- 挑战详细描述 -->
      <section class="challenge-description">
        <h2>📋 挑战详情</h2>
        <div class="description-content">
          <p class="main-description">{{ challenge.description }}</p>
          
          <div class="detail-grid">
            <div class="detail-item">
              <h3>🎯 挑战目标</h3>
              <p>{{ getChallengeGoal(challenge) }}</p>
            </div>
            
            <div class="detail-item">
              <h3>📅 持续时间</h3>
              <p>{{ getDuration(challenge) }}</p>
            </div>
            
            <div class="detail-item">
              <h3>✅ 完成条件</h3>
              <p>{{ getCompletionCriteria(challenge) }}</p>
            </div>
            
            <div class="detail-item">
              <h3>💡 参与建议</h3>
              <p>{{ getTips(challenge) }}</p>
            </div>
          </div>
        </div>
      </section>
      
      <!-- 参与进度 -->
      <section class="challenge-progress" v-if="challenge.status === 'joined'">
        <h2>📊 我的进度</h2>
        <div class="progress-container">
          <div class="progress-circle">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="#e0e0e0"
                stroke-width="8"
              />
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                :stroke="getProgressColor(challenge.progress)"
                stroke-width="8"
                stroke-linecap="round"
                :stroke-dasharray="getProgressDash(challenge.progress)"
                transform="rotate(-90 60 60)"
                class="progress-circle-path"
              />
            </svg>
            <div class="progress-text">
              <span class="progress-value">{{ challenge.progress }}%</span>
            </div>
          </div>
          
          <div class="progress-details">
            <div class="progress-stat">
              <span class="stat-label">已完成天数</span>
              <span class="stat-value">{{ getCompletedDays(challenge) }}</span>
            </div>
            <div class="progress-stat">
              <span class="stat-label">剩余天数</span>
              <span class="stat-value">{{ getRemainingDays(challenge) }}</span>
            </div>
            <div class="progress-stat">
              <span class="stat-label">连续签到</span>
              <span class="stat-value">{{ getStreakDays(challenge) }}</span>
            </div>
          </div>
        </div>
      </section>
      
      <!-- 参与者列表 -->
      <section class="participants">
        <h2>👥 参与者 ({{ challenge.participants }}人)</h2>
        <div class="participants-grid">
          <div 
            v-for="participant in participants" 
            :key="participant.id"
            class="participant-card"
          >
            <div class="participant-avatar">{{ participant.avatar }}</div>
            <div class="participant-info">
              <div class="participant-name">{{ participant.name }}</div>
              <div class="participant-stats">
                <span>进度 {{ participant.progress }}%</span>
                <span>连续 {{ participant.streak }} 天</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="load-more" v-if="hasMoreParticipants" @click="loadMoreParticipants">
          加载更多参与者
        </div>
      </section>
      
      <!-- 相关挑战 -->
      <section class="related-challenges">
        <h2>🔗 相关挑战</h2>
        <div class="related-grid">
          <div 
            v-for="relatedChallenge in relatedChallenges" 
            :key="relatedChallenge.id"
            class="related-card"
            @click="navigateToChallenge(relatedChallenge.id)"
          >
            <div class="related-visual">
              <img :src="getChallengeImage(relatedChallenge.type)" :alt="relatedChallenge.title" class="related-image"/>
            </div>
            <h4>{{ relatedChallenge.title }}</h4>
            <p>{{ relatedChallenge.description }}</p>
            <div class="related-meta">
              <span>{{ relatedChallenge.participants }} 人参与</span>
              <span>{{ relatedChallenge.reward }} 积分</span>
            </div>
          </div>
        </div>
      </section>
      
      <!-- 操作按钮 -->
      <section class="challenge-actions">
        <button 
          v-if="challenge.status === 'available'"
          @click="joinChallenge"
          class="action-btn join-btn"
        >
          <span class="btn-icon">🚀</span>
          <span>立即参加挑战</span>
        </button>
        
        <button 
          v-if="challenge.status === 'joined'"
          @click="checkInChallenge"
          class="action-btn checkin-btn"
        >
          <span class="btn-icon">✅</span>
          <span>今日签到</span>
        </button>
        
        <button 
          v-if="challenge.status === 'completed'"
          @click="shareChallenge"
          class="action-btn share-btn"
        >
          <span class="btn-icon">📤</span>
          <span>分享成果</span>
        </button>
        
        <button 
          @click="toggleFavorite"
          class="action-btn favorite-btn"
          :class="{ active: isFavorite }"
        >
          <span class="btn-icon">{{ isFavorite ? '❤️' : '🤍' }}</span>
          <span>{{ isFavorite ? '已收藏' : '收藏挑战' }}</span>
        </button>
      </section>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { store } from '../store'
import NavBar from '../components/NavBar.vue'

export default {
  name: 'ChallengeDetail',
  components: {
    NavBar
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const isFavorite = ref(false)
    
    // 模拟挑战数据
    const challenges = [
      {
        id: 1,
        title: '7天零塑料挑战',
        description: '连续7天不使用一次性塑料制品，记录每天的环保行动。这个挑战旨在减少塑料污染，培养环保生活习惯。每天需要记录当天的环保行动，比如使用环保袋、拒绝一次性餐具等。',
        type: '垃圾分类',
        status: 'available',
        participants: 1234,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        reward: 100,
        progress: 0,
        creator: '环保达人',
        createdAt: new Date().toISOString(),
        duration: 7
      },
      {
        id: 2,
        title: '30天绿色出行',
        description: '一个月内选择绿色出行方式20次以上，减少碳排放。包括步行、骑行、公共交通等方式，每次出行需记录时间和距离。',
        type: '绿色出行',
        status: 'joined',
        participants: 856,
        deadline: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000).toISOString(),
        reward: 200,
        progress: 45,
        creator: '绿色出行联盟',
        createdAt: new Date().toISOString(),
        duration: 30,
        completedDays: 9,
        streak: 3
      },
      {
        id: 3,
        title: '垃圾分类达人赛',
        description: '正确分类垃圾100次，分享分类经验。每天记录垃圾分类情况，拍照上传，分享分类技巧和心得。',
        type: '垃圾分类',
        status: 'completed',
        participants: 432,
        deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        reward: 150,
        progress: 100,
        creator: '垃圾分类推广中心',
        createdAt: new Date().toISOString(),
        duration: 15,
        completedDays: 15,
        streak: 15
      },
      {
        id: 4,
        title: '节能减排月',
        description: '记录日常节能行为，累计节能50小时。包括关灯节电、节约用水、调节空调温度等，每次节能行为需记录时长。',
        type: '节约能源',
        status: 'available',
        participants: 567,
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        reward: 180,
        progress: 0,
        creator: '节能环保协会',
        createdAt: new Date().toISOString(),
        duration: 30
      }
    ]
    
    const participants = ref([
      { id: 1, name: '环保小卫士', avatar: '🦸', progress: 85, streak: 6 },
      { id: 2, name: '绿色达人', avatar: '🌿', progress: 92, streak: 8 },
      { id: 3, name: '地球守护者', avatar: '🌍', progress: 78, streak: 5 },
      { id: 4, name: '节能先锋', avatar: '💡', progress: 65, streak: 4 },
      { id: 5, name: '分类专家', avatar: '♻️', progress: 88, streak: 7 },
      { id: 6, name: '低碳生活家', avatar: '🌱', progress: 73, streak: 3 },
      { id: 7, name: '自然保护者', avatar: '🌲', progress: 95, streak: 9 },
      { id: 8, name: '清洁能源倡导者', avatar: '⚡', progress: 82, streak: 6 }
    ])
    
    const hasMoreParticipants = ref(true)
    
    const challenge = computed(() => {
      const challengeId = parseInt(route.params.id)
      return challenges.find(c => c.id === challengeId) || challenges[0]
    })
    
    const relatedChallenges = computed(() => {
      return challenges.filter(c => 
        c.id !== challenge.value.id && 
        c.type === challenge.value.type
      ).slice(0, 3)
    })
    
    const getStatusText = (status) => {
      const statusMap = {
        'available': '可参加',
        'joined': '进行中',
        'completed': '已完成'
      }
      return statusMap[status] || status
    }
    
    const getRemainingTime = (deadline) => {
      const now = new Date()
      const end = new Date(deadline)
      const diff = end - now
      
      if (diff <= 0) return '已结束'
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      if (days > 0) return `${days}天后结束`
      
      const hours = Math.floor(diff / (1000 * 60 * 60))
      if (hours > 0) return `${hours}小时后结束`
      
      const minutes = Math.floor(diff / (1000 * 60))
      return `${minutes}分钟后结束`
    }
    
    const getChallengeImage = (type) => {
      const challengeImages = {
        '垃圾分类': '/images/scenarios/recycling.svg',
        '绿色出行': '/images/scenarios/green-transport.svg',
        '节约能源': '/images/scenarios/green-transport.svg',
        '植树造林': '/images/scenarios/recycling.svg'
      }
      return challengeImages[type] || '/images/scenarios/green-transport.svg'
    }
    
    const getChallengeGoal = (challenge) => {
      const goals = {
        '垃圾分类': '在7天内完全不使用一次性塑料制品，培养环保购物习惯',
        '绿色出行': '在30天内选择绿色出行方式20次，减少碳排放',
        '节约能源': '累计节能行为50小时，包括节电、节水等',
        '植树造林': '参与植树活动，记录种植和养护过程'
      }
      return goals[challenge.type] || '完成环保挑战目标'
    }
    
    const getDuration = (challenge) => {
      return `${challenge.duration} 天`
    }
    
    const getCompletionCriteria = (challenge) => {
      const criteria = {
        '垃圾分类': '连续7天不使用一次性塑料制品，每日签到记录环保行动',
        '绿色出行': '30天内完成20次绿色出行，每次需记录出行方式',
        '节约能源': '累计50小时节能行为，包括关灯、节水、调温等',
        '植树造林': '完成植树活动，记录种植位置和树木数量'
      }
      return criteria[challenge.type] || '按照挑战要求完成相应环保行动'
    }
    
    const getTips = (challenge) => {
      const tips = {
        '垃圾分类': '准备环保袋、保温杯，提前规划购物清单，拒绝过度包装商品',
        '绿色出行': '提前规划路线，选择公共交通，拼车出行，短距离选择步行或骑行',
        '节约能源': '随手关灯，拔掉不用的电器插头，合理设置空调温度',
        '植树造林': '选择适合当地气候的树种，学习正确的种植和养护方法'
      }
      return tips[challenge.type] || '坚持环保理念，从小事做起，养成良好习惯'
    }
    
    const getProgressColor = (progress) => {
      if (progress < 30) return '#e74c3c'
      if (progress < 70) return '#f39c12'
      return '#27ae60'
    }
    
    const getProgressDash = (progress) => {
      const circumference = 2 * Math.PI * 54
      const dashLength = (progress / 100) * circumference
      return `${dashLength} ${circumference}`
    }
    
    const getCompletedDays = (challenge) => {
      return challenge.completedDays || Math.floor(challenge.progress * challenge.duration / 100) || 0
    }
    
    const getRemainingDays = (challenge) => {
      const completed = getCompletedDays(challenge)
      return Math.max(0, challenge.duration - completed)
    }
    
    const getStreakDays = (challenge) => {
      return challenge.streak || 0
    }
    
    const goBack = () => {
      router.push('/community-challenge')
    }
    
    const navigateToChallenge = (challengeId) => {
      router.push(`/challenge/${challengeId}`)
    }
    
    const joinChallenge = () => {
      if (!store.user.isLoggedIn) {
        alert('请先登录')
        return
      }
      
      challenge.value.status = 'joined'
      challenge.value.progress = 10
      challenge.value.participants += 1
      isFavorite.value = false
      
      alert(`成功参加挑战：${challenge.value.title}`)
    }
    
    const checkInChallenge = () => {
      challenge.value.progress = Math.min(100, challenge.value.progress + 10)
      if (challenge.value.progress >= 100) {
        challenge.value.status = 'completed'
        store.user.totalPoints += challenge.value.reward
        alert(`挑战完成！获得 ${challenge.value.reward} 积分`)
      } else {
        alert('签到成功！继续加油！')
      }
    }
    
    const shareChallenge = () => {
      alert(`分享挑战成果：${challenge.value.title}`)
    }
    
    const toggleFavorite = () => {
      isFavorite.value = !isFavorite.value
      alert(isFavorite.value ? '已收藏挑战' : '已取消收藏')
    }
    
    const loadMoreParticipants = () => {
      // 模拟加载更多参与者
      setTimeout(() => {
        hasMoreParticipants.value = false
      }, 1000)
    }
    
    onMounted(() => {
      // 模拟检查是否已收藏
      isFavorite.value = Math.random() > 0.5
    })
    
    return {
      store,
      challenge,
      participants,
      relatedChallenges,
      hasMoreParticipants,
      isFavorite,
      getStatusText,
      getRemainingTime,
      getChallengeImage,
      getChallengeGoal,
      getDuration,
      getCompletionCriteria,
      getTips,
      getProgressColor,
      getProgressDash,
      getCompletedDays,
      getRemainingDays,
      getStreakDays,
      goBack,
      navigateToChallenge,
      joinChallenge,
      checkInChallenge,
      shareChallenge,
      toggleFavorite,
      loadMoreParticipants
    }
  }
}
</script>

<style scoped>
.challenge-detail {
  min-height: 100vh;
  background: transparent;
  padding-bottom: 40px;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 30px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid var(--accent-2);
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  color: var(--accent-2);
  font-weight: bold;
  width: fit-content;
}

.back-button:hover {
  background: var(--accent-2);
  color: white;
  transform: translateY(-2px);
}

.back-icon {
  font-size: 1.2rem;
}

.challenge-header {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 40px;
  margin-bottom: 40px;
  padding: 30px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.challenge-visual {
  position: relative;
}

.challenge-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.challenge-badge {
  position: absolute;
  top: -10px;
  right: -10px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
  color: white;
}

.challenge-badge.available {
  background: #27ae60;
}

.challenge-badge.joined {
  background: #f39c12;
}

.challenge-badge.completed {
  background: #95a5a6;
}

.challenge-info h1 {
  color: var(--text-heading, #123e2e);
  font-size: 2.2rem;
  margin-bottom: 20px;
  line-height: 1.2;
}

.challenge-meta {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  color: #7f8c8d;
}

.meta-icon {
  font-size: 1.1rem;
}

.creator-info {
  padding: 15px;
  background: rgba(52, 152, 219, 0.1);
  border-radius: 10px;
  font-size: 0.9rem;
}

.creator-label {
  color: #7f8c8d;
}

.creator-name {
  font-weight: bold;
  color: var(--accent-2);
}

.challenge-description {
  margin-bottom: 40px;
}

.challenge-description h2 {
  color: var(--text-heading, #123e2e);
  font-size: 1.8rem;
  margin-bottom: 25px;
}

.main-description {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #2c3e50;
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 15px;
  border-left: 4px solid var(--accent);
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
}

.detail-item {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 15px;
  padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.detail-item h3 {
  color: var(--text-heading, #123e2e);
  font-size: 1.1rem;
  margin-bottom: 10px;
}

.detail-item p {
  color: #7f8c8d;
  line-height: 1.5;
  font-size: 0.95rem;
}

.challenge-progress {
  margin-bottom: 40px;
}

.challenge-progress h2 {
  color: var(--text-heading, #123e2e);
  font-size: 1.8rem;
  margin-bottom: 25px;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 40px;
  padding: 30px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 20px;
}

.progress-circle {
  position: relative;
}

.progress-circle-path {
  transition: stroke-dasharray 0.5s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.progress-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--text-heading, #123e2e);
}

.progress-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.progress-stat {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.stat-label {
  font-size: 0.9rem;
  color: #7f8c8d;
}

.stat-value {
  font-size: 1.3rem;
  font-weight: bold;
  color: var(--accent);
}

.participants {
  margin-bottom: 40px;
}

.participants h2 {
  color: var(--text-heading, #123e2e);
  font-size: 1.8rem;
  margin-bottom: 25px;
}

.participants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 25px;
}

.participant-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 15px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.participant-card:hover {
  transform: translateY(-3px);
}

.participant-avatar {
  font-size: 2.5rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(52, 152, 219, 0.1);
  border-radius: 50%;
}

.participant-info {
  flex: 1;
}

.participant-name {
  font-weight: bold;
  color: var(--text-heading, #123e2e);
  margin-bottom: 5px;
}

.participant-stats {
  display: flex;
  gap: 15px;
  font-size: 0.9rem;
  color: #7f8c8d;
}

.load-more {
  text-align: center;
  padding: 15px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.3s ease;
  color: var(--accent-2);
}

.load-more:hover {
  background: var(--accent-2);
  color: white;
}

.related-challenges {
  margin-bottom: 40px;
}

.related-challenges h2 {
  color: var(--text-heading, #123e2e);
  font-size: 1.8rem;
  margin-bottom: 25px;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
}

.related-card {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 15px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.related-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.related-visual {
  height: 120px;
  margin-bottom: 15px;
  border-radius: 10px;
  overflow: hidden;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.related-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.related-card h4 {
  color: var(--text-heading, #123e2e);
  margin-bottom: 10px;
}

.related-card p {
  color: #7f8c8d;
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 15px;
}

.related-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #7f8c8d;
}

.challenge-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 15px 20px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: all 0.3s ease;
}

.join-btn {
  background: linear-gradient(135deg, #27ae60, #2ecc71);
  color: white;
}

.join-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(39, 174, 96, 0.3);
}

.checkin-btn {
  background: linear-gradient(135deg, #f39c12, #e67e22);
  color: white;
}

.checkin-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(243, 156, 18, 0.3);
}

.share-btn {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
}

.share-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(52, 152, 219, 0.3);
}

.favorite-btn {
  background: rgba(255, 255, 255, 0.8);
  color: #7f8c8d;
  border: 2px solid #e0e0e0;
}

.favorite-btn.active {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
  border-color: #e74c3c;
}

.favorite-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.btn-icon {
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .challenge-header {
    grid-template-columns: 1fr;
    gap: 25px;
  }
  
  .challenge-meta {
    grid-template-columns: 1fr;
  }
  
  .progress-container {
    flex-direction: column;
    gap: 25px;
  }
  
  .challenge-actions {
    grid-template-columns: 1fr;
  }
  
  .participants-grid,
  .related-grid {
    grid-template-columns: 1fr;
  }
}
</style>