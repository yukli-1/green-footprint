<template>
  <div class="community-challenge">
    <NavBar />
    
    <div class="content-container">
      <h1>🏆 社群挑战</h1>
      
      <!-- 功能标签 -->
      <section class="challenge-tags">
        <div class="tag-tabs">
          <button 
            v-for="tag in tags" 
            :key="tag.id"
            class="tag-btn"
            :class="{ active: activeTag === tag.id }"
            @click="setActiveTag(tag.id)"
          >
            <span class="tag-icon">{{ tag.icon }}</span>
            {{ tag.name }}
          </button>
        </div>
      </section>

      <!-- 挑战内容卡片 -->
      <section class="challenges-section">
        <div class="section-header">
          <h2>{{ getCurrentTagTitle() }}</h2>
          <button class="create-btn" @click="showCreateModal = true">
            ✨ 创建挑战
          </button>
        </div>

        <div class="challenges-grid">
          <div 
            v-for="challenge in filteredChallenges" 
            :key="challenge.id"
            class="challenge-card"
            @click="viewChallengeDetail(challenge)"
          >
            <div class="challenge-header">
              <div class="challenge-type">{{ challenge.type }}</div>
              <div class="challenge-status" :class="challenge.status">
                {{ getStatusText(challenge.status) }}
              </div>
            </div>
            
            <div class="challenge-visual">
              <span class="challenge-emoji">{{ getChallengeEmoji(challenge.type) }}</span>
            </div>
            
            <h3>{{ challenge.title }}</h3>
            <p class="challenge-description">{{ challenge.description }}</p>
            
            <div class="challenge-meta">
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
                <span>{{ challenge.reward }} 积分</span>
              </div>
            </div>

            <div class="challenge-progress" v-if="challenge.status === 'joined'">
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: challenge.progress + '%' }"
                ></div>
              </div>
              <span class="progress-text">{{ challenge.progress }}% 完成</span>
            </div>

            <div class="challenge-actions">
              <button 
                v-if="challenge.status === 'available'"
                @click.stop="joinChallenge(challenge)"
                class="join-btn"
              >
                参加挑战
              </button>
              <button 
                v-if="challenge.status === 'joined'"
                @click.stop="checkInChallenge(challenge)"
                class="checkin-btn"
              >
                签到
              </button>
              <button 
                @click.stop="shareChallenge(challenge)"
                class="share-btn"
              >
                分享
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- 排行榜 -->
      <section class="leaderboard">
        <h2>🏅 挑战排行榜</h2>
        <div class="leaderboard-tabs">
          <button 
            v-for="tab in leaderboardTabs" 
            :key="tab.id"
            class="leaderboard-tab"
            :class="{ active: activeLeaderboardTab === tab.id }"
            @click="activeLeaderboardTab = tab.id"
          >
            {{ tab.name }}
          </button>
        </div>
        
        <div class="leaderboard-content">
          <div class="leaderboard-list">
            <div 
              v-for="(user, index) in getCurrentLeaderboard()" 
              :key="user.id"
              class="leaderboard-item"
              :class="{ 'top-three': index < 3 }"
            >
              <div class="rank">
                <span v-if="index === 0">🥇</span>
                <span v-else-if="index === 1">🥈</span>
                <span v-else-if="index === 2">🥉</span>
                <span v-else>{{ index + 1 }}</span>
              </div>
              <div class="user-info">
                <div class="user-avatar">{{ user.avatar }}</div>
                <div class="user-details">
                  <div class="user-name">{{ user.name }}</div>
                  <div class="user-stats">{{ user.completedChallenges }} 个挑战完成</div>
                </div>
              </div>
              <div class="user-points">{{ user.points }} 分</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 我的挑战 -->
      <section class="my-challenges" v-if="store.user.isLoggedIn">
        <h2>🎯 我的挑战</h2>
        <div class="my-challenges-grid">
          <div 
            v-for="challenge in myChallenges" 
            :key="challenge.id"
            class="my-challenge-card"
          >
            <div class="challenge-header">
              <h4>{{ challenge.title }}</h4>
              <span class="challenge-status" :class="challenge.status">
                {{ getStatusText(challenge.status) }}
              </span>
            </div>
            <div class="challenge-info">
              <p>{{ challenge.description }}</p>
              <div class="challenge-stats">
                <span>⏰ {{ getRemainingTime(challenge.deadline) }}</span>
                <span>🎯 {{ challenge.progress }}% 完成</span>
              </div>
            </div>
            <div class="challenge-actions">
              <button 
                v-if="challenge.status === 'joined'"
                @click="checkInChallenge(challenge)"
                class="checkin-btn"
              >
                今日签到
              </button>
              <button 
                v-if="challenge.status === 'completed'"
                @click="shareResult(challenge)"
                class="share-result-btn"
              >
                分享成果
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- 创建挑战模态框 -->
    <div v-if="showCreateModal" class="modal-overlay" @click="showCreateModal = false">
      <div class="modal-content" @click.stop>
        <h2>创建新挑战</h2>
        <form @submit.prevent="createChallenge">
          <div class="form-group">
            <label>挑战标题</label>
            <input v-model="newChallenge.title" required>
          </div>
          <div class="form-group">
            <label>挑战描述</label>
            <textarea v-model="newChallenge.description" required></textarea>
          </div>
          <div class="form-group">
            <label>挑战类型</label>
            <select v-model="newChallenge.type" required>
              <option value="垃圾分类">垃圾分类</option>
              <option value="绿色出行">绿色出行</option>
              <option value="节约能源">节约能源</option>
              <option value="植树造林">植树造林</option>
            </select>
          </div>
          <div class="form-group">
            <label>持续天数</label>
            <input type="number" v-model.number="newChallenge.duration" min="1" required>
          </div>
          <div class="form-group">
            <label>积分奖励</label>
            <input type="number" v-model.number="newChallenge.reward" min="10" required>
          </div>
          <div class="form-actions">
            <button type="button" @click="showCreateModal = false">取消</button>
            <button type="submit">创建挑战</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../store'
