import {createRouter, createWebHistory} from 'vue-router'

import LandingPage from "@/components/LandingPage";
import Editor from "@/components/Editor";
import Settings from "@/components/Settings";
import store from "./store/index.js";
import Register from "@/components/Register";
import Login from "@/components/Login";
import RecoverPassword from "@/components/RecoverPassword";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {path: '/editor', component: Editor, name: 'editor', meta: {require_auth: true}},
        {path: '/settings', component: Settings, name: 'settings', meta: {require_auth: true}},
        {path: '/', component: LandingPage,
            children: [
                {path: '', component: Login, name: 'login'},
                {path: 'register', component: Register, name: 'register'},
                {path: 'recover_password', component: RecoverPassword, name: 'recover_password'},
            ],
        },
    ],
})

router.beforeEach((to, from, next) => {
    if (store.getters['auth/is_logged_in']) next()
    else if (!to.meta.require_auth) next()
    else next({name: 'login'})
})


export default router