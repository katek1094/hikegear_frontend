export default {
    moveUp({commit, getters}, id) {
        commit('move', {
            id: id,
            organized: getters['organized_list'],
            direction: 'up'
        })
    },
    moveDown({commit, getters}, id) {
        commit('move', {
            id: id,
            organized: getters['organized_list'],
            direction: 'down'
        })
    },
    addItem({commit, getters}, id) {
        let organized = getters['organized_list']
        let index = organized.findIndex(el => el.id === id)
        let final_id = id + organized[index].items.length + 1
        commit('createEmptyItem', final_id)
    },
    addCategory({commit}) {
        commit('createEmptyCategory')
    },
    deleteCategory({commit, getters}, id) {
        let organized = getters['organized_list']
        let index = organized.findIndex(el => el.id === id)
        let items_amount = organized[index].items.length
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
                        commit('uploadData', data)
                    })
                }
                else console.log(response)
            })
    }
}