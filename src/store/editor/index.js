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
                    quantity: 1
                },
                {
                    type: 'item',
                    name: 'karimata',
                    description: 'Quechua m100',
                    weight: '200',
                    quantity: 1
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
                    quantity: 1
                },
                {
                    type: 'item',
                    name: 'menażka',
                    description: 'MSR Pocket Rocket 2',
                    weight: '74',
                    quantity: 1
                },
{
                    type: 'item',
                    name: 'spork',
                    description: 'MSR Pocket Rocket 2',
                    weight: '74',
                    quantity: 1
                },

            ]
        }
    },
    mutations,
    getters,
    actions
}