import PsychicService from '../servicies/psychic-request';

export const psychic = {
    namespaced: true,
    state: {psychicDetails: null},
    actions: {
        currentPsychic({ commit }) {
            return PsychicService.getCurrentPsychic().then(
                psychic => {
                    commit('current', psychic);
                    return psychic;
                },
                error => {
                    commit('currentPsychicFailure');
                    return error;
                }
            );
        }
    },
    mutations: {
        current(state, psychic) {
            state.psychicDetails = psychic;
        },
        currentPsychicFailure(state) {
            state.psychicDetails = null;
        }
    },
    getters: {
        psychicData: state => {
            return state.psychicDetails;
        }
    }
};
