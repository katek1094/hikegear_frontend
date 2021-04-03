import {apiFetch} from '@/functions'
import router from "@/router";

export default {
    namespaced: true,
    state() {
        return {
            logged_in: undefined
        }
    },
    mutations: {
        set_logged_in(state, bool) {
            state.logged_in = bool
        },
    },
    getters: {
        is_logged_in: state => state.logged_in
    },
    actions: {
        changeLoggedIn({commit}, bool) {
            commit('set_logged_in', bool)
        },
        logout({commit}) {
            return apiFetch('logout', {
                method: 'POST',
            })
                .then(response => {
                    commit('set_logged_in', false)
                    router.push('/')
                    if (!response.ok) console.log(response)
                })
        },
        login({commit}, payload) {
            return apiFetch('login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    email: payload.email,
                    password: payload.password
                })
            })
                .then(response => {
                    if (response.ok) {
                        commit('set_logged_in', true)
                        return response.status // 200
                    } else {
                        commit('set_logged_in', false)
                        if (response.status === 401) {
                            return 'bad credentials'
                        } else if (response.status === 403) {
                            return 'activate your account'
                        } else console.log(response)
                    }
                })
        },
    }
}
