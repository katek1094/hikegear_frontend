export default {
    namespaced: true,
    state() {
        return {
            // token: 'b93292f1450db02bcab752979e2c21c4e0fe344a',
            token: '',
            // id: 9,
        }
    },
    mutations: {
        set_token(state, token) {
            state.token = token
        },
        set_id(state, id) {
            state.id = id
        },
    },
    getters: {
        id(state) {
            return state.id
        },
        token(state) {
            return state.token
        },
        is_logged_in(state) {
            return state.token !== ''
        },
        are_initial_data(state) {
            return state.id !== 0
        }
    },
    actions: {
        logout({commit}) {
            commit('set_token', '')
            commit('set_id', undefined)
        },
        login({commit}, payload) {
            return fetch(process.env.VUE_APP_API_URL + '/api/obtain_token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: payload.email,
                    password: payload.password
                })
            })
                .then(response => {
                    if (response.ok) {
                        return response.json().then(data => {
                            commit('set_token', data.token)
                            return 'logged in'
                        })
                    } else {
                        return response.json().then(dt => dt.non_field_errors[0])
                    }
                })
        },
        get_initial_data({commit, getters, dispatch}) {
            fetch(process.env.VUE_APP_API_URL + '/api/initial', {
                method: 'GET',
                headers: {'Authorization': 'token ' + getters['token']}
            })
                .then(response => {
                    if (response.ok) {
                        response.json().then(data => {
                            commit('set_id', data.id)
                            dispatch('editor/loadInitialBackpacks', data.backpacks, {root: true})
                        })
                    } else {
                        console.log(response)
                    }
                })
        }
    }
}