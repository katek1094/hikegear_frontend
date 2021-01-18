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
            if (dt.type === 'category') {
                dt.items = []
                results.push(dt)
            }
            else {
                results[results.length - 1].items.push(dt)
            }
        }
        // TODO: add can move up&down
        return results
    }
}