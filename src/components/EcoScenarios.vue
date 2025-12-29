<template>
  <div class="eco-scenarios">
    <div class="scenarios-header">
      <h2>🌿 环保场景库</h2>
      <p>探索不同场景下的环保行动指南</p>
    </div>

    <div class="scenario-tabs">
      <button 
        v-for="scenario in scenarios" 
        :key="scenario.id"
        class="scenario-tab"
        :class="{ active: activeScenario === scenario.id }"
        @click="selectScenario(scenario.id)"
      >
        <span class="tab-icon">{{ scenario.icon }}</span>
        <span class="tab-text">{{ scenario.name }}</span>
      </button>
    </div>

    <div class="scenario-content" v-if="currentScenario">
      <div class="scenario-intro">
        <div class="scenario-visual">
          <img :src="currentScenario.image" :alt="currentScenario.name">
        </div>
        <div class="scenario-info">
          <h3>{{ currentScenario.name }}</h3>
          <p>{{ currentScenario.description }}</p>
          <div class="scenario-stats">
            <div class="stat-item">
              <span class="stat-icon">🎯</span>
              <span class="stat-text">{{ currentScenario.difficulty }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-icon">⏱️</span>
              <span class="stat-text">{{ currentScenario.duration }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-icon">🌟</span>
              <span class="stat-text">{{ currentScenario.impact }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="action-steps">
        <h4>📋 行动步骤</h4>
        <div class="steps-timeline">
          <div 
            v-for="(step, index) in currentScenario.steps" 
            :key="index"
            class="step-item"
          >
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-content">
              <h5>{{ step.title }}</h5>
              <p>{{ step.description }}</p>
              <div class="step-tips" v-if="step.tips">
                <span class="tips-label">💡 小贴士：</span>
                <ul>
                  <li v-for="tip in step.tips" :key="tip">{{ tip }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="scenario-benefits">
        <h4>🌍 环保效益</h4>
        <div class="benefits-grid">
          <div 
            v-for="benefit in currentScenario.benefits" 
            :key="benefit.type"
            class="benefit-card"
          >
            <div class="benefit-icon">{{ benefit.icon }}</div>
            <h5>{{ benefit.type }}</h5>
            <p>{{ benefit.description }}</p>
            <span class="benefit-value">{{ benefit.value }}</span>
          </div>
        </div>
      </div>

      <div class="related-actions">
        <h4>🔗 相关行动</h4>
        <div class="actions-list">
          <div 
            v-for="action in currentScenario.relatedActions" 
            :key="action.id"
            class="action-card"
            @click="startAction(action)"
          >
            <div class="action-header">
              <span class="action-icon">{{ action.icon }}</span>
              <div class="action-info">
                <h5>{{ action.title }}</h5>
                <span class="action-points">+{{ action.points }} 积分</span>
              </div>
            </div>
            <p>{{ action.description }}</p>
            <button class="action-btn">开始行动</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 场景探索模式 -->
    <div class="explore-mode">
      <h3>🗺️ 探索更多场景</h3>
      <div class="explore-grid">
        <div 
          v-for="scenario in allScenarios" 
          :key="scenario.id"
          class="explore-card"
          :class="{ locked: scenario.locked }"
          @click="exploreScenario(scenario)"
        >
          <div class="explore-image">
            <img :src="scenario.image" :alt="scenario.name">
            <div class="explore-overlay">
              <span v-if="scenario.locked">🔒</span>
              <span v-else>🚀</span>
            </div>
          </div>
          <div class="explore-content">
            <h4>{{ scenario.name }}</h4>
            <p>{{ scenario.shortDescription }}</p>
            <div class="explore-meta">
              <span class="difficulty" :class="scenario.difficulty">
                {{ scenario.difficulty }}
              </span>
              <span class="duration">{{ scenario.duration }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 个人成就追踪 -->
    <div class="progress-tracker" v-if="userProgress.length > 0">
      <h3>📈 我的场景进度</h3>
      <div class="progress-cards">
        <div 
          v-for="progress in userProgress" 
          :key="progress.scenarioId"
          class="progress-card"
        >
          <div class="progress-header">
            <span class="progress-icon">{{ progress.icon }}</span>
            <div class="progress-info">
              <h4>{{ progress.scenarioName }}</h4>
              <span class="progress-status">{{ progress.status }}</span>
            </div>
          </div>
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: progress.completion + '%' }"
            ></div>
          </div>
          <span class="progress-text">{{ progress.completion }}% 完成</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'EcoScenarios',
  setup() {
    const activeScenario = ref('home')

    const scenarios = [
      {
        id: 'home',
        name: '家庭环保',
        icon: '🏠',
        description: '打造绿色家庭，从日常小事做起',
        image: '/images/scenarios/recycling-9.JPG',
        difficulty: '简单',
        duration: '日常',
        impact: '高'
      },
      {
        id: 'office',
        name: '办公环保',
        icon: '🏢',
        description: '绿色办公，低碳工作',
        image: '/images/scenarios/green-transport-9.JPG',
        difficulty: '中等',
        duration: '工作日',
        impact: '中'
      },
      {
        id: 'school',
        name: '校园环保',
        icon: '🏫',
        description: '建设绿色校园，培养环保意识',
        image: '/images/scenarios/recycling-9.JPG',
        difficulty: '简单',
        duration: '学期',
        impact: '高'
      },
      {
        id: 'community',
        name: '社区环保',
        icon: '🏘️',
        description: '共建绿色社区，共享美好生活',
        image: '/images/scenarios/green-transport-9.JPG',
        difficulty: '中等',
        duration: '长期',
        impact: '高'
      }
    ]

    const scenarioDetails = {
      home: {
        name: '家庭环保',
        description: '通过改变生活习惯，让家庭成为环保的第一站',
        image: '/images/scenarios/recycling-9.JPG',
        difficulty: '简单',
        duration: '日常',
        impact: '高',
        steps: [
          {
            title: '垃圾分类实施',
            description: '建立家庭垃圾分类系统，正确分类各类垃圾',
            tips: ['准备分类垃圾桶', '学习分类标准', '培养全家习惯']
          },
          {
            title: '节能减排',
            description: '减少家庭能源消耗，提高能源使用效率',
            tips: ['使用LED灯泡', '及时关闭电器', '调节合适温度']
          },
          {
            title: '水资源节约',
            description: '合理使用水资源，减少浪费',
            tips: ['修复漏水设备', '循环用水', '短时淋浴']
          },
          {
            title: '绿色消费',
            description: '选择环保产品，减少包装浪费',
            tips: ['购买环保产品', '自带购物袋', '避免过度包装']
          }
        ],
        benefits: [
          { type: '节能减排', icon: '💡', description: '减少碳排放', value: '每月减少50kg CO₂' },
          { type: '资源节约', icon: '💧', description: '节约水资源', value: '每月节水1000L' },
          { type: '垃圾减量', icon: '♻️', description: '减少垃圾产生', value: '每月减量30%' }
        ],
        relatedActions: [
          {
            id: 1,
            title: '垃圾分类达人',
            description: '连续7天正确分类垃圾',
            icon: '♻️',
            points: 50
          },
          {
            id: 2,
            title: '节能监督员',
            description: '检查并优化家庭用电',
            icon: '💡',
            points: 30
          }
        ]
      },
      office: {
        name: '办公环保',
        description: '在工作场所践行环保理念，打造绿色办公环境',
        image: '/images/scenarios/green-transport-9.JPG',
        difficulty: '中等',
        duration: '工作日',
        impact: '中',
        steps: [
          {
            title: '无纸化办公',
            description: '减少纸张使用，推行数字化办公',
            tips: ['双面打印', '电子文档', '云端存储']
          },
          {
            title: '绿色通勤',
            description: '选择环保的通勤方式',
            tips: ['公共交通', '骑行步行', '拼车出行']
          },
          {
            title: '节约办公资源',
            description: '合理使用办公用品和设备',
            tips: ['关闭待机设备', '重复使用耗材', '集中采购']
          }
        ],
        benefits: [
          { type: '效率提升', icon: '📈', description: '提高工作效率', value: '效率提升15%' },
          { type: '成本降低', icon: '💰', description: '减少办公成本', value: '月省20%' },
          { type: '环境改善', icon: '🌿', description: '改善办公环境', value: '环境指数+25' }
        ],
        relatedActions: [
          {
            id: 3,
            title: '绿色办公挑战',
            description: '一周无纸化办公',
            icon: '📄',
            points: 40
          },
          {
            id: 4,
            title: '绿色通勤周',
            description: '5天绿色出行',
            icon: '🚲',
            points: 60
          }
        ]
      },
      school: {
        name: '校园环保',
        description: '在学校开展环保活动，培养环保意识',
        image: '/images/scenarios/recycling-9.JPG',
        difficulty: '简单',
        duration: '学期',
        impact: '高',
        steps: [
          {
            title: '环保知识学习',
            description: '学习环保知识和技能',
            tips: ['参加环保课程', '阅读环保书籍', '关注环保资讯']
          },
          {
            title: '校园环保活动',
            description: '组织和参与校园环保活动',
            tips: ['环保社团', '主题活动', '志愿服务']
          },
          {
            title: '环保习惯养成',
            description: '在日常生活中养成环保习惯',
            tips: ['自带餐具', '节约水电', '垃圾分类']
          }
        ],
        benefits: [
          { type: '知识增长', icon: '📚', description: '环保知识提升', value: '知识+50点' },
          { type: '影响他人', icon: '👥', description: '带动他人参与', value: '影响10人' },
          { type: '习惯养成', icon: '✅', description: '养成环保习惯', value: '习惯+8个' }
        ],
        relatedActions: [
          {
            id: 5,
            title: '环保知识竞赛',
            description: '参加环保知识问答',
            icon: '🎓',
            points: 35
          },
          {
            id: 6,
            title: '校园清洁日',
            description: '参与校园清洁活动',
            icon: '🧹',
            points: 45
          }
        ]
      },
      community: {
        name: '社区环保',
        description: '在社区中推广环保理念，共建绿色家园',
        image: '/images/scenarios/green-transport-9.JPG',
        difficulty: '中等',
        duration: '长期',
        impact: '高',
        steps: [
          {
            title: '社区环保宣传',
            description: '向社区居民宣传环保知识',
            tips: ['制作宣传材料', '举办讲座', '线上推广']
          },
          {
            title: '环保活动组织',
            description: '组织社区环保活动',
            tips: ['清洁活动', '回收活动', '种植活动']
          },
          {
            title: '环保设施建设',
            description: '建设和维护社区环保设施',
            tips: ['分类垃圾桶', '回收站', '绿化带']
          }
        ],
        benefits: [
          { type: '社区改善', icon: '🏘️', description: '改善社区环境', value: '环境质量+40%' },
          { type: '邻里关系', icon: '🤝', description: '增进邻里关系', value: '关系+30分' },
          { type: '社会贡献', icon: '🌍', description: '贡献社会环保', value: '贡献值+100' }
        ],
        relatedActions: [
          {
            id: 7,
            title: '社区环保大使',
            description: '组织一次社区环保活动',
            icon: '🌟',
            points: 80
          },
          {
            id: 8,
            title: '环保宣传员',
            description: '向10位居民宣传环保',
            icon: '📢',
            points: 25
          }
        ]
      }
    }

    const allScenarios = [
      {
        id: 'shopping',
        name: '绿色购物',
        shortDescription: '环保购物指南',
        image: '/api/placeholder/300/200',
        difficulty: 'simple',
        duration: '单次',
        locked: false
      },
      {
        id: 'travel',
        name: '低碳旅行',
        shortDescription: '环保旅行方式',
        image: '/api/placeholder/300/200',
        difficulty: 'medium',
        duration: '旅行期',
        locked: false
      },
      {
        id: 'festival',
        name: '节日环保',
        shortDescription: '绿色过节方式',
        image: '/api/placeholder/300/200',
        difficulty: 'simple',
        duration: '节日期间',
        locked: true
      },
      {
        id: 'digital',
        name: '数字环保',
        shortDescription: '线上环保行动',
        image: '/api/placeholder/300/200',
        difficulty: 'simple',
        duration: '持续',
        locked: false
      }
    ]

    const userProgress = ref([
      {
        scenarioId: 'home',
        scenarioName: '家庭环保',
        icon: '🏠',
        status: '进行中',
        completion: 75
      },
      {
        scenarioId: 'office',
        scenarioName: '办公环保',
        icon: '🏢',
        status: '已开始',
        completion: 30
      }
    ])

    const currentScenario = computed(() => {
      return scenarioDetails[activeScenario.value] || null
    })

    const selectScenario = (scenarioId) => {
      activeScenario.value = scenarioId
    }

    const exploreScenario = (scenario) => {
      if (scenario.locked) {
        alert('该场景暂未开放，敬请期待！')
        return
      }
      alert(`探索场景：${scenario.name}`)
    }

    const startAction = (action) => {
      alert(`开始行动：${action.title}`)
    }

    return {
      activeScenario,
      scenarios,
      currentScenario,
      allScenarios,
      userProgress,
      selectScenario,
      exploreScenario,
      startAction
    }
  }
}
</script>

<style scoped>
.eco-scenarios {
  background: white;
  border-radius: 25px;
  padding: 40px;
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.12);
  max-width: 1200px;
  margin: 0 auto;
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.scenarios-header {
  text-align: center;
  margin-bottom: 30px;
}

.scenarios-header h2 {
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 1.8rem;
}

.scenarios-header p {
  color: #7f8c8d;
  font-size: 1.1rem;
}

.scenario-tabs {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
  justify-content: center;
}

.scenario-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #f8f9fa;
  border: 2px solid #e0e0e0;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.scenario-tab:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.scenario-tab.active {
  background: #27ae60;
  border-color: #27ae60;
  color: white;
}

.tab-icon {
  font-size: 1.2rem;
}

.tab-text {
  font-weight: 500;
}

.scenario-content {
  margin-bottom: 40px;
}

.scenario-intro {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
}

.scenario-visual img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 15px;
}

.scenario-info h3 {
  color: #2c3e50;
  margin-bottom: 15px;
  font-size: 1.5rem;
}

.scenario-info p {
  color: #7f8c8d;
  line-height: 1.6;
  margin-bottom: 20px;
}

.scenario-stats {
  display: flex;
  gap: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 15px;
  background: #f8f9fa;
  border-radius: 20px;
}

.stat-icon {
  font-size: 1rem;
}

.stat-text {
  font-size: 0.9rem;
  color: #2c3e50;
  font-weight: 500;
}

.action-steps,
.scenario-benefits,
.related-actions {
  margin-bottom: 30px;
}

.action-steps h4,
.scenario-benefits h4,
.related-actions h4 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 1.3rem;
}

