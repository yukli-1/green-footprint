<template>
  <div class="footprint-data">
    <NavBar />
    
    <div class="content-container">
      <h1>🌍 我的足迹数据</h1>
      
      <!-- 数据统计栏 -->
      <section class="stats-overview">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">🏆</div>
            <div class="stat-value">{{ store.user.totalPoints }}</div>
            <div class="stat-label">总贡献值</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📅</div>
            <div class="stat-value">{{ store.actions.length }}</div>
            <div class="stat-label">行动次数</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🌱</div>
            <div class="stat-value">{{ store.plants.length }}</div>
            <div class="stat-label">虚拟绿植</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">⭐</div>
            <div class="stat-value">{{ store.user.level }}</div>
            <div class="stat-label">当前等级</div>
          </div>
        </div>
      </section>

      <!-- 动态足迹图谱 -->
      <section class="footprint-map">
        <h2>📍 足迹分布图</h2>
        <div class="map-container">
          <div class="map-visualization">
            <img src="/images/backgrounds/city-map.svg" alt="城市地图" class="map-background"/>
            <div 
              v-for="(location, index) in uniqueLocations" 
              :key="index"
              class="location-pin"
              :style="getLocationStyle(index)"
            >
              <div class="pin">{{ location.icon }}</div>
              <div class="pin-info">
                <strong>{{ location.name }}</strong>
                <span>{{ location.count }} 次行动</span>
              </div>
            </div>
          </div>
          <div class="location-list">
            <h3>行动地点统计</h3>
            <div class="location-items">
              <div v-for="location in uniqueLocations" :key="location.name" class="location-item">
                <span class="location-icon">{{ location.icon }}</span>
                <span class="location-name">{{ location.name }}</span>
                <span class="location-count">{{ location.count }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 虚拟绿植区 -->
      <section class="virtual-garden">
        <h2>🌿 我的虚拟绿植区</h2>
        <div class="garden-container">
          <div class="garden-grid">
            <div v-for="plant in store.plants" :key="plant.id" class="plant-card">
              <div class="plant-visual">
                  <img :src="getPlantImage(plant.emoji || plant.name)" :alt="plant.name" class="plant-image"/>
                </div>
              <div class="plant-info">
                <h4>{{ plant.name }}</h4>
                <p>{{ plant.description }}</p>
                <div class="plant-stats">
                  <span>🌱 成长期: {{ plant.growthStage }}/5</span>
                  <span>💧 浇水: {{ plant.waterCount }}次</span>
                </div>
                <button @click="waterPlant(plant)" class="water-btn">💧 浇水</button>
              </div>
            </div>
          </div>
          
          <div class="plant-shop">
            <h3>🌱 绿植商店</h3>
            <div class="shop-grid">
              <div v-for="plant in availablePlants" :key="plant.id" class="plant-item">
                <div class="plant-emoji">
                  <img :src="getPlantImage(plant.emoji || plant.name)" :alt="plant.name" class="plant-shop-image"/>
                </div>
                <h4>{{ plant.name }}</h4>
                <p>{{ plant.description }}</p>
                <div class="plant-price">{{ plant.price }} 积分</div>
                <button 
                  @click="buyPlant(plant)" 
                  :disabled="store.user.totalPoints < plant.price"
                  class="buy-btn"
                >
                  购买
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 行动统计图表 -->
      <section class="action-charts">
        <h2>📊 行动统计分析</h2>
        <div class="charts-grid">
          <div class="chart-card">
            <h3>行动类型分布</h3>
            <div class="chart-content">
              <div v-for="type in actionTypeStats" :key="type.name" class="chart-bar">
                <span class="bar-label">{{ type.name }}</span>
                <div class="bar-container">
                  <div class="bar-fill" :style="{ width: type.percentage + '%' }"></div>
                </div>
                <span class="bar-value">{{ type.count }}</span>
              </div>
            </div>
          </div>
          
          <div class="chart-card">
            <h3>每日行动趋势</h3>
            <div class="chart-content">
              <div class="trend-chart">
                <div v-for="day in weeklyData" :key="day.date" class="trend-item">
                  <div class="trend-bar" :style="{ height: day.percentage + '%' }"></div>
                  <span class="trend-label">{{ day.day }}</span>
                  <span class="trend-value">{{ day.count }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 成就徽章 -->
      <section class="achievements">
        <h2>🏅 我的成就</h2>
        <div class="badges-grid">
          <div v-for="badge in store.user.badges" :key="badge.id" class="badge-card earned">
            <div class="badge-icon">
              <img :src="getBadgeImage(badge.id)" :alt="badge.name" class="badge-image"/>
            </div>
            <h4>{{ badge.name }}</h4>
            <p>{{ badge.description }}</p>
          </div>
          <div v-for="badge in lockedBadges" :key="badge.id" class="badge-card locked">
            <div class="badge-icon">
              <img :src="getBadgeImage(badge.id)" :alt="badge.name" class="badge-image locked-badge"/>
            </div>
            <h4>{{ badge.name }}</h4>
            <p>{{ badge.requirement }}</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { store } from '../store'
import NavBar from '../components/NavBar.vue'

export default {
  name: 'FootprintData',
  components: {
    NavBar
  },
  setup() {
    const locationIcons = ['🏠', '🏢', '🌳', '🏫', '🏪', '🏞️', '🏖️', '🚇', '🚲']
    
    const uniqueLocations = computed(() => {
      const locationMap = {}
      store.actions.forEach(action => {
        if (locationMap[action.location]) {
          locationMap[action.location].count++
        } else {
          locationMap[action.location] = {
            name: action.location,
            count: 1,
            icon: locationIcons[Object.keys(locationMap).length % locationIcons.length]
          }
        }
      })
      return Object.values(locationMap)
    })

    const actionTypeStats = computed(() => {
      const typeMap = {}
      const typeNames = {
        'recycling': '垃圾分类',
        'green_transport': '绿色出行',
        'water_saving': '节约用水',
        'energy_saving': '节约能源',
        'tree_planting': '植树造林',
        'cleanup': '环境清洁'
      }
      
      store.actions.forEach(action => {
        const name = typeNames[action.type] || action.type
        typeMap[name] = (typeMap[name] || 0) + 1
      })
      
      const total = store.actions.length
      return Object.entries(typeMap).map(([name, count]) => ({
        name,
        count,
        percentage: total > 0 ? (count / total * 100) : 0
      }))
    })

    const weeklyData = computed(() => {
      const days = ['一', '二', '三', '四', '五', '六', '日']
      const today = new Date()
      const data = []
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        const dayName = days[date.getDay()] || '日'
        
        const dayActions = store.actions.filter(action => {
          const actionDate = new Date(action.timestamp)
          return actionDate.toDateString() === date.toDateString()
        })
        
        data.push({
          day: dayName,
          date: date.toLocaleDateString(),
          count: dayActions.length,
          percentage: Math.max(10, (dayActions.length / Math.max(1, ...data.map(d => d.count))) * 100)
        })
      }
      
      return data
    })

    const availablePlants = [
      {
        id: 1,
        name: '向日葵',
        emoji: '🌻',
        description: '象征着阳光和希望',
        price: 50
      },
      {
        id: 2,
        name: '玫瑰花',
        emoji: '🌹',
        description: '代表美丽和热情',
        price: 80
      },
      {
        id: 3,
        name: '仙人掌',
        emoji: '🌵',
        description: '坚韧不拔的生命力',
        price: 30
      },
      {
        id: 4,
        name: '樱花树',
        emoji: '🌸',
        description: '春天的使者',
        price: 120
      },
      {
        id: 5,
        name: '竹子',
        emoji: '🎋',
        description: '节节高升，正直向上',
        price: 100
      }
    ]

    const lockedBadges = [
      {
        id: 1,
        name: '环保新手',
        icon: '🌱',
        description: '完成第一次环保行动',
        requirement: '完成1次行动'
      },
      {
        id: 2,
        name: '分类达人',
        icon: '♻️',
        description: '垃圾分类达到10次',
        requirement: '垃圾分类10次'
      },
      {
        id: 3,
        name: '绿色出行者',
        icon: '🚲',
        description: '绿色出行达到20次',
        requirement: '绿色出行20次'
      },
      {
        id: 4,
        name: '环保先锋',
        icon: '🏆',
        description: '总积分达到1000',
        requirement: '积分1000'
      }
    ]

    const getLocationStyle = (index) => {
      const positions = [
        { top: '20%', left: '30%' },
        { top: '60%', left: '50%' },
        { top: '40%', left: '70%' },
        { top: '80%', left: '20%' },
        { top: '30%', left: '80%' }
      ]
      return positions[index % positions.length]
    }

    const waterPlant = (plant) => {
      plant.waterCount++
      if (plant.growthStage < 5 && plant.waterCount % 3 === 0) {
        plant.growthStage++
      }
    }

    const buyPlant = (plant) => {
      if (store.user.totalPoints >= plant.price) {
        const newPlant = {
          id: Date.now(),
          ...plant,
          growthStage: 1,
          waterCount: 0,
          plantedAt: new Date().toISOString()
        }
        store.addPlant(newPlant)
        store.user.totalPoints -= plant.price
        alert(`成功购买${plant.name}！`)
      }
    }

    const getPlantImage = (emojiOrName) => {
      const plantImages = {
        '🌻': '/images/plants/sunflower.svg',
        'sunflower': '/images/plants/sunflower.svg',
        'sunflower.svg': '/images/plants/sunflower.svg',
        '🌹': '/images/plants/rose.svg',
        'rose': '/images/plants/rose.svg',
        'rose.svg': '/images/plants/rose.svg',
        '🌵': '/images/plants/cactus.svg',
        'cactus': '/images/plants/cactus.svg',
        'cactus.svg': '/images/plants/cactus.svg',
        '🌸': '/images/plants/cherry-blossom.svg',
        '🎋': '/images/plants/bamboo.svg',
        '樱花': '/images/plants/cherry-blossom.svg',
        '樱花树': '/images/plants/cherry-blossom.svg',
        'cherry': '/images/plants/cherry-blossom.svg',
        'cherry-blossom.svg': '/images/plants/cherry-blossom.svg',
        '竹子': '/images/plants/bamboo.svg',
        'bamboo': '/images/plants/bamboo.svg',
        'bamboo.svg': '/images/plants/bamboo.svg'
      }

      const key = (emojiOrName || '').toString().trim()
      if (plantImages[key]) return plantImages[key]

      // fallback: if value looks like a filename or path, return it
      if (/\.(svg|png|jpg|jpeg)$/i.test(key)) return key

      // last fallback: return a tiny inline SVG placeholder showing the emoji (or a leaf)
      const char = key || '🌱'
      const svg = encodeURIComponent(`
        <svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>
          <rect width='100%' height='100%' fill='%23f8fff9'/>
          <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='64'>${char}</text>
        </svg>`)
      return `data:image/svg+xml;charset=UTF-8,${svg}`
    }

    const getBadgeImage = (badgeId) => {
      const badgeImages = {
        1: '/images/badges/bronze-eco-warrior.svg',
        2: '/images/badges/bronze-eco-warrior.svg', 
        3: '/images/badges/silver-eco-champion.svg',
        4: '/images/badges/gold-eco-master.svg'
      }
      return badgeImages[badgeId] || '/images/badges/bronze-eco-warrior.svg'
    }

    return {
      store,
      uniqueLocations,
      actionTypeStats,
      weeklyData,
      availablePlants,
      lockedBadges,
      getLocationStyle,
      waterPlant,
      buyPlant,
      getPlantImage,
      getBadgeImage
    }
  }
}
</script>

<style scoped>
.footprint-data {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding-bottom: 40px;
}
.footprint-data {
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
  color: white;
  font-size: 2.5rem;
  margin-bottom: 40px;
}
h1 {
  text-align: center;
  color: var(--text-heading, #123e2e);
  font-size: 2.5rem;
  margin-bottom: 40px;
}

.stats-overview,
.footprint-map,
.virtual-garden,
.action-charts,
.achievements {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
}

h2 {
  color: #2c3e50;
  margin-bottom: 25px;
  font-size: 1.8rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
}

.stat-card {
  text-align: center;
  padding: 30px;
  background: #f8f9fa;
  border-radius: 20px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #27ae60, #3498db);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}
.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.stat-card:hover::before {
  transform: scaleX(1);
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #27ae60;
  margin-bottom: 5px;
}
.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: var(--accent);
  margin-bottom: 5px;
}

.stat-label {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.map-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
}

.map-visualization {
  position: relative;
  height: 450px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.2);
}

.map-background {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.map-visualization::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(39, 174, 96, 0.3) 0%, rgba(52, 152, 219, 0.3) 100%);
  mix-blend-mode: multiply;
}
.map-visualization::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(39, 174, 96, 0.28) 0%, rgba(46, 204, 113, 0.18) 100%);
  mix-blend-mode: multiply;
}

