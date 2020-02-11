<template>
	<q-page
		ref="pageChat"
		class="page-chat flex column"
	>
		<q-toolbar class="bg-teal-3 text-white ">
			<q-toolbar-title>
				<q-avatar color="white" text-color="teal">
					{{ customer.charAt(0) }}
				</q-avatar>
				{{ customer }}
			</q-toolbar-title>
		</q-toolbar>
		<div class="q-pa-md column col justify-end">
			<q-infinite-scroll reverse>
				<div
					v-for="(msg, index) in messages"
					:key="`${index}`"
				>
					<div v-if="!msg.isImage">
						<q-chat-message
							:sent="msg.sent"
							:text-color="msg.textColor"
							:bg-color="msg.bgColor"
							:text="msg.text"
							:name="msg.name"
						/>
					</div>
					<div v-else>
						<q-chat-message
							:sent="msg.sent"
							:bg-color="msg.bgColor"
							:name="msg.name"
						>
							<q-img
								:src="msg.text"
								spinner-color="white"
								style="height: 140px; max-width: 150px"
							/>
						</q-chat-message>
					</div>
				</div>
			</q-infinite-scroll>
		</div>
		<q-footer class="bg-teal shadow-2" elevated>
			<q-toolbar>
				<q-form
					@submit="sendMessage"
					class="full-width"
				>
					<q-input
						v-model="newMessage"
						@blur="scrollToBottom"
						ref="newMessage"
						bg-color="white"
						outlined
						rounded
						placeholder="Type your message"
						dense
					>
						<template v-slot:before>
							<q-icon
								name="style"
								round
								dense
								flat
								color="white"
								@click="openCards"
							/>
						</template>
						<template v-slot:after>
							<q-btn
								round
								dense
								flat
								type="submit"
								color="white"
								icon="send"
							/>
						</template>
					</q-input>
				</q-form>
			</q-toolbar>
		</q-footer>

		<q-dialog v-model="dialog">
			<q-layout view="Lhh lpR fff" container class="bg-white">
				<q-header reveal elevated>
					<q-toolbar class="bg-teal text-white">
						<q-toolbar-title>Select a card</q-toolbar-title>
						<q-btn flat round dense icon="close" class="bg-white text-teal" v-close-popup/>
					</q-toolbar>
				</q-header>

				<q-page-container>
					<q-page padding>
						<q-img
							v-for="card in cards"
							clickable
							v-ripple
							@click="sendCard(card.src)"
							v-close-popup
							class="rounded-borders center q-pb-md"
							:src="card.src"
							style="width: 33%; height: 33%"
							native-context-menu
						/>
					</q-page>
				</q-page-container>
			</q-layout>
		</q-dialog>
	</q-page>
</template>

