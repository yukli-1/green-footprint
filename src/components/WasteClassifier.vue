<template>
  <div class="waste-classifier">
    <div class="classifier-header">
      <h2>♻️ 垃圾分类查询</h2>
      <p>输入垃圾名称，快速查询分类信息</p>
    </div>

    <div class="search-section">
      <div class="search-box">
        <input 
          v-model="searchQuery"
          @input="searchWaste"
          placeholder="请输入垃圾名称..."
          class="search-input"
        >
        <button class="search-btn">🔍</button>
      </div>
      
      <div class="quick-categories">
        <button 
          v-for="category in categories" 
          :key="category.id"
          class="category-btn"
          :class="{ active: selectedCategory === category.id }"
          @click="selectCategory(category)"
        >
          <span class="category-icon">{{ category.icon }}</span>
          <span class="category-name">{{ category.name }}</span>
        </button>
      </div>
    </div>

    <div class="results-section" v-if="searchQuery || selectedCategory">
      <div v-if="searchResults.length > 0" class="search-results">
        <h3>搜索结果</h3>
        <div class="results-list">
          <div 
            v-for="item in searchResults" 
            :key="item.id"
            class="result-item"
            @click="showDetail(item)"
          >
            <div class="item-icon">{{ item.icon }}</div>
            <div class="item-info">
              <h4>{{ item.name }}</h4>
              <span class="item-category" :class="item.category">
                {{ getCategoryName(item.category) }}
              </span>
            </div>
            <div class="item-detail">→</div>
          </div>
        </div>
      </div>

      <div v-else-if="searchQuery" class="no-results">
        <p>😔 没有找到相关结果</p>
        <p>请尝试使用其他关键词或查看常见分类</p>
      </div>

      <div v-if="selectedCategory" class="category-items">
        <h3>{{ getCurrentCategoryName() }} - 常见物品</h3>
        <div class="items-grid">
          <div 
            v-for="item in getCategoryItems(selectedCategory)" 
            :key="item.id"
            class="item-card"
            @click="showDetail(item)"
          >
            <div class="item-emoji">{{ item.icon }}</div>
            <h4>{{ item.name }}</h4>
            <p>{{ item.tips[0] }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 详情模态框 -->
    <div v-if="showDetailModal" class="modal-overlay" @click="closeDetail">
      <div class="detail-modal" @click.stop>
        <div class="detail-header">
          <div class="detail-icon">{{ selectedItem?.icon }}</div>
          <div class="detail-title">
            <h3>{{ selectedItem?.name }}</h3>
            <span class="detail-category" :class="selectedItem?.category">
              {{ getCategoryName(selectedItem?.category) }}
            </span>
          </div>
        </div>
        
        <div class="detail-content">
          <div class="detail-section">
            <h4>📝 分类说明</h4>
            <p>{{ selectedItem?.description }}</p>
          </div>
          
          <div class="detail-section">
            <h4>💡 处理建议</h4>
            <ul>
              <li v-for="tip in selectedItem?.tips" :key="tip">{{ tip }}</li>
            </ul>
          </div>
          
          <div class="detail-section">
            <h4>♻️ 环保提示</h4>
            <p>{{ selectedItem?.ecoTip }}</p>
          </div>
        </div>
        
        <button class="close-btn" @click="closeDetail">关闭</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'WasteClassifier',
  setup() {
    const searchQuery = ref('')
    const selectedCategory = ref('')
    const showDetailModal = ref(false)
    const selectedItem = ref(null)

    const categories = [
      { id: 'recyclable', name: '可回收物', icon: '♻️', color: '#3498db' },
      { id: 'hazardous', name: '有害垃圾', icon: '☠️', color: '#e74c3c' },
      { id: 'wet', name: '湿垃圾', icon: '🍎', color: '#27ae60' },
      { id: 'dry', name: '干垃圾', icon: '🗑️', color: '#95a5a6' }
    ]

    const wasteDatabase = [
      // 可回收物
      { id: 1, name: '废纸', icon: '📄', category: 'recyclable', description: '可以回收再利用的纸张制品', tips: ['保持干燥清洁', '去除胶带和订书钉', '折叠整齐后投放'], ecoTip: '每回收1吨废纸，可以挽救17棵树' },
      { id: 2, name: '塑料瓶', icon: '🍶', category: 'recyclable', description: 'PET材质的饮料瓶等塑料容器', tips: ['清空内容物', '简单冲洗', '压扁后投放'], ecoTip: '回收塑料瓶可以减少石油消耗' },
      { id: 3, name: '玻璃瓶', icon: '🍾', category: 'recyclable', description: '各种玻璃容器制品', tips: ['清除残留物', '分离瓶盖', '轻拿轻放'], ecoTip: '玻璃可以100%回收再利用' },
      { id: 4, name: '金属罐', icon: '🥫', category: 'recyclable', description: '铝制或铁制罐头容器', tips: ['清空内容物', '冲洗干净', '压扁后投放'], ecoTip: '回收铝罐比生产新铝节约95%的能源' },
      
      // 有害垃圾
      { id: 5, name: '电池', icon: '🔋', category: 'hazardous', description: '各种类型的电池', tips: ['单独包装', '避免短路', '投放到专用回收箱'], ecoTip: '一粒纽扣电池可污染60万升水' },
      { id: 6, name: '药品', icon: '💊', category: 'hazardous', description: '过期或废弃的药品', tips: ['保持原包装', '不要随意丢弃', '交到药店回收'], ecoTip: '随意丢弃药品会污染土壤和水源' },
      { id: 7, name: '油漆桶', icon: '🪣', category: 'hazardous', description: '含有化学物质的容器', tips: ['用尽剩余物', '密封包装', '标注有害垃圾'], ecoTip: '化学物质需要专业处理' },
      
      // 湿垃圾
      { id: 8, name: '剩饭剩菜', icon: '🍚', category: 'wet', description: '食物残渣和厨余垃圾', tips: ['沥干水分', '去除包装', '使用专用垃圾袋'], ecoTip: '湿垃圾可制成有机肥料' },
      { id: 9, name: '果皮', icon: '🍌', category: 'wet', description: '水果皮和核', tips: ['去除标签', '沥干汁液', '避免混入杂物'], ecoTip: '果皮可用于堆肥' },
      { id: 10, name: '茶叶渣', icon: '🍵', category: 'wet', description: '泡过的茶叶', tips: ['沥干水分', '去除包装', '可与其他厨余垃圾混合'], ecoTip: '茶叶渣是很好的肥料' },
      
      // 干垃圾
      { id: 11, name: '纸巾', icon: '🧻', category: 'dry', description: '使用过的纸巾和卫生纸', tips: ['与其他干垃圾混合投放', '避免污染其他垃圾'], ecoTip: '纸巾由于污染严重，不可回收' },
      { id: 12, name: '烟蒂', icon: '🚬', category: 'dry', description: '吸烟后的剩余物', tips: ['确保熄灭', '不要随意丢弃', '投放干垃圾桶'], ecoTip: '烟蒂需要数年才能分解' },
      { id: 13, name: '陶瓷碎片', icon: '🏺', category: 'dry', description: '破碎的陶瓷制品', tips: ['包装好避免划伤', '投放到干垃圾桶'], ecoTip: '陶瓷难以分解，需要专门处理' }
    ]

    const searchResults = computed(() => {
      if (!searchQuery.value.trim()) return []
      
      const query = searchQuery.value.toLowerCase()
      return wasteDatabase.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      )
    })

    const getCategoryName = (category) => {
      const cat = categories.find(c => c.id === category)
      return cat ? cat.name : category
    }

    const getCurrentCategoryName = () => {
      const cat = categories.find(c => c.id === selectedCategory.value)
      return cat ? cat.name : ''
    }

    const getCategoryItems = (categoryId) => {
      return wasteDatabase.filter(item => item.category === categoryId)
    }

    const selectCategory = (category) => {
      selectedCategory.value = selectedCategory.value === category.id ? '' : category.id
      searchQuery.value = ''
    }

    const searchWaste = () => {
      if (searchQuery.value.trim()) {
        selectedCategory.value = ''
      }
    }

    const showDetail = (item) => {
      selectedItem.value = item
      showDetailModal.value = true
    }

    const closeDetail = () => {
      showDetailModal.value = false
      selectedItem.value = null
    }

    return {
      searchQuery,
      selectedCategory,
      showDetailModal,
      selectedItem,
      categories,
      searchResults,
      getCategoryName,
      getCurrentCategoryName,
      getCategoryItems,
      selectCategory,
      searchWaste,
      showDetail,
      closeDetail
    }
  }
}
</script>

