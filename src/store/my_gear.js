import {apiFetch} from "@/store/functions";

export default {
    namespaced: true,
    state() {
        return {
            static: {},
            dynamic: {}
            /*
            data structure
            static and dynamic are list [] of elements
            elements are items or categories
            item = {
                is_item: true,
                name: '',
                description: '',
                weight: '',
                id: undefined
            }
            category: {
                is_item: false',
                name: '',
                id: undefined
            }
             */
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
        push_to_dynamic(state, new_element) {
            state.dynamic.push(new_element)
        },
        remove_elements(state, payload) {
            state.dynamic.splice(payload.start, payload.amount)
        },
        set_element_property(state, payload) {
            // payload = id_item, list_index, property, new_value
            if (state.dynamic[payload.list_index].is_item === payload.is_item) {
                state.dynamic[payload.list_index][payload.property] = payload.new_value
            } else throw "You are trying to change a property of the element of different type than declared!"
        },

    },
    actions: {
        changeMyGear({commit}, new_data) {
            commit('set_dynamic', new_data)
        },
        moveCategory({commit}, new_organized_list) {
            let new_list = []
            // this loop transforms organized list into raw list
            for (let i = 0; i < new_organized_list.length; i++) {
                new_list.push({
                    is_item: new_organized_list[i].is_item,
                    name: new_organized_list[i].name,
                    id: new_organized_list[i].id
                })
                for (let n = 0; n < new_organized_list[i].items.length; n++) {
                    new_list.push(new_organized_list[i].items[n])
                    delete new_list[new_list.length - 1].list_index
                }
            }
            commit('set_dynamic', new_list)
        },
        moveItem({commit, getters}, payload) {
            let index, next_index
            let founded = false
            let unique_cat = 0
            const dynamic_list = getters['dynamic_list']
            for (let i = 0; i < dynamic_list.length; i++) {
                if ((founded) && (dynamic_list[i].is_item === false)) {
                    next_index = dynamic_list.indexOf(dynamic_list[i])
                    break
                }
                if (dynamic_list[i].is_item === false) {
                    if (unique_cat === payload.category_index) {
                        index = dynamic_list.indexOf(dynamic_list[i])
                        founded = true
                    } else unique_cat++
                }
            }
            if (next_index === undefined) next_index = dynamic_list.length
            commit('splice_dynamic', [index + 1, next_index - index - 1, ...payload.new_category])
        },
        addCategory({commit, getters}) {
            commit('push_to_dynamic', {
                id: getters['new_element_id'],
                is_item: false,
                name: '',
                description: ''
            })
        },
        addItem({commit, getters}, category_list_index) {
            const organized = getters['organized_list']
            const index = organized.findIndex(el => el.list_index === category_list_index)
            const final_list_index = category_list_index + organized[index].items.length + 1
            const new_item = {
                id: getters['new_element_id'],
                name: '',
                is_item: true,
                description: '',
                weight: 0,
            }
            commit('splice_dynamic', [final_list_index, 0, new_item])
        },
        deleteCategory({commit, getters}, list_index) {
            const index = getters['organized_list'].findIndex(el => el.list_index === list_index)
            const items_amount = getters['organized_list'][index].items.length
            commit('remove_elements', {start: list_index, amount: items_amount + 1})
        },
        deleteItem({commit}, list_index) {
            commit('splice_dynamic', [list_index, 1])
        },
        changeElementProperty({commit}, payload) {
            // payload = is_item, list_index, property, new_value
            commit('set_element_property', payload)
        },
        updateMyGear({commit, rootGetters}) {
            return apiFetch('private_gear', {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({private_gear: rootGetters['my_gear/dynamic_list']})
            })
                .then(response => {
                    if (response.ok) {
                        response.json().then(data => {
                            commit('copy_and_set_static', data['private_gear'])
                            commit('copy_and_set_dynamic', data['private_gear'])
                        })
                    } else console.log(response)
                })
        }
    },
    getters: {
        dynamic_list: state => state.dynamic,
        is_my_gear_data_ready: state => Boolean(state.dynamic),
        are_any_changes: state => {
            if (state.dynamic.length !== state.static.length) return true
            for (let i = 0; i < state.dynamic.length; i++) {
                for (const [key, value] of Object.entries(state.static[i])) {
                    if (value !== state.dynamic[i][key]) return true
                }
            }
            return false
        },
        organized_list: state => {
            const elements_list = JSON.parse(JSON.stringify(state.dynamic))
            let organized = []
            let category_counter = 0
            if (elements_list[0].is_item) throw 'first item of my_gear_list is not a category! something is wrong'
            for (let i = 0; i < elements_list.length; i++) {
                let element = elements_list[i]
                element.list_index = i
                if (!element.is_item) {
                    element.items = []
                    element.category_index = category_counter
                    category_counter++
                    organized.push(element)
                } else organized[organized.length - 1].items.push(element)
            }
            return organized
        },
        new_element_id: state => {
            let ids = []
            for (const elements of state.dynamic) ids.push(elements.id)
            for (const integer of [...Array(1000).keys()]) {
                if (!ids.includes(integer)) return integer
            }
            throw 'loop iterated 1000 times in searching for new, free id, something is wrong!'
        },

    }
}
