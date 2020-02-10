<template>
  <q-page class="flex">
    <q-list
      class="full-width"
      separator>
      <q-item-label header>Active Chats</q-item-label>
      <q-item
        v-for="(chatSession, key) in chats"
        :key="key"
        :to="'/chat/' + chatSession.id"
        clickable
        v-ripple>
        <q-item-section avatar>
          <q-avatar color="teal" text-color="white">
            {{ chatSession.owner.firstName.charAt(0) }}
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ chatSession.owner.firstName }} {{ chatSession.owner.lastName }}</q-item-label>
          <q-item-label caption lines="2">Created at: {{ convertIsoFormatWithHourAndMinutes(chatSession.createdAt) }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <p>{{ chatSession.psychic.status ? 'online' : 'offline' }}</p>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex'
  import {convertIsoFormatWithHourAndMinutes} from '../servicies/date-utils'

  export default {
    async created() {
      await this.chatSessions();
      await this.activeChats();

      const chats = await this.chatSessionList();

      this.$socket.client.on('customer_online', customer => {
        let chat = chats.data.findIndex(el => el.owner.id === customer.id);
        chats.data[chat].owner.status = true;
      });

      this.$socket.client.on('customer_offline', customer => {
        let chat = chats.data.findIndex(el => el.owner.id === customer.id);
        chats.data[chat].owner.status = false;
      })
    },
    data() {
      return {
        chats: []
      }
    },
    methods: {
      ...mapActions('chatSession', ['chatSessions']),
      ...mapGetters('chatSession', ['chatSessionList']),
      async activeChats() {
        const chats = await this.chatSessionList();
        this.chats = chats.data;
      },
      convertIsoFormatWithHourAndMinutes(date) {
        return convertIsoFormatWithHourAndMinutes(date);
      }
    }
  }
</script>
