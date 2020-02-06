import AuthService from '../servicies/auth-request.js';

const psychicToken = localStorage.getItem('psychicToken');
const initialState = psychicToken
    ? { loggedIn: true, psychicToken }
    : { loggedIn: false, psychicToken: null };

export const auth = {
    namespaced: true,
    state: initialState,
    actions: {
        login({ commit }, psychicToken) {
            return AuthService.loginPsychic(psychicToken).then(
                psychicToken => {
                    commit('loginSuccess', psychicToken);
                    return psychicToken;
                },
                error => {
                    commit('loginFailure');
                    return error;
                }
            );
        },
        logout({ commit }) {
            AuthService.logoutPsychic();
            commit('logout');
        }
    },
    mutations: {
        loginSuccess(state, psychicToken) {
            state.loggedIn = true;
            state.psychicToken = psychicToken;
        },
        loginFailure(state) {
            state.loggedIn = false;
            state.psychicToken = null;
        },
        logout(state) {
            state.loggedIn = false;
            state.psychicToken = null;
        }
    },
    getters: {
        psychic: state => {
            return state.psychicToken;
        },
        loggedIn: state => {
            return state.loggedIn;
        }
    }
};
