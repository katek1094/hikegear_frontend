export default {
    moveCat(state, payload) {
        state.dynamic.list = payload
    },
    setCategory(state, payload) {
        let id
        let next_id
        let founded = false
        for (let i = 0; i < state.dynamic.list.length; i++) {
            if ((founded) && (state.dynamic.list[i].type === 'category')) {
                next_id = state.dynamic.list.indexOf(state.dynamic.list[i])
                break
            }
            if (state.dynamic.list[i].unique_id === payload.category_unique_id) {
                id = state.dynamic.list.indexOf(state.dynamic.list[i])
                founded = true
            }
        }
        if (next_id === undefined) {
            next_id = state.dynamic.list.length
        }
        state.dynamic.list.splice(id + 1, next_id - id - 1, ...payload.new_category)
        // console.log(payload.new_category)
        // console.log(id)
        // console.log(next_id)
        // console.log(state.dynamic.list)
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
            weight: '0',
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
    },
    move(state, payload) {
        let direction = payload.direction
        const number = (direction === 'up') ? -1 : 1
        let id = payload.id
        let raw_element = state.dynamic.list[id]
        let organized_elements = payload.organized
        let categories = []
        for (let i = 0; i < state.dynamic.list.length; i++) {
            if (state.dynamic.list[i].type === 'category') {
                categories.push(i)
            }
        }
        if (raw_element.type === 'category') {
            let org_index = organized_elements.findIndex(element => element.id === id)
            let org_element = organized_elements[org_index]
            let category_index = categories.indexOf(id)
            if ((categories.length - 1 === category_index) && (number === 1)) {
                throw "can't move down while in the end!"
            }
            if ((category_index === 0) && (number === -1)) {
                throw "can't move up while on the top!"
            }
            let data = state.dynamic.list.slice(id, id + org_element.items.length + 1)
            state.dynamic.list.splice(id, org_element.items.length + 1)
            let splice_id
            if (number === -1) {
                splice_id = categories[category_index + number]
            } else {
                if (category_index === categories.length - 2) {
                    splice_id = state.dynamic.list.length
                } else {
                    splice_id = categories[category_index + number + 1] - data.length
                }
            }
            state.dynamic.list.splice(splice_id, 0, ...data)
        } else {
            if ((id === state.dynamic.list.length - 1) && (number === 1)) {
                throw "can't move down while in the end!"
            }
            if ((id === 1) && (number === -1)) {
                throw "can't move up while on the top!"
            }
            state.dynamic.list.splice(id, 1)
            state.dynamic.list.splice(id + number, 0, raw_element)
        }
    }
}