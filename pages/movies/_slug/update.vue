<template>
    <div id="movie" class="page" v-if="loaded">
        <!-- Back Action Item -->
		<div class="actions">
			<nuxt-link :to="`/movies`" class="primary_button pointer">
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
					<div class="group_inline two">
						<div class="group bordered filled">
							<label for="name">Title *</label>
							<input type="text" class="input" name="title" autocomplete="off" placeholder="Enter Title" v-model="res.title" v-validate="{ required: true }">
							<transition name="slide"><span class="validate" v-if="errors.has('title')">{{ properFormat(errors.first('title')) }}</span></transition>
						</div>
						<div class="group bordered filled">
							<label for="release_year">Release Year *</label>
							<date-picker v-model="res.release_year" :format="DatePickerFormat" data-vv-name="release_year" minimum-view="year" id="release_year"  name="release_year" input-class="field-input" v-validate="{ required: true }" />
							<transition name="slide"><span class="validate" v-if="errors.has('release_year')">{{ properFormat(errors.first('release_year')) }}</span></transition>
						</div>
					</div>
					<div class="group bordered filled">
						<label for="name">Genres *</label>
						<v-select multiple v-model="form.genres" name="genres" :options="genres" v-validate="{ required: true }" />
						<transition name="slide"><span class="validate" v-if="errors.has('genres')">{{ properFormat(errors.first('genres')) }}</span></transition>
					</div>
					<div class="group bordered filled">
						<label for="name">Casts *</label>
						<v-select multiple v-model="res.casts" name="casts" :options="casts" v-validate="{ required: true }" />
						<transition name="slide"><span class="validate" v-if="errors.has('casts')">{{ properFormat(errors.first('casts')) }}</span></transition>
					</div>
					<div class="group bordered filled">
						<label for="name">Image *</label>
						<input
							type="file"
							style="display: none"
							ref="fileInput"
							accept="image/*"
							name="image"
							v-validate="{ required: true }"
							@change="onFilePicked"
							class="edit_thumbnail"
							v-if="is_enabled" />
						<transition name="slide"><span class="validate" v-if="errors.has('form.image')">{{ properFormat(errors.first('form.image')) }}</span></transition>
					</div>
					<div class="image_preview">
						<img :src="current_image" alt="">
						<div class="success_button pointer" @click="onPickFile()">Change Image</div>
					</div>
				</div>
			</div>
			<div class="buttons fixed">
				<nuxt-link to="/movies" class="cancel_button half_width btn lg">Cancel</nuxt-link>
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
                    title: '',
                    release_year: '2022',
                    genres: [],
                    casts: [],
					image: null
                },
				DatePickerFormat: 'yyyy',
				res: [],
				current_image: null,
				genres: [],
				casts: [],
				is_enabled: false
            }
        },
		inject: ['$validator'],
        methods: {
			onPickFile () {
				this.is_enabled = true
				setTimeout( () => {
					this.$refs.fileInput.click()
				}, 500)
			},
			onFilePicked (event) {
				console.log('event')
				const files = event.target.files
				let filename = files[0].name
				const fileReader = new FileReader()
				fileReader.addEventListener('load', () => {
					this.imageUrl = fileReader.result
				})
				fileReader.readAsDataURL(files[0])
				this.current_image = URL.createObjectURL(files[0]);
				this.form.image = files[0]
			},
            submit () {
				const me = this
                me.$validator.validateAll().then(valid => {
                    if (valid) {
                        me.$store.commit('global/loader/checkLoader', { status: true })
                        let form_data = new FormData(document.getElementById('form'))
						form_data.append('_method', 'PATCH')

						if (me.res.casts.length) {
							me.res.casts.forEach((item, index) => {
								if( item == 0 ) {
									form_data.append('cast_id[]', '')
								} else {
									form_data.append('cast_id[]', item.id)
								}
							})
						} else {
							form_data.append('cast_id[]', '')
						}

						if (me.res.genres.length) {
							me.form.genres.forEach((item, index) => {
								if( item == 0 ) {
									form_data.append('genre_id[]', '')
								} else {
									form_data.append('genre_id[]', item.id)
								}
							})
						} else {
							form_data.append('genre_id[]', '')
						}

                        me.$axios.put(`/api/movies/${me.$route.params.slug}`, form_data).then(res => {
                            me.$store.dispatch('global/toast/addToast', { type: 'success', message: 'Item has been added!' })
                            me.$router.push(`/movies`)
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
				me.$axios.get(`/api/movies/${me.$route.params.slug}`).then(res => {
					if (res.data.id) {
						me.res = res.data
						me.form.genres = res.data.genres
						me.current_image = res.data.get_image_url
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

				me.$axios.get('api/genres-and-casts').then(res => {
                    me.genres = res.data.genres
					me.casts = res.data.casts
                }).catch(err => {
                    me.$store.commit('global/catcher/populateErrors', { items: err.response.data.errors })
                }).then(() => {
                    setTimeout( () => {
                        me.$store.commit('global/loader/checkLoader', { status: false })
                        if (status) {
                            me.loaded = true
                        }
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
			store.commit('global/settings/populateTitle', { title: 'Movies' })
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
<style lang="stylus">
	.edit_thumbnail
		diplay: none
	.image_preview
		display: flex
		flex-direction: column
		img
			height: 400px
			object-fit: contain
			object-position: center
			background: #80808029
</style>