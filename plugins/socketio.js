import VueSocketIOExt from 'vue-socket.io-extended';
import io from 'socket.io-client';

const socket = io('http://localhost.com:1923');

Vue.use(VueSocketIOExt, socket);
