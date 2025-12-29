<template>
  <div id="app">
    <!-- 暂时禁用AnimatedBackground以让主题背景生效 -->
    <!-- <AnimatedBackground /> -->
    <div class="app-content">
      <router-view />
    </div>
  </div>
</template>

<script>
import AnimatedBackground from './components/AnimatedBackground.vue'

export default {
  name: 'App',
  components: {
    AnimatedBackground
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--text-heading, #123e2e);
  min-height: 100vh;
  position: relative;
}

.app-content {
  position: relative;
  z-index: 10;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --gf-bg1: #eafaf1;
  --gf-bg2: #dff7e8;
  --text-heading: #123e2e;
  --text-main: #154731;
  --text-muted: #6b7780;
  --accent: #27ae60;
  --accent-2: #2ecc71;
}

body {
  /* 移除固定背景，让主题背景生效 */
  background: transparent;
  min-height: 100vh;
}

@keyframes backgroundShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
</style>
