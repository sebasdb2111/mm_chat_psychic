<template>
	<q-page class="flex">
		<q-list
			class="full-width"
			separator>
			<q-item-label header>Active Chats</q-item-label>
			<q-item
				v-for="(chatSession, key) in chatListData"
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
					<q-item-label caption lines="2">Created at: {{
						convertIsoFormatWithHourAndMinutes(chatSession.createdAt) }}
					</q-item-label>
				</q-item-section>
				<q-item-section side>
					<p :class="chatSession.owner.status ? 'text-teal' : 'text-red'">
						{{ chatSession.owner.status ? 'online' : 'offline' }}
					</p>
				</q-item-section>
			</q-item>
		</q-list>
	</q-page>
</template>

<script>
	import {mapActions, mapGetters} from 'vuex'
	import {convertIsoFormatWithHourAndMinutes} from '../servicies/date-utils'

	export default {
		data() {
			return {
				chats: [],
			}
		},
		async created() {
			await this.chatSessions();

			const chats = this.chatSessionList;
			this.chats = chats.data;
		},
		watch: {
			chatSessionList() {
				const chats = this.chatSessionList;
				this.chats = chats.data;
			}
		},
		computed: {
			...mapGetters('chatSession', ['chatSessionList']),
			chatListData() {
				this.$socket.client.on('customer_online', customer => {
					let indexOfChat = this.chats.findIndex(el => el.owner.id === customer.id);
					this.chats[indexOfChat].owner.status = true;
					this.$set(this.chats, indexOfChat, this.chats[indexOfChat]);
				});

				this.$socket.client.on('customer_offline', customer => {
					let indexOfChat = this.chats.findIndex(el => el.owner.id === customer.id);
					delete(this.chats[indexOfChat].owner.status);
					this.$set(this.chats, indexOfChat, this.chats[indexOfChat]);
				});

				return this.chats;
			}
		},
		methods: {
			...mapActions('chatSession', ['chatSessions']),
			convertIsoFormatWithHourAndMinutes(date) {
				return convertIsoFormatWithHourAndMinutes(date);
			}
		}
	}
</script>
