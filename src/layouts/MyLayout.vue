<template>
	<q-layout view="lHh Lpr lFf">
		<q-header elevated>
			<q-toolbar class="bg-teal text-white shadow-2">
				<q-btn
					v-if="$route.fullPath.includes('/chat')"
					class="absolute-left"
					v-go-back.single
					icon="arrow_back"
					flat
					dense
					label="Back"
				/>

				<q-toolbar-title class="absolute-center">
					MM Chat
				</q-toolbar-title>

				<q-btn
					v-if="!isLogged"
					to="/auth"
					class="absolute-right q-pr-sm"
					no-caps
					flat
					dense
					label="Login"
				/>
				<q-btn
					v-if="isLogged"
					@click="closeSession"
					to="/auth"
					class="absolute-right q-pr-sm"
					no-caps
					flat
					dense
					label="Logout"
				/>
			</q-toolbar>
		</q-header>

		<q-page-container>
			<router-view/>
		</q-page-container>
	</q-layout>
</template>

<script>
	import {mapActions, mapGetters} from 'vuex';

	export default {
		created() {
			this.$socket.client.emit('connect');
		},
		computed: {
			isLogged() {
				return this.loggedIn();
			}
		},
		methods: {
			...mapActions('auth', ['logout']),
			...mapGetters('auth', ['loggedIn']),
			...mapGetters('psychic', ['psychicData']),
			async closeSession() {
				await this.logout();
				const psychicData = await this.psychicData();

				this.$socket.client.emit('disconnect');
				this.$socket.client.emit('psychic_offline', psychicData);
			}
		}
	};
</script>
