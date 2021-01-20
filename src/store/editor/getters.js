export default {
    pack_name(state) {
      return state.name
    },
    summary_data(state) {
        let results = {data: [], labels: [], total_weight: 0, consumable_weight: 0, worn_weight: 0}
        for (let i = 0; i < state.list.length; i++) {
            let dt = state.list[i]
            if (dt.type === 'category') {
                results.data.push(0)
                results.labels.push(dt.name)
            }
            else {
                results.data[results.data.length - 1] += (dt.weight * dt.quantity)
                results.total_weight += (dt.weight * dt.quantity)
                if (dt.consumable) {results.consumable_weight += (dt.weight * dt.quantity)}
                if (dt.worn) {results.worn_weight += dt.weight}
            }
        }
        results.base_weight = results.total_weight - results.consumable_weight - results.worn_weight
        return results
    },
    organized_list: state => {
        let list = state.list
        let results = []
        if (list[0].type !== 'category') {
            throw 'first item of backpack list is not a category! something is wrong'
        }
        for (let i = 0; i < list.length; i++) {
            let dt = list[i]
            dt.id = i
            dt.cant_move_up = false
            dt.cant_move_down = false
            if (dt.type === 'category') {
                dt.items = []
                results.push(dt)
            }
            else {
                results[results.length - 1].items.push(dt)
            }
        }
        results[0].cant_move_up = true
        if (results[0].items.length !== 0) {
            results[0].items[0].cant_move_up = true
        }
        results[results.length - 1].cant_move_down = true
        if (results[results.length - 1].items.length !== 0) {
            results[results.length - 1].items[results[results.length - 1].items.length - 1].cant_move_down = true
        }
        return results
    }
}