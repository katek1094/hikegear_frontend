export default {
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
        for (let i = 0; i < results.length; i++) {
            if (results[i].items.length !== 0) {
                results[i].items[0].cant_move_up = true
                break
            }
        }
        results[results.length - 1].cant_move_down = true
        for (let i = results.length - 1; i >= 0; i--) {
            if (results[i].items.length !== 0) {
                results[i].items[results[i].items.length - 1].cant_move_down = true
                break
            }
        }
        return results
    }
}