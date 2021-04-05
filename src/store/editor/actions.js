import {apiFetch} from '@/functions'

export default {
    moveCategory({commit}, new_list) {
        commit('set_dynamic_list', new_list)
    },
    moveItem({commit}, payload) {
        commit('set_dynamic_category_items', payload)
    },
    addCategory({commit, getters}) {
        commit('push_to_dynamic_list', {
            id: getters['new_category_id'],
            name: '',
            items: []
        })
    },
    addItem({commit, getters}, category_id) {
        const new_item = {
            id: getters['new_item_id'],
            name: '',
            description: '',
            weight: 0,
            quantity: 1,
            consumable: false,
            worn: false
        }
        commit('add_item_to_dynamic_category', {category_id, new_item})
    },
    deleteCategory({commit, getters}, category_id) {
        const category_index = getters['dynamic_list'].findIndex(category => category.id === category_id)
        commit('splice_dynamic_list', [category_index, 1])
    },
    deleteItem({commit, getters}, payload) {
        const category = getters['dynamic_list'].find(category => category.id === payload.category_id)
        const category_index = getters['dynamic_list'].indexOf(category)
        const item_index = category.items.findIndex(item => item.id === payload.item_id)
        commit('splice_dynamic_category_items', {category_index, splice_data: [item_index, 1]})
    },
    renameBackpack({commit}, new_name) {
        commit('set_backpack_name', new_name)
    },
    changeBackpackDescription({commit}, new_description) {
        commit('set_backpack_description', new_description)
    },
    changeCategoryName({commit}, payload) {
        commit('set_category_name', payload)
    },
    changeItemProperty({commit}, payload) {
        // payload = category_id, id, property, new_value
        commit('set_item_property', payload)
    },
    switchConsumable({commit}, payload) {
        payload.property = 'consumable'
        commit('toggle_property', payload)
    },
    switchWorn({commit}, payload) {
        payload.property = 'worn'
        commit('toggle_property', payload)
    },
    switchPrivate({commit}) {
        commit('toggle_private')
    },
    updateBackpack({commit, rootGetters}, payload) {
        if (payload.update_dynamic) {
            commit('copy_and_set_dynamic_backpack', rootGetters['editor/dynamic_backpack_data'])
            commit('copy_and_set_static_backpack', rootGetters['editor/dynamic_backpack_data'])
        }
        return apiFetch('backpacks/' + rootGetters['editor/backpack_id'], {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: rootGetters['editor/bodyBackpackData']
        })
            .then(response => (response.ok) ? 'success' : 'failure')
    },
    addBackpack({commit}) {
        return apiFetch('backpacks', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: 'nowa lista sprzętu',
                description: '',
                list: [
                    {
                        name: '',
                        id: 0,
                        items: [

                            {
                                name: '',
                                description: '',
                                id: 0,
                                weight: 0,
                                quantity: 1,
                                worn: false,
                                consumable: false,
                            }
                        ]
                    }
                ]
            })
        })
            .then(response => {
                if (response.ok) {
                    response.json().then(data => {
                        commit('copy_and_set_dynamic_backpack', data)
                        commit('copy_and_set_static_backpack', data)
                        commit('add_backpack', data)
                    })
                }
            })
    },
    addImportedBackpack({commit}, backpack) {
        commit('copy_and_set_dynamic_backpack', backpack)
        commit('copy_and_set_static_backpack', backpack)
        commit('add_backpack', backpack)
    },
    deleteBackpack({commit, rootGetters}, backpack_id) {
        let backpacks = rootGetters['editor/backpacks']
        let index
        for (let i = 0; i < backpacks.length; i++) {
            if (backpacks[i].id === backpack_id) index = i
        }
        backpacks.splice(index, 1)
        commit('set_backpacks', backpacks)
        if (backpacks.length > 0) {
            commit('copy_and_set_dynamic_backpack', backpacks[0])
            commit('copy_and_set_static_backpack', backpacks[0])
        } else {
            commit('copy_and_set_dynamic_backpack', [])
            commit('copy_and_set_static_backpack', [])
        }
        apiFetch('backpacks/' + backpack_id, {
            method: 'DELETE'
        })
    },
    changeBackpack({commit, getters}, index) {
        commit('copy_and_set_dynamic_backpack', getters['backpacks'][index])
        commit('copy_and_set_static_backpack', getters['backpacks'][index])
    },
    getInitialData({commit}) {
        return apiFetch('initial', {
            method: 'GET'
        }, [403])
            .then(response => {
                if (response.ok) {
                    return response.json().then(data => {
                        if (data.backpacks.length > 0) {
                            commit('copy_and_set_dynamic_backpack', data.backpacks[0])
                            commit('copy_and_set_static_backpack', data.backpacks[0])
                            commit('set_backpacks', data.backpacks)
                        } else {
                            commit('copy_and_set_dynamic_backpack', [])
                            commit('copy_and_set_static_backpack', [])
                            commit('set_backpacks', [])
                        }
                        if (data['private_gear'].length === 0) {
                            data['private_gear'] = [{name: "", description: '', id: 0, items: []}]
                        }
                        commit('my_gear/copy_and_set_static', data['private_gear'], {root: true})
                        commit('my_gear/copy_and_set_dynamic', data['private_gear'], {root: true})
                        return response
                    })
                } else if (response.status === 403) return response // 403
            })
    }
}
