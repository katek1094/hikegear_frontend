import {apiFetch} from "@/functions";

export default {
    namespaced: true,
    state() {
        return {
            static: {},
            dynamic: {}
        }
    },
    mutations: {
        copy_and_set_static(state, list) {
            state.static = JSON.parse(JSON.stringify(list))
        },
        copy_and_set_dynamic(state, list) {
            state.dynamic = JSON.parse(JSON.stringify(list))
        },
        set_dynamic(state, new_dynamic) {
            state.dynamic = new_dynamic
        },
        splice_dynamic(state, payload) {
            // it should receive a array of arguments which first two are 'start' and 'deleteCount' and next are new objects
            state.dynamic.splice(...payload)
        },
        set_dynamic_category_items(state, payload) {
            let category = state.dynamic.find(category => category.id === payload.category_id)
            category.items = payload.new_category_items
        },
        add_item_to_dynamic_category(state, payload) {
            let category = state.dynamic.find(category => category.id === payload.category_id)
            category.items.push(payload.new_item)
        },
        splice_dynamic_category_items(state, payload) {
            state.dynamic[payload.category_index].items.splice(...payload.splice_data)
        },
        push_to_dynamic(state, new_element) {
            state.dynamic.push(new_element)
        },
        set_item_property(state, payload) {
            // payload = category_id, id, property, new_value
            const category = state.dynamic.find(category => category.id === payload.category_id)
            category.items.find(item => item.id === payload.id)[payload.property] = payload.new_value
        },
        set_category_name(state, payload) {
            state.dynamic.find(category => category.id === payload.category_id).name = payload.new_value
        },
    },
    actions: {
        changeMyGear({commit}, new_list) {
            commit('set_dynamic', new_list)
        },
        moveItem({commit}, payload) {
            commit('set_dynamic_category_items', payload)
        },
        addNewCategory({commit, getters}) {
            commit('push_to_dynamic', {
                id: getters['new_category_id'],
                name: '',
                items: []
            })
        },
        addNewItem({commit, getters}, category_id) {
            const new_item = {
                id: getters['new_item_id'],
                name: '',
                description: '',
                weight: 0,
            }
            commit('add_item_to_dynamic_category', {category_id, new_item})
        },
        deleteCategory({commit, getters}, category_id) {
            const category_index = getters['dynamic_list'].findIndex(category => category.id === category_id)
            commit('splice_dynamic', [category_index, 1])
        },
        deleteItem({commit, getters}, payload) {
            const category = getters['dynamic_list'].find(category => category.id === payload.category_id)
            const category_index = getters['dynamic_list'].indexOf(category)
            const item_index = category.items.findIndex(item => item.id === payload.item_id)
            commit('splice_dynamic_category_items', {category_index, splice_data: [item_index, 1]})
        },
        changeCategoryName({commit}, payload) {
            commit('set_category_name', payload)
        },
        changeItemProperty({commit}, payload) {
            // payload = category_id, id, property, new_value
            commit('set_item_property', payload)
        },
        updateMyGear({commit, rootGetters}) {
            return apiFetch('private_gear', {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({private_gear: rootGetters['my_gear/dynamic_list']})
            })
                .then(response => {
                    if (response.ok) {
                        return response.json().then(data => {
                            commit('copy_and_set_static', data['private_gear'])
                            commit('copy_and_set_dynamic', data['private_gear'])
                            return 'success'
                        })
                    } else console.log(response)
                })
        },
        addCategory({commit}, category) {
            commit('push_to_dynamic', category)
        },

    },
    getters: {
        dynamic_list(state) {
            return state.dynamic
        },
        is_my_gear_data_ready(state) {
            return Boolean(state.dynamic)
        },
        are_any_changes: state => {
            if (state.dynamic.length !== state.static.length) return true
            for (let c = 0; c < state.dynamic.length; c++) {
                if (state.dynamic[c].items.length !== state.static[c].items.length) return true
                for (let i = 0; i < state.dynamic[c].items.length; i++) {
                    for (const [key, value] of Object.entries(state.static[c].items[i])) {
                        if (value !== state.dynamic[c].items[i][key]) return true
                    }
                }
            }
            return false
        },
        new_item_id: state => {
            let ids = []
            for (const category of state.dynamic) {
                for (const item of category.items) ids.push(item.id)
            }
            for (const integer of [...Array(3000).keys()]) {
                if (!ids.includes(integer)) return integer
            }
            throw 'loop iterated 3000 times in searching for new, free id, something is wrong!'
        },
        new_category_id(state) {
            let ids = []
            for (const category of state.dynamic) ids.push(category.id)
            for (const integer of [...Array(1000).keys()]) {
                if (!ids.includes(integer)) return integer
            }
            throw 'loop iterated 1000 times in searching for new, free id, something is wrong!'
        },

    }
}
