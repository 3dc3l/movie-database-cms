<template>
    <div id="login" v-if="true">
        <div class="wrapper">
            <!-- Company Image -->
            <div class="left">
               <img src="/company-banner.jpg" />
            </div>
            <!-- Login Form -->
            <div class="right">
                <div class="overlay">
                    <h2>Login</h2>
                    <h3>Welcome back, Please login to continue</h3>
                    <form class="form" id="action" @submit.prevent="submit()">
                        <div class="group floating">
                            <input type="text" :class="[ 'input', (form.admin.email.length > 0) ? 'filled' : '' ]" name="email" autofocus autocomplete="off" v-model="form.admin.email" v-validate="{ required: true, email: true }">
                            <label for="email">Email Address</label>
                            <transition name="slide"><span class="validate" v-if="errors.has('email')">{{ properFormat(errors.first('email')) }}</span></transition>
                        </div>
                        <div class="group floating">
                            <input type="password" :class="[ 'input', (form.admin.password.length > 0) ? 'filled' : '' ]" name="password" autocomplete="off" v-model="form.admin.password" v-validate="{ required: true }">
                            <label for="password">Password</label>
                            <transition name="slide"><span class="validate" v-if="errors.has('password')">{{ properFormat(errors.first('password')) }}</span></transition>
                        </div>
                        <div class="buttons">
                            <button type="submit" class="primary_button pointer">Login</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                loaded: false,
                form: {
                    admin: {
                        email: '',
                        password: ''
                    }
                }
            }
        },
        methods: {
            /**
             * login submission
             * calling of nuxt auth plugin
             */
            submit () {
                const me = this
                me.$validator.validateAll().then(valid => {
                    if (valid) {
                        me.$store.commit('global/loader/checkLoader', { status: true })

                        me.$auth.loginWith('local', { data: me.form }).then(res => {
                            me.$router.push('/movies')
                            this.$router.go()
                        }).catch(err => {
                            me.$store.commit('global/catcher/populateErrors', { items: [err.response.data] })
                        }).then(() => {
                            me.$store.commit('global/loader/checkLoader', { status: false })
                            document.body.classList.remove('no_scroll', 'no_click')
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
                        me.$store.commit('global/loader/checkLoader', { status: false })
                if (document.readyState != 'interactive') {
                    setTimeout( () => {
                        me.$store.commit('global/loader/checkLoader', { status: false })
                        me.loaded = true
                        document.body.classList.remove('no_scroll', 'no_click')
                    }, 1000)
                }
            }
        },
        mounted () {
            const me = this
            me.initialization()
        },
        asyncData ({ store }) {
            store.commit('global/loader/checkLoader', { status: true })
        },
        beforeMount () {
            window.addEventListener('load', this.initialization)
        },
        beforeDestroy () {
            window.removeEventListener('load', this.initialization)
        },
        head () {
            return {
                title: 'Welcome | Admin Template'
            }
        }
    }
</script>
