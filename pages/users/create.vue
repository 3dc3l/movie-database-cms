<template>
    <div id="users" class="page" v-if="loaded">
        <!-- Back Action Item -->
		<div class="actions">
			<nuxt-link :to="`/users`" class="primary_button pointer">
				<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
				<span>Back</span>
			</nuxt-link>
		</div>

        <!-- Action Item -->
		<form id="form" class="form mb seventy" @submit.prevent="submit()">
            <div class="box mb">
				<div class="top_box inline">
					<h2>Information</h2>
				</div>
				<div class="bottom_box">
					<div class="group_inline four">
						<div class="group bordered filled">
							<label for="email">Email Address</label>
                            <input type="text" :class="[ 'input', (form.user.email.length > 0) ? 'filled' : '' ]" name="email" autofocus autocomplete="off" v-model="form.user.email" v-validate="{ required: true, email: true }">
                            <transition name="slide"><span class="validate" v-if="errors.has('email')">{{ properFormat(errors.first('email')) }}</span></transition>
						</div>
                        <div class="group bordered filled">
							<label for="password">Password</label>
                            <input type="password" ref="password" :class="[ 'input', (form.user.password.length > 0) ? 'filled' : '' ]" name="password" autocomplete="off" v-model="form.user.password" v-validate="{ required: true }">
                            <transition name="slide"><span class="validate" v-if="errors.has('password')">{{ properFormat(errors.first('password')) }}</span></transition>
						</div>
                        <div class="group bordered filled">
							<label for="password_confirmation">Confirm Password</label>
                            <input type="password" :class="[ 'input', (form.user.password_confirmation.length > 0) ? 'filled' : '' ]" name="password_confirmation" autocomplete="off" v-model="form.user.password_confirmation" v-validate="'required|confirmed:password|min:6'">
                            <transition name="slide"><span class="validate" v-if="errors.has('password_confirmation')">{{ properFormat(errors.first('password_confirmation')) }}</span></transition>
						</div>
					</div>
				</div>
			</div>
			<div class="buttons fixed">
				<nuxt-link to="/users" class="cancel_button half_width btn lg">Cancel</nuxt-link>
				<button type="submit" class="success_button half_width btn lg pointer">Submit</button>
			</div>
        </form>

    </div>
</template>
<script>
    export default {
        data () {
            return {
                loaded: false,
                form: {
                    user: {
                        email: '',
                        password: '',
                        password_confirmation: '',
                        is_admin: 0
                    }
                }
            }
        },
        methods: {
            submit () {
				const me = this
                me.$validator.validateAll().then(valid => {
                    if (valid) {
                        me.$store.commit('global/loader/checkLoader', { status: true })

                        me.$axios.post('/users', me.form).then(res => {
                            me.$store.dispatch('global/toast/addToast', { type: 'success', message: 'Item has been added!' })
                            me.$router.push(`/users`)

                        }).catch(err => {
                            me.$store.commit('global/catcher/populateErrors', { items: err.response.data.errors })
                        }).then(() => {
                            setTimeout( () => {
                                me.$store.commit('global/loader/checkLoader', { status: false })
                                document.body.classList.remove('no_scroll', 'no_click')
                            }, 500)
                        })
                    } else {
                        me.$scrollTo('.validate', {
							offset: -250
						})
                    }
                })
            },
            /**
             * ready state method
             * check if DOM is still in the interactive state
             * @param  {[object]} event [event listener of DOM]
             */
            initialization (event) {
                const me = this                
                me.loaded = true
                if (document.readyState != 'interactive') {
                    document.body.classList.remove('no_scroll', 'no_click')
                }
            }
        },
		mounted () {
            this.initialization()
        },
        
    }
</script>