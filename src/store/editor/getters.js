export default {
    backpacks(state) {
        return state.backpacks
    },
    are_any_changes(state) {
        if (state.static.name !== state.dynamic.name) return true
        if (state.static.description !== state.dynamic.description) return true
        if (state.dynamic.list === []) return false
        if (state.dynamic.list.length !== state.static.list.length) return true
        for (let c = 0; c < state.dynamic.list.length; c++) {
            if (state.dynamic.list[c].name !== state.static.list[c].name) return true
            if (state.dynamic.list[c].items.length !== state.static.list[c].items.length) return true
            for (let i = 0; i < state.dynamic.list[c].items.length; i++)
                for (const [key, value] of Object.entries(state.static.list[c].items[i])) {
                    if (value !== state.dynamic.list[c].items[i][key]) return true
                }
        }
        return false
    },
    isEditorDataReady(state) {
        return Boolean(state.dynamic.list)
    },
    backpack_name(state) {
        return state.dynamic.name
    },
    backpack_description(state) {
        return state.dynamic.description
    },
    backpack_id(state) {
        return state.dynamic.id
    },
    summary_data(state) {
        let categories = state.dynamic.list
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
    },
    new_item_id(state) {
        let ids = []
        for (const category of state.dynamic.list) {
            for (const item of category.items) ids.push(item.id)
        }
        for (const integer of [...Array(3000).keys()]) {
            if (!ids.includes(integer)) return integer
        }
        throw 'loop iterated 3000 times in searching for new, free id, something is wrong!'
    },
    new_category_id(state) {
        let ids = []
        for (const category of state.dynamic.list) ids.push(category.id)
        for (const integer of [...Array(1000).keys()]) {
            if (!ids.includes(integer)) return integer
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
    dynamic_backpack_data(state) {
        return state.dynamic
    },
    dynamic_list_copy(state) {
        return JSON.parse(JSON.stringify(state.dynamic.list))
    },
    dynamic_list(state) {
        return state.dynamic.list
    },
    dynamic_data(state) {
        return state.dynamic
    }
}
