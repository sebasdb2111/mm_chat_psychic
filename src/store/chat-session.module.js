import ChatSessionService from '../servicies/chat-session-request';

export const chatSession = {
    namespaced: true,
    state: {
        chatSessionData: null,
        chatSessionList: null,
        conversation: null,
    },
    actions: {
        chatSessions({ commit }) {
            return ChatSessionService.chatSessionList().then(
                chatSessions => {
                    commit('chatSessions', chatSessions);
                    return chatSessions;
                },
                error => {
                    commit('chatSessionsEmpty');
                    return error;
                }
            );
        },
        getConversation({ commit }, chatSessionId) {
            return ChatSessionService.getConversation(chatSessionId).then(
                conversation => {
                    commit('getConversation', conversation);
                    return conversation;
                },
                error => {
                    commit('conversationWithoutMessages');
                    return error;
                }
            );
        },
        sendMessage({ commit }, messageData) {
            return ChatSessionService.sendMessage(messageData).then(
                message => {
                    commit('sendMessage', message);
                    return message;
                },
                error => {
                    commit('sendMessageFailure');
                    return error;
                }
            );
        }
    },
    mutations: {
        chatSessions(state, chatSessions) {
            state.chatSessionList = chatSessions;
        },
        chatSessionsEmpty(state) {
            state.chatSessionList = null;
        },
        getConversation(state, conversation) {
            state.conversation = conversation;
        },
        conversationWithoutMessages(state) {
            state.conversation = null;
        },
        sendMessage(state, message) {
            state.lastMessage = message;
        },
        sendMessageFailure(state) {
            state.lastMessage = null;
        }
    },
    getters: {
        chatSessionList: state => {
            return state.chatSessionList;
        },
        conversation: state => {
            return state.conversation;
        }
    }
};
