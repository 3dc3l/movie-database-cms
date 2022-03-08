<template>
    <div id="review" class="page" v-if="loaded">
        <!-- Back Action Item -->
		<div class="actions">
			<nuxt-link :to="`/reviews`" class="primary_button pointer">
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
                    <div class="group bordered filled">
                        <label for="content">Content *</label>
                        <input type="text" class="input" name="content" autocomplete="off" placeholder="Enter First Name" v-model="res.content" v-validate="{ required: true }">
                        <transition name="slide"><span class="validate" v-if="errors.has('content')">{{ properFormat(errors.first('content')) }}</span></transition>
                    </div>
				</div>
			</div>
			<div class="buttons fixed">
				<nuxt-link to="/reviews" class="cancel_button half_width btn lg">Cancel</nuxt-link>
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
                    user_id: '',
                    movie_id: '',
                    content: '',
                },
				res: [],
            }
        },
		inject: ['$validator'],
        methods: {
            submit () {
				const me = this
                me.$validator.validateAll().then(valid => {
                    if (valid) {
                        me.$store.commit('global/loader/checkLoader', { status: true })
                        let form_data = new FormData(document.getElementById('form'))
						form_data.append('_method', 'PATCH')

                        me.$axios.put(`/api/reviews/${me.$route.params.slug}`, form_data).then(res => {
                            me.$store.dispatch('global/toast/addToast', { type: 'success', message: 'Item has been added!' })
                            me.$router.push(`/reviews`)
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
				me.loaded = false
				me.$axios.get(`/api/reviews/${me.$route.params.slug}`).then(res => {
					if (res.data.id) {
						me.res = res.data
                        me.form.user_id = res.data.user.id
                        me.form.movie_id = res.data.movie.id
					}
					else {
						me.$nuxt.error({ statusCode: 404, message: 'Page not found' })
					}
				}).catch(err => {
					me.$store.commit('global/catcher/populateErrors', { items: err.response.data.errors })
				}).then(() => {
					setTimeout( () => {
						me.$store.commit('global/loader/checkLoader', { status: false })
						document.body.classList.remove('no_scroll', 'no_click')
					}, 500)
					me.loaded = true
				})
			}
        },
		mounted () {
			const me = this
			me.initialization()
		
		},
		asyncData ({ store }) {
			store.commit('global/settings/populateTitle', { title: 'Reviews' })
			store.commit('global/loader/checkLoader', { status: true })
		},
		beforeMount () {
			window.addEventListener('load', this.initialization)
		},
		beforeDestroy () {
			window.removeEventListener('load', this.initialization)
		}
    }
</script>
