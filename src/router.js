import {createRouter, createWebHistory} from 'vue-router'

import store from "./store/index.js";

import Editor from "@/components/inside/editor/Editor";
import Settings from "@/components/inside/Settings";
import Register from "@/components/outside/Register";
import Login from "@/components/outside/Login";
import VerifyYourEmail from "@/components/outside/VerifyYourEmail";
import Backpack from "@/components/outside/Backpack";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {path: '/', redirect: '/editor'},
        {path: '/editor', component: Editor, name: 'editor', meta: {require_auth: true}},
        {path: '/settings', component: Settings, name: 'settings', meta: {require_auth: true}},
        {path: '/login', component: Login, name: 'login'},
        {path: '/register', component: Register, name: 'register'},
        {path: '/verify_email', component: VerifyYourEmail, name: 'verify_email'},
        {path: '/backpack/:id', component: Backpack, name: 'backpack', props: true},
    ],
})

router.beforeEach((to, from, next) => {
    function guard() {
        if (store.getters['auth/is_logged_in']) next()
        else if (!to.meta.require_auth) next()
        else next({name: 'login'})
    }

    if (store.getters['auth/is_logged_in'] === undefined) {
        store.dispatch('editor/getInitialData').then(status => {
            if (status === 'not logged in') store.dispatch('auth/changeLoggedIn', false)
            else store.dispatch('auth/changeLoggedIn', true)
        })
            .then(guard)
    } else guard()
})

export default router
