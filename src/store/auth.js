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
        }
    },
    mutations: {
    },
    getters: {
        are_initial_data(state) {
            return state.id !== 0
        },
    },
    actions: {
        logout() {

        },
        login(context, payload) {
            console.log('inside fetch')
            console.log({
                email: payload.email,
                password: payload.password
            })
            return fetch(process.env.VUE_APP_API_URL + '/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({
                    email: payload.email,
                    password: payload.password
                })
            })
                .then(response => {
                    if (response.ok) {
                        return 'logged in'
                    }
                    else {
                        console.log(response)
                        return response.json().then(dt => {
                            console.log(dt)
                            return dt.non_field_errors[0]
                        })
                    }
                })
        },
    }
}