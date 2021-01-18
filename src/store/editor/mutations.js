export default {
    moving(state, payload) {
        let direction = payload.direction
        const number = (direction === 'up') ? -1 : 1
        let id = payload.id
        let raw_element = state.list[id]
        let organized_elements = payload.organized
        let categories = []
        for (let i = 0; i < state.list.length; i++) {
            if (state.list[i].type === 'category') {
                categories.push(i)
            }
        }
        if (raw_element.type === 'category') {
            let org_index = organized_elements.findIndex(element => element.id === id)
            let org_element = organized_elements[org_index]
            let category_index = categories.indexOf(id)
            if ((categories.length - 1 === category_index) && (number === 1)) {throw "can't move down while in the end!"}
            if ((category_index === 0) && (number === -1)) {throw "can't move up while on the top!"}
            let data = state.list.slice(id, id + org_element.items.length + 1)
            state.list.splice(id, org_element.items.length + 1)
            let splice_id
            if (number === -1) {
                splice_id  = categories[category_index + number]
            }
            else {
                if (category_index === categories.length - 2) {
                    splice_id = state.list.length
                }
                else {
                    splice_id  = categories[category_index + number + 1] - data.length
                }
            }
            state.list.splice(splice_id, 0, ...data)
        }
        else {
            if ((id === state.list.length - 1) && (number === 1)) {throw "can't move down while in the end!"}
            if ((id === 1) && (number === -1)) {throw "can't move up while on the top!"}
            state.list.splice(id, 1)
            state.list.splice(id + number, 0, raw_element)
        }
    }
}