import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHashHistory } from 'vue-router'
import AuthLogin from './AuthLogin.vue'
import NotFound from './NotFound.vue'
import DeleteWallet from './DeleteWallet.vue'
import AuthCreate from './AuthCreate.vue'
import PublicHome from './PublicHome.vue'
import AuthMnemonic from './AuthMnemonic.vue'
import WalletHome from './WalletHome.vue'
import LogOut from './LogOut.vue'
import AuthRestore from './AuthRestore.vue'
import { useUserData } from './store/user.ts'

import 'bootstrap/dist/css/bootstrap.min.css'

function routeGuardAuthUserHome(to, from) {
    const user = useUserData()
    if (user.isAuthenticated()) {
        return {name: 'wallet-home'}
    }
}

const router = createRouter({
    routes: [
        {
            name: 'not-found',
            path: '/:url(.*)',
            component: NotFound,
            meta: {requiresAuth: false},
        },
        {
            name: 'home',
            path: '/',
            component: PublicHome,
            meta: {requiresAuth: false},
            beforeEnter: routeGuardAuthUserHome,
        },
        {
            path: '/auth',
            meta: {requiresAuth: false},
            children: [
                {
                    name: 'auth-login',
                    path: '/auth/login',
                    component: AuthLogin,
                    beforeEnter: routeGuardAuthUserHome,
                },
                {
                    name: 'auth-logout',
                    path: '/auth/logout',
                    component: LogOut
                },
                {
                    name: 'auth-create',
                    path: '/auth/create',
                    component: AuthCreate,
                },
                {
                    name: 'auth-restore',
                    path: '/auth/restore',
                    component: AuthRestore,
                },
                {
                    name: 'auth-mnemonic',
                    path: '/auth/mnemonic',
                    component: AuthMnemonic,
                },
                {
                    name: 'auth-delete',
                    path: '/auth/delete',
                    component: DeleteWallet
                },
            ],
        },
        {
            name: 'wallet-home',
            path: '/wallet',
            component: WalletHome,
        }
    ],
    history: createWebHashHistory()
})
const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')
