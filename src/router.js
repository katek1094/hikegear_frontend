import {createRouter, createWebHistory} from 'vue-router'

import store from "./store/index.js";

import Editor from "./components/inside/editor/Editor";
import Settings from "./components/inside/Settings";
import Register from "./components/outside/Register";
import Login from "./components/outside/Login";
import VerifyYourEmail from "./components/outside/VerifyYourEmail";
import Backpack from "./components/outside/Backpack";
import MyGearEditor from "./components/inside/my_gear_editor/MyGearEditor";
import NotFound from "./components/outside/NotFound";
import LandingPage from "./components/outside/LandingPage";
import ActivationLinkExpired from "./components/outside/ActivationLinkExpired";
import ForgottenPassword from "./components/outside/ForgottenPassword";
import ResetPasswordForm from "./components/outside/ResetPasswordForm";
import Reviews from "./components/inside/reviews/Reviews";
import NewProduct from "./components/inside/reviews/NewProduct";
import NewReview from "./components/inside/reviews/NewReview";
import ProductPage from "./components/inside/reviews/ProductPage";
import NewBrand from "./components/inside/reviews/NewBrand";
import EditReview from "./components/inside/reviews/EditReview";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {path: '/', component: LandingPage, name: 'landing_page'},
        {path: '/edytor', component: Editor, name: 'editor', meta: {require_auth: true}},
        {path: '/konto', component: Settings, name: 'settings', meta: {require_auth: true}},
        {path: '/recenzje', component: Reviews, name: 'reviews', meta: {require_auth: true}},
        {path: '/nowy_produkt', component: NewProduct, name: 'new_product', meta: {require_auth: true}},
        {path: '/nowy_marka', component: NewBrand, name: 'new_brand', meta: {require_auth: true}},
        {path: '/nowa_recenzja/:product_id', component: NewReview, name: 'new_review', props: true, meta: {require_auth: true}},
        {path: '/edycja_recenzji/:review_id/:product_id', component: EditReview, name: 'edit_review', props: true, meta: {require_auth: true}},
        {path: '/produkt/:id', component: ProductPage, name: 'product_page', props: true, meta: {require_auth: true}},
        {path: '/logowanie', component: Login, name: 'login'},
        {path: '/rejestracja', component: Register, name: 'register'},
        {path: '/weryfikacja_email', component: VerifyYourEmail, name: 'verify_email'},
        {path: '/link_wygasl', component: ActivationLinkExpired, name: 'activation_link_expired'},
        {path: '/zapomnialem_hasla', component: ForgottenPassword, name: 'forgotten_password'},
        {path: '/reset_hasla/:uidb64/:token', component: ResetPasswordForm, name: 'password_reset', props: true},
        {path: '/lista/:hash', component: Backpack, name: 'backpack', props: true},
        {path: '/moj_sprzet', component: MyGearEditor, name: 'my_gear', meta: {require_auth: true}},
        {path: '/:pathMatch(.*)*', component: NotFound, name: 'not_found'},
    ],
})

router.beforeEach((to, from, next) => {
    function guard() {
        if (store.getters['auth/is_logged_in']) {
            if (to.name === 'landing_page') next({name: 'editor'})
            else next()
        } else if (to.meta.require_auth) next({name: 'login'})
        else next()
    }

    if (store.getters['auth/is_logged_in'] === undefined && (to.meta.require_auth || to.path === '/')) {
        store.dispatch('getInitialData').then(response => {
            if (response.ok) store.dispatch('auth/changeLoggedIn', true)
            else if (response.status === 403) store.dispatch('auth/changeLoggedIn', false)
        })
            .then(guard)
    } else guard()
})

export default router