.location-pin {
  position: absolute;
  cursor: pointer;
}

.pin {
  font-size: 2rem;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

.pin-info {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  padding: 8px 12px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
  font-size: 0.8rem;
  z-index: 10;
}

.location-list h3 {
  color: #2c3e50;
  margin-bottom: 15px;
}

.location-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.location-item {
  display: flex;
  align-items: center;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 8px;
}

.location-icon {
  font-size: 1.2rem;
  margin-right: 10px;
}

.location-name {
  flex: 1;
}

.location-count {
  background: #3498db;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
}
.location-count {
  background: var(--accent-2);
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
}

.garden-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
}

.garden-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
}

.plant-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 250, 0.95) 100%);
  border-radius: 20px;
  padding: 30px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.plant-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(39, 174, 96, 0.1) 0%, transparent 70%);
  animation: plantGlow 4s ease-in-out infinite;
}
.plant-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(39, 174, 96, 0.12) 0%, transparent 70%);
  animation: plantGlow 4s ease-in-out infinite;
}

@keyframes plantGlow {
  0%, 100% { transform: scale(0.8) rotate(0deg); opacity: 0.5; }
  50% { transform: scale(1.2) rotate(180deg); opacity: 0.8; }
}

.plant-visual {
  width: 120px;
  height: 120px;
  margin: 0 auto 20px auto;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: plantGrow 3s ease-in-out infinite alternate;
}

