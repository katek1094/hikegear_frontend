export default {
    namespaced: true,
    state() {
        return {

        }
    },
    mutations: {
    },
    getters: {
        are_initial_data(state) {
            return state.id !== 0
        }
    },
    actions: {
        logout({commit}) {
            commit('set_token', '')
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
    }
}