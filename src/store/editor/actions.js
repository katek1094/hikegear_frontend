function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


export default {
    moveCategory({commit}, new_organized_list) {
        let new_list = []
        // this loop transforms organized list into raw list
        for (let i = 0; i < new_organized_list.length; i++) {
            new_list.push({
                type: new_organized_list[i].type,
                name: new_organized_list[i].name,
                description: new_organized_list[i].description,
                id: new_organized_list[i].id
            })
            for (let n = 0; n < new_organized_list[i].items.length; n++) {
                new_list.push(new_organized_list[i].items[n])
                delete new_list[new_list.length - 1].list_index
            }
        }
        commit('set_dynamic_list', new_list)
    },
    moveItem({commit, getters}, payload) {
        let index, next_index
        let founded = false
        let unique_cat = 0
        const dynamic_list = getters['dynamic_list']
        for (let i = 0; i < dynamic_list.length; i++) {
            if ((founded) && (dynamic_list[i].type === 'category')) {
                next_index = dynamic_list.indexOf(dynamic_list[i])
                break
            }
            if (dynamic_list[i].type === 'category') {
                if (unique_cat === payload.category_index) {
                    index = dynamic_list.indexOf(dynamic_list[i])
                    founded = true
                } else unique_cat++
            }
        }
        if (next_index === undefined) {
            next_index = dynamic_list.length
        }
        commit('splice_dynamic_list', [index + 1, next_index - index - 1, ...payload.new_category])
    },
    addCategory({commit, getters}) {
        commit('push_to_dynamic_list', {
            id: getters['new_element_id'],
            type: 'category',
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
            type: 'item',
            description: '',
            weight: 0,
            quantity: 1,
            worn: false
        }
        commit('splice_dynamic_list', [final_list_index, 0, new_item])
    },
    deleteCategory({commit, getters}, list_index) {
        const index = getters['organized_list'].findIndex(el => el.list_index === list_index)
        const items_amount = getters['organized_list'][index].items.length
        commit('remove_elements', {start: list_index, amount: items_amount + 1})
    },
    deleteItem({commit}, list_index) {
        commit('splice_dynamic_list', [list_index, 1])
    },
    renamePack({commit}, new_name) {
        commit('set_backpack_name', new_name)
    },
    changeElementProperty({commit}, payload) {
        // payload = type, list_index, property, new_value
        commit('set_element_property', payload)
    },
    switchConsumable({commit}, list_index) {
        commit('toggle_consumable', list_index)
    },
    switchWorn({commit}, list_index) {
        commit('toggle_worn', list_index)
    },
    discardChanges({commit, getters}) {
        commit('set_dynamic_list', getters['static_list'])
    },
    updateBackpack({commit, rootGetters}) {
        fetch(process.env.VUE_APP_API_URL + '/api/backpacks/' + rootGetters['editor/backpack_id'] + '/', {
            method: 'PATCH',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'Content-Type': 'application/json'
            },
            body: rootGetters['editor/bodyBackpackData']
        })
            .then(response => {
                if (response.ok) {
                    response.json().then(data => {
                        commit('copy_and_set_dynamic_backpack', data)
                        commit('copy_and_set_static_backpack', data)
                        commit('update_backpack', {data: data, id: rootGetters['editor/backpack_id']})
                    })
                } else {
                    console.log(response)
                }
            })
    },
    addBackpack({commit}) {
        fetch(process.env.VUE_APP_API_URL + '/api/backpacks/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'nowy plecak',
                description: '',
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
                        quantity: 1,
                        worn: false,
                        consumable: false,
                    },
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
                } else console.log(response)
            })
    },
    deleteBackpack({commit, rootGetters}, backpack_id) {
        return fetch(process.env.VUE_APP_API_URL + '/api/backpacks/' + backpack_id, {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
            },
        })
            .then(response => {
                if (response.ok) {
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
                } else console.log(response)
            })
    },
    changeBackpack({commit, getters}, index) {
        commit('copy_and_set_dynamic_backpack', getters['backpacks'][index])
        commit('copy_and_set_static_backpack', getters['backpacks'][index])
    },
    getInitialData({commit}) {
        return fetch(process.env.VUE_APP_API_URL + '/api/initial', {
            method: 'GET',
            headers: {'X-CSRFToken': getCookie('csrftoken')}
        })
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
                        return 'data_downloaded'
                    })
                } else {
                    if (response.status === 401) {
                        return 'not logged in'
                    }
                    console.log(response)
                }
            })
    }
}