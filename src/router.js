import {createRouter, createWebHistory} from 'vue-router'

import LandingPage from "@/components/LandingPage";
import Editor from "@/components/Editor";
import Settings from "@/components/Settings";
import store from "./store/index.js";
import Register from "@/components/Register";
import Login from "@/components/Login";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {path: '/', component: LandingPage,
            children: [
                {path: '', component: Login, name: 'login'},
                {path: 'register', component: Register, name: 'register'}
            ],
        },
        {path: '/editor', component: Editor, name: 'editor', meta: {require_auth: true}},
        {path: '/settings', component: Settings, name: 'settings', meta: {require_auth: true}},
    ],
})

router.beforeEach((to, from, next) => {
    if (store.getters['auth/is_logged_in']) next()
    else if (!to.meta.require_auth) next()
    else next({name: 'landing_page'})
})


export default router