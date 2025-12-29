import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ActionRecord from '../views/ActionRecord.vue'
import FootprintData from '../views/FootprintData.vue'
import CommunityChallenge from '../views/CommunityChallenge.vue'
import ChallengeDetail from '../views/ChallengeDetail.vue'
import KnowledgeDetail from '../views/KnowledgeDetail.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/knowledge/:id',
        name: 'KnowledgeDetail',
        component: KnowledgeDetail,
        props: true
    },
    {
        path: '/action-record',
        name: 'ActionRecord',
        component: ActionRecord
    },
    {
        path: '/footprint-data',
        name: 'FootprintData',
        component: FootprintData
    },
    {
        path: '/community-challenge',
        name: 'CommunityChallenge',
        component: CommunityChallenge
    },
    {
        path: '/challenge/:id',
        name: 'ChallengeDetail',
        component: ChallengeDetail,
        props: true
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router