.steps-timeline {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.step-item {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 15px;
  border-left: 4px solid #27ae60;
}

.step-number {
  width: 40px;
  height: 40px;
  background: #27ae60;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-content h5 {
  color: #2c3e50;
  margin-bottom: 8px;
}

.step-content p {
  color: #7f8c8d;
  line-height: 1.5;
  margin-bottom: 15px;
}

.step-tips {
  background: #e8f5e8;
  padding: 12px;
  border-radius: 8px;
}

.tips-label {
  color: #27ae60;
  font-weight: bold;
  margin-bottom: 8px;
  display: block;
}

.step-tips ul {
  margin: 0;
  padding-left: 20px;
}

.step-tips li {
  color: #2c3e50;
  margin-bottom: 5px;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.benefit-card {
  text-align: center;
  padding: 25px;
  background: #f8f9fa;
  border-radius: 15px;
  border: 1px solid #e0e0e0;
  transition: transform 0.3s ease;
}

.benefit-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.benefit-icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
}

.benefit-card h5 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.benefit-card p {
  color: #7f8c8d;
  margin-bottom: 15px;
  line-height: 1.4;
}

.benefit-value {
  display: inline-block;
  background: #27ae60;
  color: white;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.9rem;
  font-weight: bold;
}

.actions-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.action-card {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 15px;
  border: 1px solid #e0e0e0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.action-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.action-icon {
  font-size: 1.8rem;
  margin-right: 15px;
}

.action-info {
  flex: 1;
}

.action-info h5 {
  color: #2c3e50;
  margin-bottom: 5px;
}

.action-points {
  color: #27ae60;
  font-weight: bold;
}

.action-card p {
  color: #7f8c8d;
  margin-bottom: 15px;
  line-height: 1.4;
}

.action-btn {
  width: 100%;
  padding: 10px;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s ease;
}

.action-btn:hover {
  background: #219a52;
}

.explore-mode {
  margin-bottom: 40px;
}

.explore-mode h3 {
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
  font-size: 1.5rem;
}

.explore-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.explore-card {
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;
  border: 1px solid #e0e0e0;
}

.explore-card:hover:not(.locked) {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.explore-card.locked {
  opacity: 0.7;
  cursor: not-allowed;
}

.explore-image {
  position: relative;
  height: 150px;
}

.explore-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.explore-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.explore-content {
  padding: 20px;
}

.explore-content h4 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.explore-content p {
  color: #7f8c8d;
  margin-bottom: 15px;
  font-size: 0.9rem;
}

.explore-meta {
  display: flex;
  gap: 15px;
  font-size: 0.8rem;
}

.difficulty {
  padding: 3px 8px;
  border-radius: 12px;
  font-weight: bold;
  color: white;
}

.difficulty.simple {
  background: #27ae60;
}

.difficulty.medium {
  background: #f39c12;
}

.duration {
  color: #7f8c8d;
}

.progress-tracker h3 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 1.5rem;
}

.progress-cards {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.progress-card {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 15px;
  border: 1px solid #e0e0e0;
}

.progress-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.progress-icon {
  font-size: 2rem;
  margin-right: 15px;
}

.progress-info h4 {
  color: #2c3e50;
  margin-bottom: 5px;
}

.progress-status {
  color: #27ae60;
  font-size: 0.9rem;
  font-weight: bold;
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

@media (max-width: 768px) {
  .scenario-intro {
    grid-template-columns: 1fr;
  }
  
  .scenario-tabs {
    flex-direction: column;
    align-items: stretch;
  }
  
  .scenario-stats {
    flex-direction: column;
    gap: 10px;
  }
  
  .benefits-grid {
    grid-template-columns: 1fr;
  }
  
  .actions-list {
    grid-template-columns: 1fr;
  }
  
  .explore-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}
</style>