export default {
    set_dynamic_list(state, new_list) {
        state.dynamic.list = new_list
    },
    splice_dynamic_list(state, payload) {
        // it should receive a array of arguments which first two are 'start' and 'deleteCount' and next are new objects
        state.dynamic.list.splice(...payload)
    },
    copy_and_set_static_backpack(state, backpack) {
        state.static = JSON.parse(JSON.stringify(backpack))
    },
    copy_and_set_dynamic_backpack(state, backpack) {
        state.dynamic = JSON.parse(JSON.stringify(backpack))
    },
    set_backpack_name(state, new_name) {
        state.dynamic.name = new_name
    },
    set_backpack_description(state, new_description) {
        state.dynamic.description = new_description
    },
    remove_elements(state, payload) {
        state.dynamic.list.splice(payload.start, payload.amount)
    },
    set_element_property(state, payload) {
        // payload = type, list_index, property, new_value
        if (state.dynamic.list[payload.list_index].type === payload.type) {
            state.dynamic.list[payload.list_index][payload.property] = payload.new_value
        } else throw "You are trying to change a property of the element of different type than declared!"
    },
    push_to_dynamic_list(state, new_element) {
        state.dynamic.list.push(new_element)
    },
    toggle_consumable(state, list_index) {
        state.dynamic.list[list_index].consumable = !state.dynamic.list[list_index].consumable
    },
    toggle_worn(state, list_index) {
        state.dynamic.list[list_index].worn = !state.dynamic.list[list_index].worn
    },
    set_backpacks(state, backpacks) {
        state.backpacks = backpacks
    },
    add_backpack(state, backpack) {
        state.backpacks.unshift(backpack)
    },
    update_backpack(state, payload) {
        for (let i = 0; i < state.backpacks.length; i++) {
            if (state.backpacks[i].id === payload.id) {
                state.backpacks[i] = payload.data
            }
        }
    }


}
