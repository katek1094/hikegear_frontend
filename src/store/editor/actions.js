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
    }
}