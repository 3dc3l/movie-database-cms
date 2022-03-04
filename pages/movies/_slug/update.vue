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
							<input type="text" class="input" name="title" autocomplete="off" placeholder="Enter Title" v-model="form.title" v-validate="{ required: true }">
							<transition name="slide"><span class="validate" v-if="errors.has('title')">{{ properFormat(errors.first('title')) }}</span></transition>
						</div>
						<div class="group bordered filled">
							<label for="release_year">Release Year *</label>
							<date-picker v-model="form.release_year" :format="DatePickerFormat" data-vv-name="release_year" minimum-view="year" id="release_year"  name="release_year" input-class="field-input" v-validate="{ required: true }" />
							<transition name="slide"><span class="validate" v-if="errors.has('release_year')">{{ properFormat(errors.first('release_year')) }}</span></transition>
						</div>
					</div>
					<div class="group bordered filled">
						<label for="name">Genres *</label>
						<v-select multiple v-model="form.genres" name="genres" :options="['action','drama']" v-validate="{ required: true }" />
						<transition name="slide"><span class="validate" v-if="errors.has('genres')">{{ properFormat(errors.first('genres')) }}</span></transition>
					</div>
					<div class="group bordered filled">
						<label for="name">Casts *</label>
						<v-select multiple v-model="form.casts" name="casts" :options="['humi','Unieter']" v-validate="{ required: true }" />
						<transition name="slide"><span class="validate" v-if="errors.has('casts')">{{ properFormat(errors.first('casts')) }}</span></transition>
					</div>
					<div class="group bordered filled">
						<label for="name">Image *</label>
						<button class="btn btn-info" @click="onPickFile">Upload Thumbnail</button>
						<input
							type="file"
							style="display: none"
							ref="fileInput"
							accept="image/*"
							name="thumbnail"
							v-validate="{ required: true }"
							@change="onFilePicked"/>
						<transition name="slide"><span class="validate" v-if="errors.has('thumbnail')">{{ properFormat(errors.first('thumbnail')) }}</span></transition>
					</div>
				</div>
			</div>
			<div class="buttons fixed">
				<nuxt-link to="/articles" class="cancel_button half_width btn lg">Cancel</nuxt-link>
				<button type="submit" class="success_button half_width btn lg pointer">Submit</button>
			</div>
        </form>

    </div>
</template>
<script>
    export default {
        data () {
            return {
                loaded: true,
                form: {
                    title: '',
                    release_year: '2022',
                    genres: [],
                    casts: [],
					image: null
                },
				DatePickerFormat: 'yyyy',
            }
        },
        methods: {
			onPickFile () {
				this.$refs.fileInput.click()
			},
			onFilePicked (event) {
				const files = event.target.files
				let filename = files[0].name
				const fileReader = new FileReader()
				fileReader.addEventListener('load', () => {
					this.imageUrl = fileReader.result
				})
				fileReader.readAsDataURL(files[0])
				this.form.image = files[0]
			},
            submit () {
				const me = this
                me.$validator.validateAll().then(valid => {
                    if (valid) {
                        me.$store.commit('global/loader/checkLoader', { status: true })
                        let form_data = new FormData(document.getElementById('form'))

                        me.$axios.post('/api/movies', form_data).then(res => {
                            me.$store.dispatch('global/toast/addToast', { type: 'success', message: 'Item has been added!' })
                            // me.$router.push(`/content-types/media/${res.data.media.id}/update`)
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
            }
        }
    }
</script>