.plant-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.plant-image {
  display: block;
  max-width: 140px;
  max-height: 140px;
  margin: 0 auto;
}

@keyframes plantGrow {
  from { transform: scale(0.9) rotate(-2deg); }
  to { transform: scale(1.1) rotate(2deg); }
}

.plant-card {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 20px;
  border: 1px solid #e0e0e0;
}

.plant-visual {
  font-size: 4rem;
  text-align: center;
  margin-bottom: 15px;
}

.plant-info h4 {
  color: #2c3e50;
  margin-bottom: 8px;
}

.plant-info p {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin-bottom: 10px;
}

.plant-stats {
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 0.8rem;
  color: #7f8c8d;
  margin-bottom: 15px;
}

.water-btn {
  width: 100%;
  padding: 8px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}
.water-btn {
  width: 100%;
  padding: 8px;
  background: var(--accent-2);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.water-btn:hover {
  background: #219a52;
}

.water-btn:hover {
  background: #2980b9;
}

.plant-shop h3 {
  color: #2c3e50;
  margin-bottom: 20px;
}

.shop-grid {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.plant-item {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 15px;
  text-align: center;
  border: 1px solid #e0e0e0;
}

.plant-emoji {
  width: 80px;
  height: 80px;
  margin: 0 auto 10px auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.plant-shop-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.plant-emoji {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.plant-item h4 {
  color: #2c3e50;
  margin-bottom: 5px;
}

.plant-item p {
  color: #7f8c8d;
  font-size: 0.8rem;
  margin-bottom: 10px;
}

.plant-price {
  color: #27ae60;
  font-weight: bold;
  margin-bottom: 10px;
}

.buy-btn {
  width: 100%;
  padding: 8px;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.buy-btn:hover:not(:disabled) {
  background: #219a52;
}

.buy-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.chart-card {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 20px;
  border: 1px solid #e0e0e0;
}

.chart-card h3 {
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
}

.chart-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.bar-label {
  min-width: 80px;
  font-size: 0.9rem;
  color: #2c3e50;
}

.bar-container {
  flex: 1;
  height: 20px;
  background: #ecf0f1;
  border-radius: 10px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #27ae60, #2ecc71);
  transition: width 0.5s ease;
}
.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
  transition: width 0.5s ease;
}

.bar-value {
  min-width: 30px;
  text-align: right;
  font-weight: bold;
  color: #27ae60;
}

.trend-chart {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 200px;
  padding: 20px 0;
}

.trend-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.trend-bar {
  width: 30px;
  background: linear-gradient(180deg, #3498db, #2980b9);
  border-radius: 5px 5px 0 0;
  margin-bottom: 10px;
  transition: height 0.5s ease;
}
.trend-bar {
  width: 30px;
  background: linear-gradient(180deg, var(--accent-2), #219a52);
  border-radius: 5px 5px 0 0;
  margin-bottom: 10px;
  transition: height 0.5s ease;
}

.trend-label {
  font-size: 0.8rem;
  color: #7f8c8d;
  margin-bottom: 5px;
}

.trend-value {
  font-size: 0.8rem;
  font-weight: bold;
  color: #2c3e50;
}

.badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.badge-card {
  text-align: center;
  padding: 25px;
  border-radius: 15px;
  transition: transform 0.3s ease;
}

.badge-card.earned {
  background: linear-gradient(135deg, #f1f8e9 0%, #dcedc8 100%);
  border: 2px solid #27ae60;
}

.badge-card.locked {
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  opacity: 0.7;
}

.badge-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 15px auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.badge-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.badge-image.locked-badge {
  filter: grayscale(0.8) opacity(0.6);
}

.badge-card h4 {
  color: #2c3e50;
  margin-bottom: 8px;
}

.badge-card p {
  color: #7f8c8d;
  font-size: 0.8rem;
}

.badge-card.earned:hover {
  transform: translateY(-5px);
}

@media (max-width: 768px) {
  .map-container,
  .garden-container,
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .badges-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>