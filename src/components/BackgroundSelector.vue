<template>
  <div class="background-selector">
    <div class="selector-header">
      <h3>🎨 主题背景</h3>
      <button class="toggle-btn" @click="toggleSelector">
        {{ showSelector ? '收起' : '展开' }}
      </button>
    </div>
    
    <div class="selector-content" :class="{ active: showSelector }">
      <div class="background-grid">
        <div
          v-for="bg in backgrounds"
          :key="bg.id"
          class="background-item"
          :class="{ active: selectedBackground === bg.id }"
          @click="selectBackground(bg.id)"
        >
          <div class="bg-preview">
            <span class="bg-emoji">{{ bg.emoji }}</span>
            <div class="preview-overlay">
              <div class="bg-name">{{ bg.name }}</div>
              <div class="bg-description">{{ bg.description }}</div>
            </div>
          </div>
          <div class="bg-info">
            <h4>{{ bg.name }}</h4>
            <p>{{ bg.description }}</p>
            <div class="bg-tags">
              <span
                v-for="tag in bg.tags"
                :key="tag"
                class="tag"
                :style="{ backgroundColor: getTagColor(tag) }"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="selector-actions">
        <button class="action-btn random" @click="selectRandomBackground">
          🎲 随机背景
        </button>
        <button class="action-btn reset" @click="resetBackground">
          🔄 默认背景
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'BackgroundSelector',
  setup() {
    const showSelector = ref(false)
    const selectedBackground = ref('nature-premium')
    
    const backgrounds = [
      {
        id: 'forest-hero',
        name: '森林风光',
        description: '郁郁葱葱的森林景象',
        emoji: '🌲',
        fullImage: '/images/backgrounds/forest-hero.svg',
        tags: ['自然', '绿色']
      },
      {
        id: 'gradient-eco',
        name: '渐变环保',
        description: '现代感的渐变效果',
        emoji: '🌊',
        fullImage: '/images/backgrounds/gradient-eco.svg',
        tags: ['现代', '渐变']
      },
      {
        id: 'particle-field',
        name: '粒子星空',
        description: '动态粒子效果',
        emoji: '✨',
        fullImage: '/images/backgrounds/particle-field.svg',
        tags: ['科技', '动态']
      },
      {
        id: 'geometric-eco',
        name: '几何生态',
        description: '几何图形组合',
        emoji: '🔷',
        fullImage: '/images/backgrounds/geometric-eco.svg',
        tags: ['几何', '设计']
      },
      {
        id: 'nature-premium',
        name: '自然精华',
        description: '高质量自然景观',
        emoji: '🌿',
        fullImage: '/images/backgrounds/nature-premium.svg',
        tags: ['自然', '高质量']
      }
    ]
    
    const toggleSelector = () => {
      showSelector.value = !showSelector.value
    }
    
    const selectBackground = (bgId) => {
      selectedBackground.value = bgId
      const background = backgrounds.find(bg => bg.id === bgId)
      if (background) {
        // 清除之前的背景类
        document.body.className = document.body.className.replace(/bg-\S+/g, '')
        
        console.log(`正在切换背景到: ${background.name}`)
        console.log(`主要路径: ${background.fullImage}`)
        
        // 优先尝试使用外部SVG文件
        const testImg = new Image()
        testImg.onload = function() {
          console.log(`✓ 外部SVG加载成功: ${background.fullImage}`)
          
          // 应用外部SVG背景
          document.body.style.backgroundImage = `url(${background.fullImage})`
          document.body.style.backgroundSize = 'cover'
          document.body.style.backgroundPosition = 'center'
          document.body.style.backgroundRepeat = 'no-repeat'
          document.body.style.backgroundAttachment = 'fixed'
          document.body.style.backgroundTransition = 'background-image 0.5s ease-in-out'
          
          // 添加背景类以获得更好的CSS控制
          document.body.classList.add(`bg-${bgId}`)
          
          // 保存成功路径
          localStorage.setItem('selectedBackground', bgId)
          localStorage.setItem('selectedBackgroundPath', background.fullImage)
          
          console.log(`✓ 外部SVG背景已应用: ${background.name}`)
        }
        
        testImg.onerror = function() {
          console.warn(`⚠ 外部SVG加载失败: ${background.fullImage}`)
          
          // 尝试备用路径
          const alternativePaths = [
            background.fullImage.replace('/images/', './images/'),
            background.fullImage.replace('/images/', '../images/'),
            background.fullImage.replace('/images/', './public/images/')
          ]
          
          let pathIndex = 0
          
          function tryAlternativePath() {
            if (pathIndex >= alternativePaths.length) {
              console.error(`✗ 所有路径都失败，使用内嵌SVG备用`)
              applyEmbeddedBackground(bgId)
              return
            }
            
            const altPath = alternativePaths[pathIndex]
            console.log(`尝试备用路径 ${pathIndex + 1}: ${altPath}`)
            
            const altImg = new Image()
            altImg.onload = function() {
              console.log(`✓ 备用路径成功: ${altPath}`)
              
              document.body.style.backgroundImage = `url(${altPath})`
              document.body.style.backgroundSize = 'cover'
              document.body.style.backgroundPosition = 'center'
              document.body.style.backgroundRepeat = 'no-repeat'
              document.body.style.backgroundAttachment = 'fixed'
              document.body.style.backgroundTransition = 'background-image 0.5s ease-in-out'
              document.body.classList.add(`bg-${bgId}`)
              
              localStorage.setItem('selectedBackground', bgId)
              localStorage.setItem('selectedBackgroundPath', altPath)
              
              console.log(`✓ 备用路径背景已应用: ${background.name}`)
            }
            
            altImg.onerror = function() {
              console.log(`✗ 备用路径 ${pathIndex + 1} 失败: ${altPath}`)
              pathIndex++
              tryAlternativePath()
            }
            
            altImg.src = altPath
          }
          
          tryAlternativePath()
        }
        
      }
    }
    
    const applyEmbeddedBackground = (bgId) => {
      console.log(`使用内嵌SVG备用背景: ${bgId}`)
      
      const svgBackgrounds = {
        'forest-hero': `data:image/svg+xml,${encodeURIComponent(`
          <svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="forestGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
                <stop offset="50%" style="stop-color:#98FB98;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#228B22;stop-opacity:1" />
              </linearGradient>
            </defs>
            <rect width="1920" height="1080" fill="url(#forestGrad)" />
            <circle cx="300" cy="200" r="100" fill="rgba(255,255,255,0.3)" />
            <circle cx="1500" cy="300" r="80" fill="rgba(255,255,255,0.2)" />
          </svg>
        `)}`,
        
        'gradient-eco': `data:image/svg+xml,${encodeURIComponent(`
          <svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="ecoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                <stop offset="50%" style="stop-color:#764ba2;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#2ecc71;stop-opacity:1" />
              </linearGradient>
            </defs>
            <rect width="1920" height="1080" fill="url(#ecoGrad)" />
          </svg>
        `)}`,
        
        'particle-field': `data:image/svg+xml,${encodeURIComponent(`
          <svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
            <rect width="1920" height="1080" fill="#0a0a0a" />
            <circle cx="200" cy="200" r="3" fill="white" opacity="0.8"/>
            <circle cx="600" cy="400" r="2" fill="white" opacity="0.6"/>
            <circle cx="1000" cy="300" r="4" fill="white" opacity="0.9"/>
            <circle cx="1500" cy="600" r="3" fill="white" opacity="0.7"/>
            <circle cx="800" cy="800" r="2" fill="white" opacity="0.5"/>
            <circle cx="1200" cy="900" r="3" fill="white" opacity="0.8"/>
          </svg>
        `)}`,
        
        'geometric-eco': `data:image/svg+xml,${encodeURIComponent(`
          <svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
            <rect width="1920" height="1080" fill="#f0f8ff" />
            <polygon points="100,100 200,100 150,180" fill="#3498db" opacity="0.3"/>
            <polygon points="300,200 400,200 350,280" fill="#2ecc71" opacity="0.3"/>
            <polygon points="500,150 600,150 550,230" fill="#e74c3c" opacity="0.3"/>
            <rect x="700" y="300" width="100" height="100" fill="#9b59b6" opacity="0.2" transform="rotate(45 750 350)"/>
          </svg>
        `)}`,
        
        'nature-premium': `data:image/svg+xml,${encodeURIComponent(`
          <svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="natureGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
                <stop offset="30%" style="stop-color:#98FB98;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#228B22;stop-opacity:1" />
              </linearGradient>
            </defs>
            <rect width="1920" height="1080" fill="url(#natureGrad)" />
            <circle cx="1600" cy="200" r="80" fill="rgba(255,223,0,0.8)" />
            <polygon points="0,600 400,300 800,500 1200,350 1600,450 1920,400 1920,1080 0,1080" fill="rgba(34,139,34,0.6)" />
          </svg>
        `)}`
      }
      
      if (svgBackgrounds[bgId]) {
        document.body.style.backgroundImage = `url(${svgBackgrounds[bgId]})`
        console.log(`✓ 内嵌SVG背景应用成功: ${bgId}`)
      }
    }
    
    const selectRandomBackground = () => {
      const randomIndex = Math.floor(Math.random() * backgrounds.length)
      selectBackground(backgrounds[randomIndex].id)
    }
    
    const resetBackground = () => {
      document.body.style.backgroundImage = ''
      document.body.style.backgroundSize = ''
      document.body.style.backgroundPosition = ''
      document.body.style.backgroundRepeat = ''
      document.body.style.backgroundAttachment = ''
      localStorage.removeItem('selectedBackground')
      selectedBackground.value = 'forest-hero'
    }
    
    const getTagColor = (tag) => {
      const colors = {
        '自然': '#4CAF50',
        '绿色': '#8BC34A',
        '现代': '#2196F3',
        '渐变': '#9C27B0',
        '科技': '#673AB7',
        '动态': '#F44336',
        '几何': '#FF9800',
        '设计': '#FF5722',
        '高质量': '#795548'
      }
      return colors[tag] || '#666666'
    }
    
    onMounted(() => {
      // 延迟一点时间确保DOM完全加载
      setTimeout(() => {
        // 从本地存储加载选中的背景
        const saved = localStorage.getItem('selectedBackground')
        const savedPath = localStorage.getItem('selectedBackgroundPath')
        
        if (saved && savedPath) {
          selectedBackground.value = saved
          console.log(`恢复保存的背景: ${saved} - ${savedPath}`)
          
          // 直接应用保存的背景
          document.body.style.backgroundImage = `url(${savedPath})`
          document.body.style.backgroundSize = 'cover'
          document.body.style.backgroundPosition = 'center'
          document.body.style.backgroundRepeat = 'no-repeat'
          document.body.style.backgroundAttachment = 'fixed'
          document.body.classList.add(`bg-${saved}`)
          
          // 验证背景是否加载成功
          setTimeout(() => {
            const testImg = new Image()
            testImg.onload = function() {
              console.log(`✓ 保存的背景路径有效`)
            }
            testImg.onerror = function() {
              console.log(`⚠ 保存的背景路径可能无效，重新加载`)
              selectBackground(saved)
            }
            testImg.src = savedPath
          }, 1000)
        } else if (saved) {
          selectedBackground.value = saved
          console.log(`重新加载保存的背景: ${saved}`)
          selectBackground(saved)
        } else {
          // 设置默认背景
          console.log(`设置默认背景: nature-premium`)
          selectBackground('nature-premium')
        }
      }, 100)
      
      // 监听来自NavBar的背景选择器切换事件
      window.addEventListener('toggleBackgroundSelector', toggleSelector)
    })
    
    onUnmounted(() => {
      // 清理事件监听器
      window.removeEventListener('toggleBackgroundSelector', toggleSelector)
    })
    
    return {
      showSelector,
      selectedBackground,
      backgrounds,
      toggleSelector,
      selectBackground,
      selectRandomBackground,
      resetBackground,
      getTagColor
    }
  }
}
</script>

