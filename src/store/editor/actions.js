export default {
    moveUp({commit, getters}, id) {
        commit('moving', {
            id: id,
            organized: getters['organized_list'],
            direction: 'up'
        })
    },
    moveDown({commit, getters}, id) {
        commit('moving', {
            id: id,
            organized: getters['organized_list'],
            direction: 'down'
        })
    },

}