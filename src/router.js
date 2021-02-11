import {createRouter, createWebHistory} from 'vue-router'

import store from "./store/index.js";

import Editor from "@/components/Editor";
import Settings from "@/components/Settings";
import Register from "@/components/Register";
import Login from "@/components/Login";
import RecoverPassword from "@/components/RecoverPassword";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {path: '/', redirect: '/editor'},
        {path: '/editor', component: Editor, name: 'editor', meta: {require_auth: true}},
        {path: '/settings', component: Settings, name: 'settings', meta: {require_auth: true}},
        {path: '/login', component: Login, name: 'login'},
        {path: '/register', component: Register, name: 'register'},
        {path: '/recover_password', component: RecoverPassword, name: 'recover_password'},
    ],
})

router.beforeEach((to, from, next) => {
    // console.log(store.getters['auth/is_logged_in'])
    // console.log('before each')
    if (store.getters['auth/is_logged_in']) next()
    else if (!to.meta.require_auth) next()
    else {
        // console.log(store.getters['auth/is_logged_in'])
        // console.log('redirect')
        next({name: 'login'})
    }
})

export default router