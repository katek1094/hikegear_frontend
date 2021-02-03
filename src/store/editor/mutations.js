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
    remove_elements(state, payload) {
        state.dynamic.list.splice(payload.start, payload.amount)
    },
    set_element_property(state, payload) {
        // payload = type, id, property, new_value
        if (state.dynamic.list[payload.id].type === payload.type) {
            state.dynamic.list[payload.id][payload.property] = payload.new_value
        } else throw "You are trying to change a property of the element of different type than declared!"
    },
    add_backpack(state, backpack) {
        state.backpacks.unshift(backpack)
    },
    push_to_dynamic_list(state, new_element) {
        state.dynamic.list.push(new_element)
    },
    toggle_consumable(state, id) {
        state.dynamic.list[id].consumable = !state.dynamic.list[id].consumable
    },
    toggle_worn(state, id) {
        state.dynamic.list[id].worn = !state.dynamic.list[id].worn
    },
    set_backpacks(state, backpacks) {
        state.backpacks = backpacks
    },


}