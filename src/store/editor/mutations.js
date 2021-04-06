export default {
    set_dynamic_list(state, new_list) {
        state.dynamic.list = new_list
    },
    splice_dynamic_list(state, payload) {
        // it should receive a array of arguments which first two are 'start' and 'deleteCount' and next are new objects
        state.dynamic.list.splice(...payload)
    },
    set_dynamic_category_items(state, payload) {
        let category = state.dynamic.list.find(category => category.id === payload.category_id)
        category.items = payload.new_category_items
    },
    add_item_to_dynamic_category(state, payload) {
        let category = state.dynamic.list.find(category => category.id === payload.category_id)
        category.items.push(payload.new_item)
    },
    splice_dynamic_category_items(state, payload) {
        state.dynamic.list[payload.category_index].items.splice(...payload.splice_data)
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
    set_item_property(state, payload) {
        // payload = category_id, id, property, new_value
        const category = state.dynamic.list.find(category => category.id === payload.category_id)
        category.items.find(item => item.id === payload.id)[payload.property] = payload.new_value
    },
    set_category_name(state, payload) {
        state.dynamic.list.find(category => category.id === payload.category_id).name = payload.new_value
    },
    push_to_dynamic_list(state, new_element) {
        state.dynamic.list.push(new_element)
    },
    toggle_property(state, payload) {
        const category = state.dynamic.list.find(category => category.id === payload.category_id)
        const item = category.items.find(item => item.id === payload.id)
        item[payload.property] = !item[payload.property]
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
    },
    toggle_shared(state) {
        state.dynamic.shared = !state.dynamic.shared
    }
}
