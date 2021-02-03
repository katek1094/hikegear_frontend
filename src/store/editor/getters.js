export default {
    backpacks(state) {
      return state.backpacks
    },
    are_any_changes(state) {
        let dyn = state.dynamic
        let st = state.static
        if (st.name !== dyn.name) {
            return true
        }
        if (st.description !== dyn.description) {
            return true
        }
        if (dyn.list.length !== st.list.length) {
            return true
        }
        const len = (dyn.list.length >= st.list.length) ? dyn.list.length : st.list.length
        for (let i = 0; i < len; i++) {
            for (const [key, value] of Object.entries(st.list[i])) {
                if (value !== dyn.list[i][key]) {
                    return true
                }
            }
        }
        return false
    },
    isEditorDataReady(state) {
        return state.static.list
    },
    pack_name(state) {
        return state.dynamic.name
    },
    pack_id(state) {
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
        let list = JSON.parse(JSON.stringify(state.dynamic.list))
        let results = []
        let cat_unique = 0
        if (list[0].type !== 'category') {
            throw 'first item of backpack list is not a category! something is wrong'
        }
        for (let i = 0; i < list.length; i++) {
            let dt = list[i]
            dt.id = i
            if (dt.type === 'category') {
                dt.items = []
                dt.unique_id = cat_unique
                dt.total_weight = 0
                dt.total_quantity = 0
                cat_unique++
                results.push(dt)
            } else {
                results[results.length - 1].items.push(dt)
                results[results.length - 1].total_weight += dt.weight
                results[results.length - 1].total_quantity += dt.quantity
            }
        }
        return results
    },
    patchData(state) {
        let data = {}
        if (state.dynamic.name !== state.static.name) {
            data.name = state.dynamic.name
        }
        if (state.dynamic.description !== state.static.description) {
            data.description = state.dynamic.description
        }
        if (state.dynamic.list !== state.static.list) {
            data.list = state.dynamic.list
        }
        return JSON.stringify(data)
    }

}