<style scoped>
.waste-classifier {
  background: white;
  border-radius: 25px;
  padding: 40px;
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.12);
  max-width: 1000px;
  margin: 0 auto;
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.classifier-header {
  text-align: center;
  margin-bottom: 30px;
}

.classifier-header h2 {
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 1.8rem;
}

.classifier-header p {
  color: #7f8c8d;
  font-size: 1.1rem;
}

.search-section {
  margin-bottom: 30px;
}

.search-box {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search-input {
  flex: 1;
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3498db;
}

.search-btn {
  padding: 15px 20px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: background 0.3s ease;
}

.search-btn:hover {
  background: #2980b9;
}

.quick-categories {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
}

.category-btn {
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

.category-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.category-btn.active {
  background: #3498db;
  border-color: #3498db;
  color: white;
}

.category-icon {
  font-size: 1.2rem;
}

.category-name {
  font-weight: 500;
}

.results-section {
  margin-top: 30px;
}

.search-results,
.category-items {
  margin-bottom: 30px;
}

.search-results h3,
.category-items h3 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 1.3rem;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.result-item {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  background: #f8f9fa;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
}

.result-item:hover {
  background: #e8f4f8;
  transform: translateX(5px);
  border-color: #3498db;
}

.item-icon {
  font-size: 2rem;
  margin-right: 15px;
}

.item-info {
  flex: 1;
}

.item-info h4 {
  color: #2c3e50;
  margin-bottom: 5px;
}

.item-category {
  padding: 3px 8px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: bold;
  color: white;
}

.item-category.recyclable { background: #3498db; }
.item-category.hazardous { background: #e74c3c; }
.item-category.wet { background: #27ae60; }
.item-category.dry { background: #95a5a6; }

.item-detail {
  font-size: 1.2rem;
  color: #7f8c8d;
  transition: transform 0.3s ease;
}

.result-item:hover .item-detail {
  transform: translateX(3px);
}

.no-results {
  text-align: center;
  padding: 40px;
  color: #7f8c8d;
}

.no-results p:first-child {
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.item-card {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
}

.item-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.item-emoji {
  font-size: 3rem;
  margin-bottom: 15px;
  transition: all 0.3s ease;
  position: relative;
}

.item-card:hover .item-emoji {
  transform: scale(1.2) rotate(10deg);
  filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.2));
}

.category-icon {
  font-size: 1.5rem;
  margin-right: 10px;
  transition: all 0.3s ease;
}

.category-btn:hover .category-icon {
  transform: scale(1.2) rotate(15deg);
}

.detail-icon {
  font-size: 4rem;
  position: relative;
}

.detail-icon::after {
  content: '';
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background: linear-gradient(45deg, #3498db, #9b59b6, #e74c3c, #f39c12, #3498db);
  border-radius: 50%;
  z-index: -1;
  animation: iconRotate 3s linear infinite;
  opacity: 0.3;
}

@keyframes iconRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.item-card h4 {
  color: #2c3e50;
  margin-bottom: 8px;
}

.item-card p {
  color: #7f8c8d;
  font-size: 0.9rem;
  line-height: 1.4;
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
  position: relative;
}

.detail-header {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.detail-icon {
  font-size: 3rem;
  margin-right: 20px;
}

.detail-title h3 {
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 1.5rem;
}

.detail-category {
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.9rem;
  font-weight: bold;
  color: white;
}

.detail-category.recyclable { background: #3498db; }
.detail-category.hazardous { background: #e74c3c; }
.detail-category.wet { background: #27ae60; }
.detail-category.dry { background: #95a5a6; }

.detail-section {
  margin-bottom: 25px;
}

.detail-section h4 {
  color: #2c3e50;
  margin-bottom: 12px;
  font-size: 1.1rem;
}

.detail-section p {
  color: #7f8c8d;
  line-height: 1.6;
}

.detail-section ul {
  color: #7f8c8d;
  line-height: 1.6;
  padding-left: 20px;
}

.detail-section li {
  margin-bottom: 8px;
}

.close-btn {
  width: 100%;
  padding: 12px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background 0.3s ease;
}

.close-btn:hover {
  background: #2980b9;
}

@media (max-width: 768px) {
  .waste-classifier {
    padding: 20px;
  }
  
  .quick-categories {
    flex-direction: column;
    align-items: stretch;
  }
  
  .category-btn {
    justify-content: center;
  }
  
  .items-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
  
  .detail-header {
    flex-direction: column;
    text-align: center;
  }
  
  .detail-icon {
    margin-right: 0;
    margin-bottom: 15px;
  }
}
</style>