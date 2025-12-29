<template>
  <div class="parallax-hero" @mousemove="handleMouseMove">
    <div class="parallax-layers">
      <div 
        v-for="layer in layers" 
        :key="layer.id"
        class="parallax-layer"
        :class="layer.class"
        :style="getLayerStyle(layer)"
      >
        <div class="layer-content" v-if="layer.content">
          <component :is="layer.content" />
        </div>
        <img 
          v-else-if="layer.image"
          :src="layer.image" 
          :alt="layer.alt"
          class="layer-image"
        />
        <div 
          v-else-if="layer.particles"
          class="layer-particles"
        >
          <div 
            v-for="particle in layer.particles" 
            :key="particle.id"
            class="particle"
            :style="particle.style"
          >
            {{ particle.icon }}
          </div>
        </div>
      </div>
    </div>
    
    <div class="hero-content">
      <div class="hero-text">
        <h1 class="hero-title">
          <span class="title-word" v-for="(word, index) in titleWords" :key="index">
            {{ word }}
          </span>
        </h1>
        <p class="hero-subtitle">{{ subtitle }}</p>
        <div class="hero-actions">
          <button class="hero-btn primary">开始探索</button>
          <button class="hero-btn secondary">了解更多</button>
        </div>
      </div>
      
      <div class="hero-visual">
        <div class="earth-container">
          <div class="earth">
            <div class="earth-glow"></div>
            <div class="earth-surface"></div>
          </div>
          <div class="orbit-rings">
            <div class="ring ring-1"></div>
            <div class="ring ring-2"></div>
            <div class="ring ring-3"></div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="scroll-indicator">
      <div class="scroll-arrow"></div>
      <div class="scroll-text">向下滚动</div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'ParallaxHero',
  props: {
    title: {
      type: String,
      default: '绿色足迹'
    },
    subtitle: {
      type: String,
      default: '记录每一次环保行动，共同守护地球家园'
    }
  },
  setup(props) {
    const mouseX = ref(0)
    const mouseY = ref(0)
    
    const titleWords = computed(() => {
      return props.title.split('').map(char => ({ char, delay: Math.random() * 0.5 }))
    })
    
    const layers = ref([
      {
        id: 1,
        class: 'stars-layer',
        particles: Array.from({ length: 20 }, (_, i) => ({
          id: i,
          icon: '✨',
          style: {
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            animationDelay: Math.random() * 3 + 's',
            fontSize: Math.random() * 10 + 10 + 'px'
          }
        }))
      },
      {
        id: 2,
        class: 'clouds-layer',
        speed: 0.3,
        image: '/images/backgrounds/parallax-layers-9.JPG'
      },
      {
        id: 3,
        class: 'mountains-layer',
        speed: 0.5,
        image: '/images/backgrounds/parallax-layers-9.JPG'
      },
      {
        id: 4,
        class: 'trees-layer',
        speed: 0.8,
        image: '/images/backgrounds/parallax-layers-9.JPG'
      }
    ])
    
    const handleMouseMove = (e) => {
      mouseX.value = (e.clientX / window.innerWidth - 0.5) * 2
      mouseY.value = (e.clientY / window.innerHeight - 0.5) * 2
    }
    
    const getLayerStyle = (layer) => {
      const baseStyle = {
        transform: `translateX(${mouseX.value * layer.speed * 20}px) translateY(${mouseY.value * layer.speed * 10}px)`
      }
      
      if (layer.image) {
        baseStyle.backgroundImage = `url(${layer.image})`
        baseStyle.backgroundSize = 'cover'
        baseStyle.backgroundPosition = 'center'
      }
      
      return baseStyle
    }
    
    onMounted(() => {
      window.addEventListener('mousemove', handleMouseMove)
    })
    
    onUnmounted(() => {
      window.removeEventListener('mousemove', handleMouseMove)
    })
    
    return {
      titleWords,
      layers,
      getLayerStyle,
      handleMouseMove
    }
  }
}
</script>

<style scoped>
.parallax-hero {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%);
}

.parallax-layers {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.parallax-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: transform 0.1s ease-out;
}

.stars-layer {
  z-index: 1;
}

.clouds-layer {
  z-index: 2;
  opacity: 0.6;
}

.mountains-layer {
  z-index: 3;
  opacity: 0.8;
}

.trees-layer {
  z-index: 4;
}

.layer-particles {
  position: absolute;
  width: 100%;
  height: 100%;
}

.particle {
  position: absolute;
  animation: twinkle 3s ease-in-out infinite;
}

.layer-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-content {
  position: relative;
  z-index: 10;
  text-align: center;
  color: white;
  padding: 0 20px;
}

.hero-title {
  font-size: clamp(2rem, 8vw, 4rem);
  font-weight: 800;
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.title-word {
  display: inline-block;
  animation: titleFloat 3s ease-in-out infinite;
  animation-delay: calc(var(--index) * 0.1s);
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
}

@keyframes titleFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.hero-subtitle {
  font-size: clamp(1rem, 3vw, 1.5rem);
  margin-bottom: 40px;
  opacity: 0.9;
  font-weight: 300;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.hero-btn {
  padding: 15px 30px;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.hero-btn.primary {
  background: linear-gradient(45deg, #27ae60, #2ecc71);
  color: white;
  box-shadow: 0 4px 15px rgba(39, 174, 96, 0.3);
}

.hero-btn.secondary {
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.8);
}

.hero-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
}

.hero-visual {
  margin-top: 60px;
  position: relative;
}

.earth-container {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto;
}

.earth {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(45deg, #4a90e2, #7e57c2);
  margin: 50px auto;
  animation: earthRotate 20s linear infinite;
  box-shadow: 
    0 0 50px rgba(74, 144, 226, 0.5),
    inset -10px -10px 20px rgba(0, 0, 0, 0.3);
}

.earth-glow {
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(74, 144, 226, 0.3) 0%, transparent 70%);
  animation: glowPulse 3s ease-in-out infinite;
}

.earth-surface {
  position: absolute;
  top: 20%;
  left: 10%;
  width: 30%;
  height: 30%;
  background: rgba(39, 174, 96, 0.6);
  border-radius: 50%;
  filter: blur(3px);
}

.orbit-rings {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.ring {
  position: absolute;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  animation: ringRotate 15s linear infinite;
}

.ring-1 {
  top: -30px;
  left: -30px;
  right: -30px;
  bottom: -30px;
  animation-duration: 10s;
}

.ring-2 {
  top: -50px;
  left: -50px;
  right: -50px;
  bottom: -50px;
  animation-duration: 15s;
  animation-direction: reverse;
}

.ring-3 {
  top: -70px;
  left: -70px;
  right: -70px;
  bottom: -70px;
  animation-duration: 20s;
}

.scroll-indicator {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  opacity: 0.7;
  animation: bounce 2s ease-in-out infinite;
}

.scroll-arrow {
  width: 30px;
  height: 30px;
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-top: none;
  border-left: none;
  transform: rotate(45deg);
  margin: 0 auto 10px;
}

.scroll-text {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
}

@keyframes earthRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes glowPulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.8; }
}

@keyframes ringRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
  40% { transform: translateX(-50%) translateY(-10px); }
  60% { transform: translateX(-50%) translateY(-5px); }
}

@keyframes twinkle {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

@media (max-width: 768px) {
  .hero-content {
    padding: 0 20px;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .earth-container {
    width: 150px;
    height: 150px;
  }
  
  .earth {
    width: 80px;
    height: 80px;
  }
}
</style>