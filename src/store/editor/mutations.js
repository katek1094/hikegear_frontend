export default {
    moveCat(state, payload) {
        state.dynamic.list = payload
    },
    setCategory(state, payload) {
        let id, next_id
        let founded = false
        let unique_cat = 0
        for (let i = 0; i < state.dynamic.list.length; i++) {
            if ((founded) && (state.dynamic.list[i].type === 'category')) {
                next_id = state.dynamic.list.indexOf(state.dynamic.list[i])
                break
            }
            if (state.dynamic.list[i].type === 'category') {
                if (unique_cat === payload.category_unique_id) {
                    id = state.dynamic.list.indexOf(state.dynamic.list[i])
                    founded = true
                } else unique_cat++
            }
        }
        if (next_id === undefined) {
            next_id = state.dynamic.list.length
        }
        state.dynamic.list.splice(id + 1, next_id - id - 1, ...payload.new_category)
    },
    loadData(state, data) {
        state.static = JSON.parse(JSON.stringify(data))
        state.dynamic = JSON.parse(JSON.stringify(data))
    },
    changeItemQuantity(state, payload) {
        state.dynamic.list[payload.id].quantity = payload.quantity
    },
    renamePack(state, name) {
        state.dynamic.name = name
    },
    removeElements(state, payload) {
        state.dynamic.list.splice(payload.start, payload.amount)
    },
    deleteItem(state, id) {
        state.dynamic.list.splice(id, 1)
    },
    changeItemWeight(state, payload) {
        state.dynamic.list[payload.id].weight = payload.weight
    },
    changeItemDescription(state, payload) {
        state.dynamic.list[payload.id].description = payload.description
    },
    renameItem(state, payload) {
        state.dynamic.list[payload.id].name = payload.name
    },
    renameCategory(state, payload) {
        state.dynamic.list[payload.id].name = payload.name
    },
    createEmptyCategory(state) {
        state.dynamic.list.push({
            type: 'category',
            name: '',
            description: ''
        })
    },
    createEmptyItem(state, id) {
        let new_item = {
            name: '',
            type: 'item',
            description: '',
            weight: 0,
            quantity: 1,
            worn: false
        }
        state.dynamic.list.splice(id, 0, new_item)
    },
    markAsWorn(state, id) {
        state.dynamic.list[id].worn = !state.dynamic.list[id].worn
    },
    markAsConsumable(state, id) {
        state.dynamic.list[id].consumable = !state.dynamic.list[id].consumable
    }
}