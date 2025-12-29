<template>
  <nav class="navbar">
    <div class="nav-container">
      <!-- Logo -->
      <div class="nav-logo" @click="$router.push('/')">
        <span class="logo-icon">🌱</span>
        <span class="logo-text">绿色足迹</span>
      </div>

      <!-- 导航菜单 -->
      <div class="nav-menu" :class="{ active: menuOpen }">
        <router-link 
          v-for="item in navItems" 
          :key="item.path"
          :to="item.path"
          class="nav-item"
          @click="closeMenu"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-text">{{ item.name }}</span>
        </router-link>
      </div>

      <!-- 用户区域 -->
      <div class="nav-user">
        <div v-if="store.user.isLoggedIn" class="user-menu">
          <div class="user-info" @click="toggleUserDropdown">
            <div class="user-avatar">
              <img v-if="store.user.avatar" :src="store.user.avatar" alt="头像">
              <span v-else>👤</span>
            </div>
            <div class="user-details">
              <span class="user-name">{{ store.user.name }}</span>
              <span class="user-level">Lv.{{ store.user.level }}</span>
            </div>
          </div>
          
          <div class="user-dropdown" v-if="userDropdownOpen">
            <div class="dropdown-item" @click="$router.push('/footprint-data')">
              <span>📊 我的数据</span>
            </div>
            <div class="dropdown-item" @click="$router.push('/community-challenge')">
              <span>🏆 我的挑战</span>
            </div>
            <div class="dropdown-item settings" @click="showSettings">
              <span>⚙️ 设置</span>
            </div>
            <div class="dropdown-divider"></div>
            <div class="dropdown-item logout" @click="logout">
              <span>🚪 退出登录</span>
            </div>
          </div>
        </div>
        
        <div v-else class="auth-buttons">
          <button class="login-btn" @click="showLoginModal">登录</button>
          <button class="register-btn" @click="showRegisterModal">注册</button>
        </div>
      </div>

      <!-- 移动端菜单按钮 -->
      <button class="menu-toggle" @click="toggleMenu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    
    <!-- 背景选择器按钮 -->
    <button class="bg-selector-btn" @click="toggleBackgroundSelector">
      🎨
    </button>
    </div>
    
    <!-- 背景选择器组件 -->
    <BackgroundSelector />

    <!-- 登录模态框 -->
    <div v-if="showLogin" class="modal-overlay" @click="closeLoginModal">
      <div class="modal-content" @click.stop>
        <h2>登录</h2>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label>用户名</label>
            <input v-model="loginForm.username" required>
          </div>
          <div class="form-group">
            <label>密码</label>
            <input type="password" v-model="loginForm.password" required>
          </div>
          <div class="form-actions">
            <button type="button" @click="closeLoginModal">取消</button>
            <button type="submit">登录</button>
          </div>
        </form>
        <p class="switch-auth">
          还没有账号？<span @click="switchToRegister">立即注册</span>
        </p>
      </div>
    </div>

    <!-- 注册模态框 -->
    <div v-if="showRegister" class="modal-overlay" @click="closeRegisterModal">
      <div class="modal-content" @click.stop>
        <h2>注册</h2>
        <form @submit.prevent="handleRegister">
          <div class="form-group">
            <label>用户名</label>
            <input v-model="registerForm.username" required>
          </div>
          <div class="form-group">
            <label>邮箱</label>
            <input type="email" v-model="registerForm.email" required>
          </div>
          <div class="form-group">
            <label>密码</label>
            <input type="password" v-model="registerForm.password" required>
          </div>
          <div class="form-group">
            <label>确认密码</label>
            <input type="password" v-model="registerForm.confirmPassword" required>
          </div>
          <div class="form-actions">
            <button type="button" @click="closeRegisterModal">取消</button>
            <button type="submit">注册</button>
          </div>
        </form>
        <p class="switch-auth">
          已有账号？<span @click="switchToLogin">立即登录</span>
        </p>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../store'

import BackgroundSelector from './BackgroundSelector.vue'

export default {
  name: 'NavBar',
  components: {
    BackgroundSelector
  },
  setup() {
    const router = useRouter()
    const menuOpen = ref(false)
    const userDropdownOpen = ref(false)
    const showLogin = ref(false)
    const showRegister = ref(false)
    
    const loginForm = ref({
      username: '',
      password: ''
    })
    
    const registerForm = ref({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    })

    const navItems = [
      { name: '首页', path: '/', icon: '🏠' },
      { name: '行动记录', path: '/action-record', icon: '📝' },
      { name: '足迹数据', path: '/footprint-data', icon: '🌍' },
      { name: '社群挑战', path: '/community-challenge', icon: '🏆' }
    ]

    const toggleMenu = () => {
      menuOpen.value = !menuOpen.value
    }

    const closeMenu = () => {
      menuOpen.value = false
    }

    const toggleUserDropdown = () => {
      userDropdownOpen.value = !userDropdownOpen.value
    }

    const showLoginModal = () => {
      showLogin.value = true
      showRegister.value = false
    }

    const closeLoginModal = () => {
      showLogin.value = false
      loginForm.value = { username: '', password: '' }
    }

    const showRegisterModal = () => {
      showRegister.value = true
      showLogin.value = false
    }

    const closeRegisterModal = () => {
      showRegister.value = false
      registerForm.value = { 
        username: '', 
        email: '', 
        password: '', 
        confirmPassword: '' 
      }
    }

    const switchToRegister = () => {
      closeLoginModal()
      showRegisterModal()
    }

    const switchToLogin = () => {
      closeRegisterModal()
      showLoginModal()
    }

    const handleLogin = () => {
      // 模拟登录逻辑
      if (loginForm.value.username && loginForm.value.password) {
        store.login({
          name: loginForm.value.username,
          avatar: ''
        })
        closeLoginModal()
        alert('登录成功！')
      }
    }

    const handleRegister = () => {
      if (registerForm.value.password !== registerForm.value.confirmPassword) {
        alert('两次密码输入不一致')
        return
      }
      
      if (registerForm.value.username && registerForm.value.email && registerForm.value.password) {
        store.login({
          name: registerForm.value.username,
          avatar: ''
        })
        closeRegisterModal()
        alert('注册成功！')
      }
    }

    const logout = () => {
      store.logout()
      userDropdownOpen.value = false
      router.push('/')
    }

    const showSettings = () => {
      userDropdownOpen.value = false
      alert('设置功能开发中...')
    }

    const toggleBackgroundSelector = () => {
      // 触发背景选择器的事件
      const event = new CustomEvent('toggleBackgroundSelector')
      window.dispatchEvent(event)
    }

    return {
      store,
      menuOpen,
      userDropdownOpen,
      showLogin,
      showRegister,
      loginForm,
      registerForm,
      navItems,
      toggleMenu,
      closeMenu,
      toggleUserDropdown,
      showLoginModal,
      closeLoginModal,
      showRegisterModal,
      closeRegisterModal,
      switchToRegister,
      switchToLogin,
      handleLogin,
      handleRegister,
      logout,
      showSettings,
      toggleBackgroundSelector
    }
  }
}
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 30px;
  position: relative;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.nav-logo:hover {
  transform: scale(1.05);
}

