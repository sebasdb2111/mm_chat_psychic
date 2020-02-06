import Vue from 'vue';
import Vuex from 'vuex';
import { auth } from './auth.module';
import { psychic } from './psychic.module';
import { chatSession } from './chat-session.module';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: { auth, psychic, chatSession }
});