<style scoped>
.background-selector {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 300px;
}

.selector-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.selector-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  color: #2c3e50;
}

.toggle-btn {
  background: #3498db;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 15px;
  cursor: pointer;
  font-size: 12px;
  transition: background 0.3s ease;
}

.toggle-btn:hover {
  background: #2980b9;
}

.selector-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.selector-content.active {
  max-height: 600px;
  overflow-y: auto;
}

.background-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
  padding: 20px;
}

.background-item {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.background-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.background-item.active {
  border-color: #4CAF50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.3);
}

.bg-preview {
  position: relative;
  height: 120px;
  overflow: hidden;
}

.bg-emoji {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.background-item:hover .bg-emoji {
  transform: scale(1.05);
}

.preview-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
  padding: 10px;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.background-item:hover .preview-overlay {
  transform: translateY(0);
}

.bg-name {
  font-weight: bold;
  margin-bottom: 2px;
  font-size: 12px;
}

.bg-description {
  font-size: 10px;
  opacity: 0.8;
}

.bg-info {
  padding: 15px;
}

.bg-info h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #2c3e50;
}

.bg-info p {
  margin: 0 0 10px 0;
  font-size: 12px;
  color: #7f8c8d;
  line-height: 1.4;
}

.bg-tags {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.tag {
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 10px;
  color: white;
  font-weight: 500;
}

.selector-actions {
  padding: 15px 20px;
  display: flex;
  gap: 10px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.action-btn {
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.action-btn.random {
  background: #9C27B0;
  color: white;
}

.action-btn.random:hover {
  background: #7B1FA2;
}

.action-btn.reset {
  background: #6c757d;
  color: white;
}

.action-btn.reset:hover {
  background: #5a6268;
}

@media (max-width: 768px) {
  .background-selector {
    top: 70px;
    right: 10px;
    max-width: 280px;
  }
  
  .background-grid {
    grid-template-columns: 1fr;
    padding: 15px;
  }
  
  .selector-actions {
    flex-direction: column;
  }
}
</style>