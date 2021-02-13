import getCookie from '@/store/functions'

export default {
    namespaced: true,
    state() {
        return {
            logged_in: undefined
        }
    },
    mutations: {
        set_logged_in(state, bool) {
            if (state.logged_in !== bool) state.logged_in = bool
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
            return fetch(process.env.VUE_APP_API_URL + '/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                credentials: 'include'
            })
                .then(response => {
                    if (response.ok) {
                        commit('set_logged_in', false)
                        return 'you are logged out'
                    } else console.log(response)
                })
        },
        login({commit}, payload) {
            return fetch(process.env.VUE_APP_API_URL + '/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                // TODO: credentials are necessary only on local development
                credentials: 'include',
                body: JSON.stringify({
                    email: payload.email,
                    password: payload.password
                })
            })
                .then(response => {
                    if (response.ok) {
                        commit('set_logged_in', true)
                        return 'logged in'
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