import NavBar from '../components/NavBar.vue'

export default {
  name: 'CommunityChallenge',
  components: {
    NavBar
  },
  setup() {
    const router = useRouter()
    const activeTag = ref('all')
    const activeLeaderboardTab = ref('weekly')
    const showCreateModal = ref(false)
    
    const tags = [
      { id: 'all', name: '全部', icon: '🌟' },
      { id: 'recycling', name: '垃圾分类', icon: '♻️' },
      { id: 'transport', name: '绿色出行', icon: '🚲' },
      { id: 'energy', name: '节约能源', icon: '💡' },
      { id: 'planting', name: '植树造林', icon: '🌳' }
    ]

    const leaderboardTabs = [
      { id: 'daily', name: '日榜' },
      { id: 'weekly', name: '周榜' },
      { id: 'monthly', name: '月榜' }
    ]

    const challenges = ref([
      {
        id: 1,
        title: '7天零塑料挑战',
        description: '连续7天不使用一次性塑料制品，记录每天的环保行动',
        type: '垃圾分类',
        status: 'available',
        participants: 1234,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        reward: 100,
        progress: 0,
        creator: '环保达人',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        title: '30天绿色出行',
        description: '一个月内选择绿色出行方式20次以上，减少碳排放',
        type: '绿色出行',
        status: 'joined',
        participants: 856,
        deadline: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000).toISOString(),
        reward: 200,
        progress: 45,
        creator: '绿色出行联盟'
      },
      {
        id: 3,
        title: '垃圾分类达人赛',
        description: '正确分类垃圾100次，分享分类经验',
        type: '垃圾分类',
        status: 'completed',
        participants: 432,
        deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        reward: 150,
        progress: 100,
        creator: '垃圾分类推广中心'
      },
      {
        id: 4,
        title: '节能减排月',
        description: '记录日常节能行为，累计节能50小时',
        type: '节约能源',
        status: 'available',
        participants: 567,
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        reward: 180,
        progress: 0,
        creator: '节能环保协会'
      }
    ])

    const newChallenge = ref({
      title: '',
      description: '',
      type: '垃圾分类',
      duration: 7,
      reward: 50
    })

    const filteredChallenges = computed(() => {
      if (activeTag.value === 'all') {
        return challenges.value
      }
      const typeMap = {
        'recycling': '垃圾分类',
        'transport': '绿色出行',
        'energy': '节约能源',
        'planting': '植树造林'
      }
      return challenges.value.filter(challenge => 
        challenge.type === typeMap[activeTag.value]
      )
    })

    const myChallenges = computed(() => {
      return challenges.value.filter(challenge => 
        challenge.status === 'joined' || challenge.status === 'completed'
      )
    })

    const leaderboardData = {
      daily: [
        { id: 1, name: '环保小卫士', avatar: '🦸', points: 280, completedChallenges: 5 },
        { id: 2, name: '绿色达人', avatar: '🌿', points: 250, completedChallenges: 4 },
        { id: 3, name: '地球守护者', avatar: '🌍', points: 230, completedChallenges: 3 },
        { id: 4, name: '节能先锋', avatar: '💡', points: 200, completedChallenges: 4 },
        { id: 5, name: '分类专家', avatar: '♻️', points: 180, completedChallenges: 2 }
      ],
      weekly: [
        { id: 1, name: '环保小卫士', avatar: '🦸', points: 1500, completedChallenges: 25 },
        { id: 2, name: '绿色达人', avatar: '🌿', points: 1350, completedChallenges: 22 },
        { id: 3, name: '地球守护者', avatar: '🌍', points: 1200, completedChallenges: 18 },
        { id: 4, name: '节能先锋', avatar: '💡', points: 1100, completedChallenges: 20 },
        { id: 5, name: '分类专家', avatar: '♻️', points: 950, completedChallenges: 15 }
      ],
      monthly: [
        { id: 1, name: '环保小卫士', avatar: '🦸', points: 5800, completedChallenges: 85 },
        { id: 2, name: '绿色达人', avatar: '🌿', points: 5200, completedChallenges: 78 },
        { id: 3, name: '地球守护者', avatar: '🌍', points: 4800, completedChallenges: 65 },
        { id: 4, name: '节能先锋', avatar: '💡', points: 4200, completedChallenges: 70 },
        { id: 5, name: '分类专家', avatar: '♻️', points: 3800, completedChallenges: 55 }
      ]
    }

    const getCurrentTagTitle = () => {
      const tag = tags.find(t => t.id === activeTag.value)
      return tag ? tag.name + '挑战' : '全部挑战'
    }

    const getCurrentLeaderboard = () => {
      return leaderboardData[activeLeaderboardTab.value] || []
    }

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

    const setActiveTag = (tagId) => {
      activeTag.value = tagId
    }

    const joinChallenge = (challenge) => {
      if (!store.user.isLoggedIn) {
        alert('请先登录')
        return
      }
      challenge.status = 'joined'
      challenge.progress = 0
      alert(`成功参加挑战：${challenge.title}`)
    }

    const checkInChallenge = (challenge) => {
      challenge.progress = Math.min(100, challenge.progress + 10)
      if (challenge.progress >= 100) {
        challenge.status = 'completed'
        store.user.totalPoints += challenge.reward
        alert(`挑战完成！获得 ${challenge.reward} 积分`)
      } else {
        alert('签到成功！继续加油！')
      }
    }

    const shareChallenge = (challenge) => {
      alert(`分享挑战：${challenge.title}`)
    }

    const shareResult = (challenge) => {
      alert(`分享挑战成果：${challenge.title}`)
    }

    const viewChallengeDetail = (challenge) => {
      router.push(`/challenge/${challenge.id}`)
    }

    const createChallenge = () => {
      const challenge = {
        id: Date.now(),
        ...newChallenge.value,
        status: 'available',
        participants: 0,
        deadline: new Date(Date.now() + newChallenge.value.duration * 24 * 60 * 60 * 1000).toISOString(),
        progress: 0,
        creator: store.user.name || '匿名用户',
        createdAt: new Date().toISOString()
      }
      
      challenges.value.unshift(challenge)
      showCreateModal.value = false
      newChallenge.value = {
        title: '',
        description: '',
        type: '垃圾分类',
        duration: 7,
        reward: 50
      }
      alert('挑战创建成功！')
    }

    const getChallengeEmoji = (type) => {
      const challengeEmojis = {
        '垃圾分类': '♻️',
        '绿色出行': '🚲',
        '节约能源': '💡',
        '植树造林': '🌳'
      }
      return challengeEmojis[type] || '🌱'
    }

    return {
      store,
      activeTag,
      activeLeaderboardTab,
      showCreateModal,
      tags,
      leaderboardTabs,
      challenges,
      newChallenge,
      filteredChallenges,
      getChallengeEmoji,
      myChallenges,
      getCurrentTagTitle,
      getCurrentLeaderboard,
      getStatusText,
      getRemainingTime,
      setActiveTag,
      joinChallenge,
      checkInChallenge,
      shareChallenge,
      shareResult,
      viewChallengeDetail,
      createChallenge
    }
  }
}
</script>