.logo-icon {
  font-size: 1.8rem;
}

.logo-text {
  font-size: 1.3rem;
  font-weight: bold;
  color: #2c3e50;
}

.nav-menu {
  display: flex;
  gap: 15px;
  align-items: center;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  text-decoration: none;
  color: #7f8c8d;
  border-radius: 25px;
  transition: all 0.3s ease;
  position: relative;
  font-weight: 500;
  font-size: 15px;
}

.nav-item:hover {
  background: rgba(52, 152, 219, 0.1);
  color: #3498db;
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.2);
}

.nav-item.router-link-active {
  background: #3498db;
  color: white;
}

.nav-icon {
  font-size: 1.1rem;
}

.nav-text {
  font-weight: 500;
}

.nav-user {
  position: relative;
}

.user-menu {
  position: relative;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-info:hover {
  background: #e9ecef;
}

.user-avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #3498db;
  color: white;
  overflow: hidden;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: bold;
  color: #2c3e50;
  font-size: 0.9rem;
}

.user-level {
  font-size: 0.8rem;
  color: #27ae60;
  font-weight: bold;
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 10px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(0, 0, 0, 0.1);
  min-width: 180px;
  overflow: hidden;
  z-index: 1000;
}

.dropdown-item {
  padding: 12px 20px;
  cursor: pointer;
  transition: background 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
}

.dropdown-item:hover {
  background: #f8f9fa;
}

.dropdown-item.settings {
  border-top: 1px solid #f0f0f0;
}

.dropdown-item.logout:hover {
  background: #fee;
  color: #e74c3c;
}

.dropdown-divider {
  height: 1px;
  background: #f0f0f0;
}

.auth-buttons {
  display: flex;
  gap: 10px;
}

.login-btn,
.register-btn {
  padding: 8px 20px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.login-btn {
  background: transparent;
  color: #3498db;
  border: 2px solid #3498db;
}

.login-btn:hover {
  background: #3498db;
  color: white;
}

.register-btn {
  background: #27ae60;
  color: white;
}

.register-btn:hover {
  background: #219a52;
}

.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
}

.menu-toggle span {
  width: 25px;
  height: 3px;
  background: #2c3e50;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.bg-selector-btn {
  position: fixed;
  top: 80px;
  right: 20px;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 22px;
  transition: all 0.3s ease;
  z-index: 1002;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  color: white;
}

.bg-selector-btn:hover {
  transform: scale(1.1) rotate(90deg);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 400px;
  width: 90%;
  margin: auto;
  position: relative;
  animation: modalSlideIn 0.3s ease-out;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-content h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
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

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #3498db;
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
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
  background: #3498db;
  color: white;
}

.form-actions button[type="submit"]:hover {
  background: #2980b9;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.switch-auth {
  text-align: center;
  margin-top: 20px;
  color: #7f8c8d;
}

.switch-auth span {
  color: #3498db;
  cursor: pointer;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .modal-content {
    margin: 20px;
    width: calc(100% - 40px);
    max-width: none;
    padding: 30px 20px;
  }

  .nav-container {
    padding: 10px 15px;
  }

  .bg-selector-btn {
    display: block;
  }

  .nav-menu {
    position: fixed;
    top: 0;
    left: -100%;
    width: 80%;
    height: 100vh;
    background: white;
    flex-direction: column;
    padding: 80px 20px 20px;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
    transition: left 0.3s ease;
    z-index: 99;
  }

  .nav-menu.active {
    left: 0;
  }

  .nav-item {
    width: 100%;
    padding: 15px 20px;
    border-radius: 10px;
    margin-bottom: 10px;
  }

  .menu-toggle {
    display: flex;
    z-index: 101;
  }

  .menu-toggle.active span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }

  .menu-toggle.active span:nth-child(2) {
    opacity: 0;
  }

  .menu-toggle.active span:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -6px);
  }

  .user-details {
    display: none;
  }

  .auth-buttons {
    flex-direction: column;
    gap: 8px;
  }

  .login-btn,
  .register-btn {
    padding: 6px 15px;
    font-size: 0.9rem;
  }
}
</style>