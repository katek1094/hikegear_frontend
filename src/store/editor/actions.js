export default {
    moveCategory({commit}, new_organized_list) {
        let new_list = []
        // this loop transforms organized list into raw list
        for (let i = 0; i < new_organized_list.length; i++) {
            new_list.push({
                type: new_organized_list[i].type,
                name: new_organized_list[i].name,
                description: new_organized_list[i].description
            })
            for (let n = 0; n < new_organized_list[i].items.length; n++) {
                new_list.push(new_organized_list[i].items[n])
                delete new_list[new_list.length - 1].id
            }
        }
        commit('set_dynamic_list', new_list)
    },
    moveItem({commit, getters}, payload) {
        let id, next_id
        let founded = false
        let unique_cat = 0
        const dynamic_list = getters['dynamic_list']
        for (let i = 0; i < dynamic_list.length; i++) {
            if ((founded) && (dynamic_list[i].type === 'category')) {
                next_id = dynamic_list.indexOf(dynamic_list[i])
                break
            }
            if (dynamic_list[i].type === 'category') {
                if (unique_cat === payload.category_unique_id) {
                    id = dynamic_list.indexOf(dynamic_list[i])
                    founded = true
                } else unique_cat++
            }
        }
        if (next_id === undefined) {
            next_id = dynamic_list.length
        }
        commit('splice_dynamic_list', [id + 1, next_id - id - 1, ...payload.new_category])
    },
    addItem({commit, getters}, category_id) {
        const organized = getters['organized_list']
        const index = organized.findIndex(el => el.id === category_id)
        const final_id = category_id + organized[index].items.length + 1
        const new_item = {
            name: '',
            type: 'item',
            description: '',
            weight: 0,
            quantity: 1,
            worn: false
        }
        commit('splice_dynamic_list', [final_id, 0, new_item])
    },
    deleteCategory({commit, getters}, id) {
        const index = getters['organized_list'].findIndex(el => el.id === id)
        const items_amount = getters['organized_list'][index].items.length
        commit('remove_elements', {start: id, amount: items_amount + 1})
    },
    renamePack({commit}, new_name) {
        commit('set_backpack_name', new_name)
    },
    createEmptyCategory({commit}) {
        commit('push_to_dynamic_list', {
            type: 'category',
            name: '',
            description: ''
        })
    },
    changeElementProperty({commit}, payload) {
        // payload = type, id, property, new_value
        commit('set_element_property', payload)
    },
    switchConsumable({commit}, id) {
        commit('toggle_consumable', id)
    },
    switchWorn({commit}, id) {
        commit('toggle_worn', id)
    },
    deleteItem({commit}, id) {
        commit('splice_dynamic_list', [id, 1])
    },
    updateBackpack({commit, rootGetters}) {
        fetch(process.env.VUE_APP_API_URL + '/api/backpacks/' + rootGetters['editor/pack_id'] + '/', {
            method: 'PATCH',
            headers: {
                'Authorization': 'token ' + rootGetters['auth/token'],
                'Content-Type': 'application/json'
            },
            body: rootGetters['editor/patchData']

        })
            .then(response => {
                if (response.ok) {
                    response.json().then(data => {
                        commit('copy_and_set_dynamic_backpack', data)
                        commit('copy_and_set_static_backpack', data)
                    })
                } else console.log(response)
            })
    },
    loadInitialBackpacks({commit}, backpacks) {
        commit('set_backpacks', backpacks)
        let latest = backpacks[0].updated
        let choice = backpacks[0].id
        for (let i = 0; i < backpacks.length; i++) {
            if (latest > backpacks[i].updated) {
                latest = backpacks[i].updated
                choice = backpacks[i].id
            }
        }
        for (let i = 0; i < backpacks.length; i++) {
            if (backpacks[i].id === choice) {
                commit('copy_and_set_dynamic_backpack', backpacks[i])
                commit('copy_and_set_static_backpack', backpacks[i])
            }
        }
    },
    addBackpack({commit, rootGetters}) {
        commit('add_backpack', {
            name: 'nowy plecak',
            profile: {
                id: rootGetters['auth/id']
            },
            created: '',
            updated: '',
            list: [
                {
                    type: 'category',
                    name: '',
                    description: ''
                },
                {
                    type: 'item',
                    name: '',
                    description: '',
                    weight: 0,
                    quantity: 0,
                    worn: false,
                    consumable: false,
                },
            ]
        })
    },
    changeBackpack({commit, getters}, index) {
        commit('copy_and_set_dynamic_backpack', getters['backpacks'][index])
        commit('copy_and_set_static_backpack', getters['backpacks'][index])

    }


}