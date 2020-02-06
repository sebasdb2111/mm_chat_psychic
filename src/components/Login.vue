<template>
	<q-form @submit="submitForm">
		<q-input
			v-model="formData.email"
			class="q-mb-md"
			outlined
			type="email"
			label="Email" />
		<q-input
			v-model="formData.password"
			class="q-mb-md"
			outlined
			type="password"
			label="Password" />
    <div class="row">
      <q-space />
      <div class="row justify-end">
        <q-btn type="submit" color="teal" :disabled="(!this.formData.email || !this.formData.password)">
          <span>Login</span>
        </q-btn>
      </div>
    </div>
	</q-form>
</template>

<script>
	import { mapActions, mapGetters } from 'vuex'

	export default {
		props: ['tab'],
		data() {
			return {
        // loading: !(!this.formData.email || !this.formData.password),
				formData: {
					email: null,
					password: null
				}
			}
		},
		methods: {
			...mapActions('auth', ['login']),
      ...mapActions('psychic', ['currentPsychic']),
      ...mapActions('chatSession', ['chatSessions']),
      ...mapGetters('auth', ['loggedIn', 'psychic']),
			submitForm() {
        this.login(this.formData);
        const psychicLoggedIn = this.loggedIn();
        const psychic = this.psychic();

        if (psychicLoggedIn && psychic) {
          console.log('11111111111', )
          this.currentPsychic({ token: response.data });
              this.chatSessions();
              this.$router.push('/');
        }
        else {
          this.$q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message:
              'Something went wrong, please try again'
          });
        }
        // const
          // .then((response) => {
          //   console.log('SUBMIT', response)
          //   if (response) {
          //     this.currentPsychic({ token: response.data });
          //     this.chatSessions();
          //     this.$router.push('/');
          //   }
          //   else {
          //     this.$q.notify({
          //       color: 'red-5',
          //       textColor: 'white',
          //       icon: 'warning',
          //       message:
          //         'Something went wrong, please try again'
          //     });
          //   }
          // })
          // .catch(() => {
          //   this.$q.notify({
          //     color: 'red-5',
          //     textColor: 'white',
          //     icon: 'warning',
          //     message:
          //       'Something went wrong, please try again'
          //   });
          // });
			}
		}
	}
</script>