<script>
	import {mapState, mapActions, mapGetters} from 'vuex'
	import mixinOtherUserDetails from 'src/mixins/mixin-other-user-details.js'

	export default {
		mixins: [mixinOtherUserDetails],
		data() {
			return {
				newMessage: '',
				showMessages: false,
				messages: [],
				customer: '',
				dialog: false,
				position: 'top',
				cards: [
					{src: '../statics/cards/tarot-chariot.jpg', name: 'The chariot'},
					{src: '../statics/cards/tarot-emperor.jpg', name: 'The emperor'},
					{src: '../statics/cards/tarot-empress.jpg', name: 'The empress'},
					{src: '../statics/cards/tarot-fool.jpg', name: 'The fool'},
					{src: '../statics/cards/tarot-hermit.jpg', name: 'The hermit'},
					{src: '../statics/cards/tarot-hierophant.jpg', name: 'The hierophant'},
					{src: '../statics/cards/tarot-highpriestess.jpg', name: 'The high priestess'},
					{src: '../statics/cards/tarot-justice.jpg', name: 'Justice'},
					{src: '../statics/cards/tarot-lovers.jpg', name: 'The lovers'},
					{src: '../statics/cards/tarot-magician.jpg', name: 'The magician'},
					{src: '../statics/cards/tarot-strength.jpg', name: 'Strength'},
					{src: '../statics/cards/tarot-wheeloffortune.jpg', name: 'Wheel of fortune'},
				]
			}
		},
		async created() {
			await this.bringConversation();
			this.scrollToBottom();
			await this.getChatSession(Number(this.$route.params.chatSessionId));
			await this.customerName();

			this.$socket.client.on('customer_send_message', async customerMessage => {
				if (customerMessage.data.chatSession.id === Number(this.$route.params.chatSessionId)) {
					const __ret = await this.getPsychicAndSender(customerMessage.data);
					const name = __ret.name;
					const bgColor = __ret.bgColor;

					this.messages = [
						...this.messages,
						{
							id: customerMessage.data.id,
							text: [customerMessage.data.message],
							deleted: customerMessage.data.deleted,
							stamp: customerMessage.data.createdAt,
							sent: false,
							name,
							bgColor
						}
					];
					this.scrollToBottom();
				}
			});
		},
		mounted() {
			this.getConversation(this.$route.params.chatSessionId);
		},
		computed: {
			...mapState('chatSession', ['conversation']),
			...mapState('psychic', ['psychicDetails'])
		},
		methods: {
			...mapActions('chatSession', ['getConversation', 'sendMessage', 'getChatSession']),
			...mapGetters('chatSession', ['chatSessionData']),
			...mapGetters('psychic', ['psychicData']),
			async customerName() {
				const chatSessionData = await this.chatSessionData();
				this.customer = `${chatSessionData.data.owner.firstName} ${chatSessionData.data.owner.lastName}`;
			},
			async bringConversation() {
				const conversation = await this.getConversation(Number(this.$route.params.chatSessionId));
				await this.mountConversation(conversation.data);
			},
			async postMessage(messageText, isImage = false) {
				this.$store
					.dispatch('chatSession/sendMessage', {
						chatSessionId: Number(this.$route.params.chatSessionId),
						message: messageText,
						isImage
					})
					.then(async message => {
						const __ret = await this.getPsychicAndSender(message.data);
						const name = __ret.name;

						this.$socket.client.emit('psychic_send_message', message);

						this.messages = [
							...this.messages,
							{
								id: message.data.id,
								text: [message.data.message],
								deleted: message.data.deleted,
								isImage: message.data.isImage,
								stamp: message.data.createdAt,
								sent: true,
								name,
								bgColor: 'grey-3'
							}
						];
						this.scrollToBottom();
					})
					.catch(() => {
						this.$q.notify({
							color: 'red-5',
							textColor: 'white',
							icon: 'checkmark',
							message: 'Something went worng'
						});
					});
			},
			async sendMessage(e) {
				e.preventDefault();
				await this.postMessage(this.newMessage);

				this.clearMessage()
			},
			async mountConversation(conversation) {
				conversation.forEach(async msg => {
					const __ret = await this.getPsychicAndSender(msg);
					const sent = __ret.sent;
					const name = __ret.name;
					const bgColor = __ret.bgColor;

					this.messages.push({
						id: msg.id,
						text: [msg.message],
						deleted: msg.deleted,
						isImage: msg.isImage,
						stamp: msg.createdAt,
						sent,
						name,
						bgColor
					});
				});

				return this.messages;
			},
			async getPsychicAndSender(message) {
				const psychic = await this.psychicDetails;
				let bgColor = 'teal-3';
				let sent = false;
				let name = '';

				if (
					!message.customer &&
					message.psychic &&
					message.psychic.id === psychic.id &&
					message.psychic.username === psychic.username
				) {
					bgColor = 'grey-3';
					sent = true;
				}

				if (
					!message.customer &&
					message.psychic &&
					message.psychic.id === psychic.id &&
					message.psychic.username === psychic.username
				) {
					name = `${psychic.firstName} ${psychic.lastName}`;
				} else {
					name = `${message.customer.firstName} ${message.customer.lastName}`;
				}

				return {sent, name, bgColor};
			},
			async clearMessage() {
				this.newMessage = '';
				this.$refs.newMessage.focus()
			},
			async scrollToBottom() {
				const pageChat = this.$refs.pageChat.$el;
				setTimeout(() => {
					window.scrollTo(0, pageChat.scrollHeight)
				}, 20);
			},
			async sendCard(message) {
				await this.postMessage(message, true);
			},
			openCards() {
				this.dialog = true;
			}
		}
	}
</script>

<style lang="stylus">
	.page-chat
		background #e2dfd5
		&:after
			content ''
			display block
			position fixed
			left 0
			right 0
			top 0
			bottom 0
			z-index 0
			opacity 0.1
			background-image radial-gradient(circle at 100% 150%, silver 24%, white 25%, white 28%, silver 29%, silver 36%, white 36%, white 40%, transparent 40%, transparent), radial-gradient(circle at 0    150%, silver 24%, white 25%, white 28%, silver 29%, silver 36%, white 36%, white 40%, transparent 40%, transparent), radial-gradient(circle at 50%  100%, white 10%, silver 11%, silver 23%, white 24%, white 30%, silver 31%, silver 43%, white 44%, white 50%, silver 51%, silver 63%, white 64%, white 71%, transparent 71%, transparent), radial-gradient(circle at 100% 50%, white 5%, silver 6%, silver 15%, white 16%, white 20%, silver 21%, silver 30%, white 31%, white 35%, silver 36%, silver 45%, white 46%, white 49%, transparent 50%, transparent), radial-gradient(circle at 0    50%, white 5%, silver 6%, silver 15%, white 16%, white 20%, silver 21%, silver 30%, white 31%, white 35%, silver 36%, silver 45%, white 46%, white 49%, transparent 50%, transparent)
			background-size 100px 50px
	.q-banner
		top 50px
		z-index 2
		opacity 0.8
	.q-message
		z-index 1
</style>
