<template>
  <div class="action-record">
    <NavBar />
    
    <div class="content-container">
      <h1>🌱 记录环保行动</h1>
      
      <!-- 行动类型选择 -->
      <section class="action-types">
        <h2>选择行动类型</h2>
        <div class="type-grid">
          <div 
            v-for="type in actionTypes" 
            :key="type.id"
            class="type-card"
            :class="{ active: selectedType === type.id }"
            @click="selectType(type)"
          >
            <div class="type-icon">
              <span class="emoji-icon">{{ type.icon }}</span>
            </div>
            <h3>{{ type.name }}</h3>
            <p>{{ type.description }}</p>
            <span class="type-points">{{ type.points }} 积分</span>
          </div>
        </div>
      </section>

      <!-- 记录表单 -->
      <section class="record-form" v-if="selectedType">
        <h2>填写行动详情</h2>
        <form @submit.prevent="submitAction">
          <div class="form-group">
            <label for="description">行动描述</label>
            <textarea 
              id="description"
              v-model="formData.description"
              placeholder="详细描述您的环保行动..."
              required
            ></textarea>
          </div>

          <div class="form-group">
            <label for="duration">持续时间（分钟）</label>
            <input 
              type="number" 
              id="duration"
              v-model.number="formData.duration"
              min="1"
              required
            >
          </div>

          <div class="form-group">
            <label for="location">地点</label>
            <input 
              type="text" 
              id="location"
              v-model="formData.location"
              placeholder="行动发生的地点"
              required
            >
          </div>

          <div class="form-group">
            <label for="image">上传图片（可选）</label>
            <input 
              type="file" 
              id="image"
              @change="handleImageUpload"
              accept="image/*"
            >
            <div class="image-preview" v-if="imagePreview">
              <img :src="imagePreview" alt="预览图">
            </div>
          </div>

          <!-- 贡献值预览 -->
          <div class="points-preview">
            <h3>📊 贡献值预览</h3>
            <div class="points-breakdown">
              <div class="points-item">
                <span>基础积分：</span>
                <span>{{ getSelectedTypePoints() }}</span>
              </div>
              <div class="points-item">
                <span>时长加成：</span>
                <span>+{{ calculateDurationBonus() }}</span>
              </div>
              <div class="points-item total">
                <span>总计：</span>
                <span>{{ calculateTotalPoints() }}</span>
              </div>
            </div>
          </div>

          <button type="submit" class="submit-btn">提交记录</button>
        </form>
      </section>

      <!-- 最近记录 -->
      <section class="recent-actions" v-if="store.actions.length > 0">
        <h2>最近的环保行动</h2>
        <div class="actions-list">
          <div v-for="action in store.actions.slice(0, 5)" :key="action.id" class="action-item">
            <div class="action-header">
              <span class="action-type">{{ action.type }}</span>
              <span class="action-time">{{ formatTime(action.timestamp) }}</span>
            </div>
            <p class="action-description">{{ action.description }}</p>
            <div class="action-details">
              <span>📍 {{ action.location }}</span>
              <span>⏱️ {{ action.duration }}分钟</span>
              <span class="action-points">+{{ action.points }} 积分</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { store } from '../store'
import NavBar from '../components/NavBar.vue'

