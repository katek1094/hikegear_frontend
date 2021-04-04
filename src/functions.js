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

export function apiFetch(endpoint, options) {
    if (options.headers === undefined) options.headers = {}
    if (getCookie('csrftoken')) options.headers['X-CSRFToken'] = getCookie('csrftoken')
    if (process.env.VUE_APP_INCLUDE_CREDENTIALS === 'true') options.credentials = 'include'
    return fetch(process.env.VUE_APP_API_URL + '/api/' + endpoint, options).then(response => {
        if (response.ok || response.status === 404 || response.status === 410) { // 400 also?
            return response
        } else return response

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

import Constants from "@/./constants"

const Hashids = require("hashids")
export const hashids = new Hashids.default(Constants.HASHIDS_SALT, Constants.HASHIDS_HASH_LEN)
