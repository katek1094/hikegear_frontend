import store from "./store/index.js";
import router from "@/router";
import Constants from "./constants"

export function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export function apiFetch(endpoint, options, handled_4xx_codes = []) {
    if (options.headers === undefined) options.headers = {}
    if (getCookie('csrftoken')) options.headers['X-CSRFToken'] = getCookie('csrftoken')
    if (process.env.VUE_APP_INCLUDE_CREDENTIALS === 'true') options.credentials = 'include'
    return fetch(process.env.VUE_APP_API_URL + '/api/' + endpoint, options)
        .then(response => {
            if (response.ok || handled_4xx_codes.includes(response.status)) {
                return response
            } else {
                if (response.status === 403) {
                    if (store.getters['auth/is_logged_in']) {
                        alert('BŁĄD. Z nieznanych mi przyczyn na niektórych starszych smartphonach aplikacja nie działa w następującym przypadku: ' +
                            'jeżeli zamkniesz (nie wyjdziesz z niej) przeglądarkę z otwartą kartą z hikegear.pl, to po ponownym włączeniu ' +
                            'przeglądarki hikegear.pl nie będzie działać w starej karcie, musisz ją zamknąć i otworzyć w nowej karcie lub nie wyłączać przeglądarki. ')
                    } else {
                        store.dispatch('auth/changeLoggedIn', false).then(() => {
                            router.push({name: 'login'})
                        })
                    }
                } else alert(`wystąpił błąd w komunikacji z serwerem - ${response.status}`)
                return response
            }
        })
}

export function summarize_elements_list(categories) {
    let results = {data: [], labels: [], total_weight: 0, consumable_weight: 0, worn_weight: 0}
    for (const category of categories) {
        let category_weight = 0
        results.labels.push(category.name)
        for (const item of category.items) {
            category_weight += item.weight * item.quantity
            if (item.consumable) results.consumable_weight += item.weight * item.quantity
            if (item.worn) results.worn_weight += item.weight
        }
        results.data.push(category_weight)
        results.total_weight += category_weight
    }
    results.base_weight = results.total_weight - results.consumable_weight - results.worn_weight
    return results
}


const Hashids = require("hashids")
export const hashids = new Hashids.default(Constants.HASHIDS_SALT, Constants.HASHIDS_HASH_LEN)
