function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export default {
    namespaced: true,
    state() {
        return {
            logged_in: false
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
                    }
                    else {
                        commit('set_logged_in', false)
                        return response.json().then(dt => {
                            return dt
                        })
                    }
                })
        },
    }
}