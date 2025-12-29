<template>
  <div class="animated-background">
    <div class="particles" ref="particlesContainer">
      <div 
        v-for="particle in particles" 
        :key="particle.id"
        class="particle"
        :style="particle.style"
      ></div>
    </div>
    
    <div class="floating-elements">
      <div class="floating-leaf" style="left: 10%; animation-delay: 0s;">🍃</div>
      <div class="floating-leaf" style="left: 30%; animation-delay: 1s;">🍂</div>
      <div class="floating-leaf" style="left: 50%; animation-delay: 2s;">🍁</div>
      <div class="floating-leaf" style="left: 70%; animation-delay: 3s;">🍃</div>
      <div class="floating-leaf" style="left: 90%; animation-delay: 4s;">🍂</div>
    </div>
    
    <div class="aurora-effect"></div>
    <div class="stars-container">
      <div 
        v-for="star in stars" 
        :key="star.id"
        class="star"
        :style="star.style"
      ></div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'AnimatedBackground',
  setup() {
    const particlesContainer = ref(null)
    const particles = ref([])
    const stars = ref([])

    const createParticles = () => {
      const newParticles = []
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          style: {
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            animationDelay: Math.random() * 4 + 's',
            animationDuration: (Math.random() * 3 + 2) + 's'
          }
        })
      }
      particles.value = newParticles
    }

    const createStars = () => {
      const newStars = []
      for (let i = 0; i < 30; i++) {
        newStars.push({
          id: i,
          style: {
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            animationDelay: Math.random() * 3 + 's',
            width: (Math.random() * 3 + 1) + 'px',
            height: (Math.random() * 3 + 1) + 'px'
          }
        })
      }
      stars.value = newStars
    }

    const handleMouseMove = (e) => {
      if (!particlesContainer.value) return
      
      const x = e.clientX / window.innerWidth
      const y = e.clientY / window.innerHeight
      
      particlesContainer.value.style.transform = 
        `translate(${x * 10}px, ${y * 10}px)`
    }

    onMounted(() => {
      createParticles()
      createStars()
      window.addEventListener('mousemove', handleMouseMove)
    })

    onUnmounted(() => {
      window.removeEventListener('mousemove', handleMouseMove)
    })

    return {
      particlesContainer,
      particles,
      stars
    }
  }
}
</script>

<style scoped>
.animated-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: transform 0.2s ease-out;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: float 4s ease-in-out infinite;
}

.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.floating-leaf {
  position: absolute;
  font-size: 1.5rem;
  animation: leafFloat 8s ease-in-out infinite;
  opacity: 0.7;
}

@keyframes leafFloat {
  0% { 
    transform: translateY(-100px) rotate(0deg) translateX(0px);
    opacity: 0;
  }
  10% {
    opacity: 0.7;
  }
  90% {
    opacity: 0.7;
  }
  100% { 
    transform: translateY(100vh) rotate(360deg) translateX(50px);
    opacity: 0;
  }
}

.aurora-effect {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(ellipse at top, transparent 0%, rgba(52, 152, 219, 0.1) 50%, transparent 100%),
    radial-gradient(ellipse at bottom, transparent 0%, rgba(39, 174, 96, 0.1) 50%, transparent 100%);
  animation: aurora 10s ease-in-out infinite alternate;
}

@keyframes aurora {
  0% { opacity: 0.3; }
  50% { opacity: 0.6; }
  100% { opacity: 0.3; }
}

.stars-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.star {
  position: absolute;
  background: white;
  border-radius: 50%;
  animation: twinkle 3s ease-in-out infinite;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 0.6;
  }
  90% {
    opacity: 0.6;
  }
  100% {
    transform: translateY(-20px) translateX(10px);
    opacity: 0;
  }
}
</style>