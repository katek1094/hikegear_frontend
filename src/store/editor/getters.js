export default {
    summary_data(state) {
        let list = state.list
        let data = []
        let labels = []
        let total_weight = 0
        let consumable_weight = 0
        let worn_weight = 0
        for (let i = 0; i < list.length; i++) {
            let dt = list[i]
            if (dt.type === 'category') {
                data.push(0)
                labels.push(dt.name)
            }
            else {
                data[data.length - 1] += parseInt(dt.weight)
                total_weight += parseInt(dt.weight)
                if (dt.consumable) {consumable_weight += parseInt(dt.weight)}
                if (dt.worn) {worn_weight += parseInt(dt.weight)}
            }
        }
        return {
            data,
            labels,
            total_weight,
            consumable_weight,
            worn_weight,
            base_weight: total_weight - consumable_weight - worn_weight
        }
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