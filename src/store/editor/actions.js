export default {
    moveCategory({commit}, data) {
        let result = []
        for (let i = 0; i < data.length; i++) {
            result.push({type: data[i].type, name: data[i].name, description: data[i].description})
            for (let n = 0; n < data[i].items.length; n++) {
                result.push(data[i].items[n])
            }
        }
        commit('moveCat', result)
    },
    moveItem({commit}, payload) {
        commit('setCategory', payload)
    },
    addItem({commit, getters}, id) {
        let organized = getters['organized_list']
        let index = organized.findIndex(el => el.id === id)
        let final_id = id + organized[index].items.length + 1
        commit('createEmptyItem', final_id)
    },
    deleteCategory({commit, getters}, id) {
        let index = getters['organized_list'].findIndex(el => el.id === id)
        let items_amount = getters['organized_list'][index].items.length
        commit('removeElements', {start: id, amount: items_amount + 1})
    },
    fetchData({commit, rootGetters}, id) {
        fetch(process.env.VUE_APP_API_URL + '/api/backpacks/' + id + '/', {
            method: 'GET',
            headers: {'Authorization': 'token ' + rootGetters['auth/token']}
        })
            .then(response => {
                if (response.ok) {
                    response.json().then(data => {
                        commit('loadData', data)
                    })
                } else console.log(response)
            })
    }
}