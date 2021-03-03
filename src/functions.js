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
    options.headers['X-CSRFToken'] = getCookie('csrftoken')
    options.credentials = 'include'
    return fetch(process.env.VUE_APP_API_URL + '/api/' + endpoint, options)
}

export function summarize_elements_list(elements_list) {
    let results = {data: [], labels: [], total_weight: 0, consumable_weight: 0, worn_weight: 0}
    for (let i = 0; i < elements_list.length; i++) {
        let el = elements_list[i]
        if (el.is_item === false) {
            results.data.push(0)
            results.labels.push(el.name)
        } else {
            let item_weight = el.weight
            results.data[results.data.length - 1] += (item_weight * el.quantity)
            results.total_weight += (item_weight * el.quantity)
            if (el.consumable) {
                results.consumable_weight += (item_weight * el.quantity)
            }
            if (el.worn) {
                results.worn_weight += item_weight
            }
        }
    }
    results.base_weight = results.total_weight - results.consumable_weight - results.worn_weight
    return results
}

export function format_elements_list(elements_list) {
    let organized = []
    let category_counter = 0
    if (elements_list[0].is_item !== false) {
        throw 'first item of backpack list is not a category! something is wrong'
    }
    for (let i = 0; i < elements_list.length; i++) {
        let element = elements_list[i]
        element.list_index = i
        if (element.is_item === false) {
            element.items = []
            element.category_index = category_counter
            element.total_weight = 0
            element.total_quantity = 0
            category_counter++
            organized.push(element)
        } else if (element.is_item === true) {
            organized[organized.length - 1].items.push(element)
            organized[organized.length - 1].total_weight += element.weight * element.quantity
            if (element.quantity === '') element.quantity = 0
            organized[organized.length - 1].total_quantity += element.quantity
        } else throw 'backpack list element is neither category nor item!'
    }
    return organized
}
