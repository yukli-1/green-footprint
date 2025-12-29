import { reactive } from 'vue'

export const store = reactive({
  user: {
    isLoggedIn: false,
    name: '',
    avatar: '',
    totalPoints: 0,
    level: 1,
    badges: []
  },
  actions: [],
  challenges: [],
  plants: [],
  
  login(userData) {
    this.user.isLoggedIn = true
    this.user.name = userData.name
    this.user.avatar = userData.avatar
  },
  
  logout() {
    this.user.isLoggedIn = false
    this.user.name = ''
    this.user.avatar = ''
  },
  
  addAction(action) {
    action.id = Date.now()
    action.timestamp = new Date().toISOString()
    this.actions.unshift(action)
    this.user.totalPoints += action.points
    this.updateLevel()
  },
  
  updateLevel() {
    this.user.level = Math.floor(this.user.totalPoints / 100) + 1
  },
  
  addPlant(plant) {
    this.plants.push(plant)
  },
  
  unlockBadge(badge) {
    if (!this.user.badges.find(b => b.id === badge.id)) {
      this.user.badges.push(badge)
    }
  }
})