export default {
  name: 'ActionRecord',
  components: {
    NavBar
  },
  setup() {
    const selectedType = ref('')
    const imagePreview = ref('')
    
    const formData = ref({
      description: '',
      duration: 30,
      location: '',
      image: null
    })

    const actionTypes = [
      {
        id: 'recycling',
        name: '垃圾分类',
        icon: '♻️',
        description: '正确分类生活垃圾，促进资源回收利用',
        points: 10
      },
      {
        id: 'green_transport',
        name: '绿色出行',
        icon: '🚲',
        description: '选择步行、骑行、公共交通等低碳出行方式',
        points: 15
      },
      {
        id: 'water_saving',
        name: '节约用水',
        icon: '💧',
        description: '采取节水措施，减少水资源浪费',
        points: 12
      },
      {
        id: 'energy_saving',
        name: '节约能源',
        icon: '💡',
        description: '减少用电，使用节能设备，关闭不必要的电源',
        points: 15
      },
      {
        id: 'tree_planting',
        name: '植树造林',
        icon: '🌳',
        description: '参与植树活动，为地球增添绿色',
        points: 50
      },
      {
        id: 'cleanup',
        name: '环境清洁',
        icon: '🧹',
        description: '参与社区或公共场所的清洁活动',
        points: 25
      }
    ]

    const selectType = (type) => {
      selectedType.value = type.id
    }

    const getSelectedTypePoints = () => {
      const type = actionTypes.find(t => t.id === selectedType.value)
      return type ? type.points : 0
    }

    const calculateDurationBonus = () => {
      return Math.floor(formData.value.duration / 30) * 5
    }

    const calculateTotalPoints = () => {
      return getSelectedTypePoints() + calculateDurationBonus()
    }

    const handleImageUpload = (event) => {
      const file = event.target.files[0]
      if (file) {
        formData.value.image = file
        const reader = new FileReader()
        reader.onload = (e) => {
          imagePreview.value = e.target.result
        }
        reader.readAsDataURL(file)
      }
    }

    const submitAction = () => {
      const action = {
        type: selectedType.value,
        typeName: actionTypes.find(t => t.id === selectedType.value).name,
        description: formData.value.description,
        duration: formData.value.duration,
        location: formData.value.location,
        image: imagePreview.value,
        points: calculateTotalPoints()
      }

      store.addAction(action)
      
      // 重置表单
      selectedType.value = ''
      formData.value = {
        description: '',
        duration: 30,
        location: '',
        image: null
      }
      imagePreview.value = ''
      
      alert('环保行动记录成功！获得 ' + action.points + ' 积分')
    }

    const formatTime = (timestamp) => {
      const date = new Date(timestamp)
      return date.toLocaleString('zh-CN')
    }

    const getActionEmoji = (typeId) => {
      const actionEmojis = {
        'recycling': '♻️',
        'green_transport': '🚲',
        'water_saving': '💧',
        'energy_saving': '💡',
        'tree_planting': '🌳',
        'cleanup': '🧹'
      }
      return actionEmojis[typeId] || '🌱'
    }

    return {
      store,
      selectedType,
      formData,
      imagePreview,
      actionTypes,
      selectType,
      getSelectedTypePoints,
      calculateDurationBonus,
      calculateTotalPoints,
      handleImageUpload,
      getActionEmoji,
      submitAction,
      formatTime
    }
  }
}
</script>

<style scoped>
.action-record {
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

.action-types,
.record-form,
.recent-actions {
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

.type-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
}

.type-card {
  border: 2px solid #e0e0e0;
  border-radius: 15px;
  padding: 25px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fafafa;
}

.type-card:hover {
  border-color: var(--accent);
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(39, 174, 96, 0.18);
}

.type-card.active {
  border-color: var(--accent);
  background: rgba(39, 174, 96, 0.08);
}

.type-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 15px auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-icon-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.emoji-icon {
  font-size: 2.5rem;
}

.type-card h3 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.type-card p {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin-bottom: 15px;
}

.type-points {
  background: #27ae60;
  color: white;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  color: #2c3e50;
  font-weight: bold;
  margin-bottom: 8px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--accent);
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

.image-preview {
  margin-top: 10px;
}

.image-preview img {
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
  object-fit: cover;
}

.points-preview {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  margin: 30px 0;
  border: 1px solid #e0e0e0;
}

.points-preview h3 {
  color: #2c3e50;
  margin-bottom: 15px;
}

.points-breakdown {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.points-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e0e0e0;
}

.points-item.total {
  font-weight: bold;
  font-size: 1.2rem;
  color: var(--accent);
  border-bottom: none;
  padding-top: 10px;
}

.submit-btn {
  width: 100%;
  padding: 15px;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;
}

.submit-btn:hover {
  background: #219a52;
}

.actions-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.action-item {
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 20px;
  background: #fafafa;
}

.action-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.action-type {
  background: var(--accent-2);
  color: white;
  padding: 3px 10px;
  border-radius: 5px;
  font-size: 0.9rem;
}

.action-time {
  color: var(--text-muted, #7f8c8d);
  font-size: 0.9rem;
}

.action-description {
  color: var(--text-main, #154731);
  margin-bottom: 15px;
  line-height: 1.5;
}

.action-details {
  display: flex;
  gap: 20px;
  font-size: 0.9rem;
  color: var(--text-muted, #7f8c8d);
}

.action-points {
  color: #27ae60;
  font-weight: bold;
  margin-left: auto;
}

@media (max-width: 768px) {
  .type-grid {
    grid-template-columns: 1fr;
  }
  
  .action-details {
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .action-points {
    margin-left: 0;
  }
}
</style>