<style scoped>
.community-challenge {
  min-height: 100vh;
  background: transparent;
  padding-bottom: 40px;
}

.content-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
}

h1 {
  text-align: center;
  color: var(--text-heading, #123e2e);
  font-size: 2.5rem;
  margin-bottom: 40px;
}

.challenge-tags {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 30px;
}

.tag-tabs {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
}

.tag-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #f8f9fa;
  border: 2px solid #e0e0e0;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.tag-btn:hover {
  border-color: var(--accent-2);
  transform: translateY(-2px);
}

.tag-btn.active {
  background: var(--accent-2);
  border-color: var(--accent-2);
  color: white;
}

.tag-icon {
  font-size: 1.2rem;
}

.challenges-section,
.leaderboard,
.my-challenges {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.section-header h2 {
  color: #2c3e50;
  font-size: 1.8rem;
  margin: 0;
}

.create-btn {
  padding: 10px 20px;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: background 0.3s ease;
  font-size: 1rem;
}

.create-btn:hover {
  background: #219a52;
}

.challenges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 30px;
}

.challenge-card {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 25px;
  border: 1px solid #e0e0e0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.challenge-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.challenge-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.challenge-visual {
  width: 100%;
  height: 160px;
  margin: 15px 0;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(135deg, #e8f5e8 0%, #dcedc8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.challenge-emoji {
  font-size: 5rem;
}

.challenge-type {
  background: var(--accent-2);
  color: white;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
}

.challenge-status {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
}

.challenge-status.available {
  background: #e8f5e8;
  color: var(--accent);
}

.challenge-status.joined {
  background: #fff3cd;
  color: #f39c12;
}

.challenge-status.completed {
  background: #d4edda;
  color: #155724;
}

.challenge-card h3 {
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 1.3rem;
}

.challenge-description {
  color: #7f8c8d;
  line-height: 1.5;
  margin-bottom: 20px;
}

.challenge-meta {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  color: #7f8c8d;
}

.meta-icon {
  font-size: 1rem;
}

.challenge-progress {
  margin-bottom: 20px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #ecf0f1;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #27ae60, #2ecc71);
  transition: width 0.5s ease;
}

.progress-text {
  font-size: 0.9rem;
  color: #7f8c8d;
  text-align: right;
}

.challenge-actions {
  display: flex;
  gap: 10px;
}

.join-btn,
.checkin-btn,
.share-btn,
.share-result-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: bold;
}

