export default {
    backpacks(state) {
        return state.backpacks
    },
    are_any_changes(state) {
        if (state.static.name !== state.dynamic.name) return true
        if (state.static.description !== state.dynamic.description) return true
        if (state.dynamic.list.length !== state.static.list.length) return true
        const len = (state.dynamic.list.length >= state.static.list.length) ? state.dynamic.list.length : state.static.list.length
        for (let i = 0; i < len; i++) {
            for (const [key, value] of Object.entries(state.static.list[i])) {
                if (value !== state.dynamic.list[i][key]) return true
            }
        }
        return false
    },
    isEditorDataReady(state) {
        return state.dynamic.list
    },
    pack_name(state) {
        return state.dynamic.name
    },
    backpack_id(state) {
        return state.dynamic.id
    },
    summary_data(state) {
        let results = {data: [], labels: [], total_weight: 0, consumable_weight: 0, worn_weight: 0}
        for (let i = 0; i < state.dynamic.list.length; i++) {
            let dt = state.dynamic.list[i]
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
    },
    organized_list: state => {
        let elements_list = JSON.parse(JSON.stringify(state.dynamic.list))
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
    },
    new_element_id(state) {
        let ids = []
        for (let i = 0; i < state.dynamic.list.length; i++) {
            ids.push(state.dynamic.list[i].id)
        }
        for (let i = 0; i < 1000 + ids.length; i++) {
            if (!ids.includes(i)) return i
        }
        throw 'loop iterated 1000 times in searching for new, free id, something is wrong!'
    },
    bodyBackpackData(state) {
        let data = {}
        data.name = state.dynamic.name
        data.description = state.dynamic.description
        data.list = state.dynamic.list
        return JSON.stringify(data)
    },
    dynamic_list(state) {
        return JSON.parse(JSON.stringify(state.dynamic.list))
    },
    static_list(state) {
        return JSON.parse(JSON.stringify(state.static.list))
    },
    dynamic_data(state) {
        return state.dynamic
    }


}