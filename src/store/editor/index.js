import mutations from "./mutations";
import actions from "./actions";
import getters from "./getters";

export default {
    namespaced: true,
    state() {
        return {
            id: 1,
            profile: {
                id: 1
            },
            created: '2020-09-17',
            list: [
                {
                    type: 'category',
                    name: 'spanie',
                    description: 'some text'
                },
                {
                    type: 'item',
                    name: 'śpiwór',
                    description: 'Lite Line 200',
                    weight: '510',
                    quantity: 1,
                    worn: false
                },
                {
                    type: 'item',
                    name: 'karimata',
                    description: 'Quechua m100',
                    weight: '200',
                    quantity: 1,
                    worn: false
                },
                {
                    type: 'category',
                    name: 'elektronika',
                    description: 'some text'
                },
                {
                    type: 'category',
                    name: 'gotowanie',
                    description: 'some text'
                },
                {
                    type: 'item',
                    name: 'kuchenka',
                    description: 'MSR Pocket Rocket 2',
                    weight: '74',
                    quantity: 1,
                    worn: false
                },
                {
                    type: 'item',
                    name: 'menażka',
                    description: 'decathlon 1l',
                    weight: '300',
                    quantity: 1,
                    worn: false
                },
                {
                    type: 'item',
                    name: 'spork',
                    description: 'decathlon',
                    weight: '5',
                    quantity: 1,
                    worn: false
                },
                {
                    type: 'category',
                    name: 'ubrania',
                    description: 'some text'
                },
                {
                    type: 'item',
                    name: 'koszulka',
                    description: 'decathlon poliester',
                    weight: '100',
                    quantity: 1,
                    worn: true
                },
                {
                    type: 'item',
                    name: 'skarpety',
                    description: 'merino',
                    weight: '50',
                    quantity: 3,
                    worn: true
                },
                {
                    type: 'item',
                    name: 'kurtka',
                    description: 'costabona',
                    weight: '120',
                    quantity: 3,
                    worn: false
                }
            ]
        }
    },
    mutations,
    getters,
    actions
}