.join-btn {
  background: #27ae60;
  color: white;
}

.join-btn:hover {
  background: #219a52;
}

.checkin-btn {
  background: #f39c12;
  color: white;
}

.checkin-btn:hover {
  background: #e67e22;
}

.share-btn,
.share-result-btn {
  background: #3498db;
  color: white;
}

.share-btn:hover,
.share-result-btn:hover {
  background: #2980b9;
}

.leaderboard-tabs {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
  justify-content: center;
}

.leaderboard-tab {
  padding: 10px 20px;
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.leaderboard-tab.active {
  background: #f39c12;
  color: white;
  border-color: #f39c12;
}

.leaderboard-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.leaderboard-item {
  display: flex;
  align-items: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  transition: transform 0.3s ease;
}

.leaderboard-item:hover {
  transform: translateX(5px);
}

.leaderboard-item.top-three {
  background: linear-gradient(135deg, #fff9c4 0%, #fff59d 100%);
  border-color: #fbc02d;
}

.rank {
  font-size: 1.5rem;
  font-weight: bold;
  width: 50px;
  text-align: center;
}

.user-info {
  display: flex;
  align-items: center;
  flex: 1;
  margin-left: 20px;
}

.user-avatar {
  font-size: 2rem;
  margin-right: 15px;
}

.user-name {
  font-weight: bold;
  color: #2c3e50;
}

.user-stats {
  font-size: 0.9rem;
  color: #7f8c8d;
}

.user-points {
  font-size: 1.2rem;
  font-weight: bold;
  color: #27ae60;
}

.my-challenges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.my-challenge-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e0e0e0;
}

.my-challenge-card .challenge-header {
  margin-bottom: 15px;
}

.my-challenge-card h4 {
  color: #2c3e50;
  margin: 0;
}

.challenge-info {
  margin-bottom: 15px;
}

.challenge-info p {
  color: #7f8c8d;
  margin-bottom: 10px;
}

.challenge-stats {
  display: flex;
  gap: 15px;
  font-size: 0.9rem;
  color: #7f8c8d;
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

.modal-content {
  background: white;
  border-radius: 20px;
  padding: 30px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-content h2 {
  color: #2c3e50;
  margin-bottom: 25px;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  color: #2c3e50;
  font-weight: bold;
  margin-bottom: 8px;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 25px;
}

.form-actions button {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background 0.3s ease;
}

.form-actions button[type="button"] {
  background: #e0e0e0;
  color: #7f8c8d;
}

.form-actions button[type="submit"] {
  background: #27ae60;
  color: white;
}

.form-actions button[type="submit"]:hover {
  background: #219a52;
}

@media (max-width: 768px) {
  .challenges-grid {
    grid-template-columns: 1fr;
  }
  
  .challenge-meta {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .section-header {
    flex-direction: column;
    gap: 15px;
  }
  
  .leaderboard-tabs {
    flex-wrap: wrap;
  }
  
  .tag-tabs {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>