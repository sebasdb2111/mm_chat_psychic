<template>
	<q-form @submit="submitForm">
		<q-input
			v-model="formData.email"
			class="q-mb-md"
			outlined
			type="email"
			lazy-rules
			:rules="[val => (val !== null && val !== '') || 'Please type your email']"
			label="Email"/>
		<q-input
			color="teal"
			outlined
			v-model="formData.password"
			label="Password"
			lazy-rules
			:rules="[val => (val !== null && val !== '') || 'Please type your password']"
			:type="isPwd ? 'password' : 'text'"
		>
			<template v-slot:append>
				<q-icon
					:name="isPwd ? 'visibility_off' : 'visibility'"
					class="cursor-pointer"
					@click="isPwd = !isPwd"
				/>
			</template>
		</q-input>
		<div class="row">
			<q-space/>
			<div class="row justify-end">
				<q-btn type="submit" color="teal" :disabled="(!this.formData.email || !this.formData.password)">
					<span>Login</span>
				</q-btn>
			</div>
		</div>
	</q-form>
</template>

<script>
	import {mapActions, mapGetters} from 'vuex'

	export default {
		props: ['tab'],
		data() {
			return {
				isPwd: true,
				formData: {
					email: null,
					password: null
				}
			}
		},
		methods: {
			...mapActions('auth', ['login']),
			...mapActions('psychic', ['currentPsychic']),
			...mapGetters('psychic', ['psychicData']),
			...mapGetters('auth', ['loggedIn', 'psychic']),
			async submitForm() {
				await this.login(this.formData);
				const psychicLoggedIn = await this.loggedIn();
				const psychic = await this.psychic;

				if (psychicLoggedIn && psychic) {
					await this.currentPsychic({token: psychic.data});
					const psychicData = await this.psychicData();

					this.$socket.client.emit('psychic_online', psychicData);
					this.$router.push('/');
				} else {
					this.$q.notify({
						color: 'red-5',
						textColor: 'white',
						icon: 'warning',
						message:
							'Something went wrong, please try again'
					});
				}
			}
		}
	}
</script>
