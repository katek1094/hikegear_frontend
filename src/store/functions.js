export function getCookie(name) {
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

export function summarize_elements_list(elements_list) {
    let results = {data: [], labels: [], total_weight: 0, consumable_weight: 0, worn_weight: 0}
    for (let i = 0; i < elements_list.length; i++) {
        let dt = elements_list[i]
        if (dt.type === 'category') {
            results.data.push(0)
            results.labels.push(dt.name)
        } else {
            results.data[results.data.length - 1] += (dt.weight * dt.quantity)
            results.total_weight += (dt.weight * dt.quantity)
            if (dt.consumable) {
                results.consumable_weight += (dt.weight * dt.quantity)
            }
            if (dt.worn) {
                results.worn_weight += dt.weight
            }
        }
    }
    results.base_weight = results.total_weight - results.consumable_weight - results.worn_weight
    return results
}

export function format_elements_list(elements_list) {
    let organized = []
    let category_counter = 0
    if (elements_list[0].type !== 'category') {
        throw 'first item of backpack list is not a category! something is wrong'
    }
    for (let i = 0; i < elements_list.length; i++) {
        let element = elements_list[i]
        element.list_index = i
        if (element.type === 'category') {
            element.items = []
            element.category_index = category_counter
            element.total_weight = 0
            element.total_quantity = 0
            category_counter++
            organized.push(element)
        } else if (element.type === 'item') {
            organized[organized.length - 1].items.push(element)
            organized[organized.length - 1].total_weight += element.weight
            organized[organized.length - 1].total_quantity += element.quantity
        } else throw 'backpack list element is neither category nor item!'
    }
    return organized
}
