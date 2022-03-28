<template>
    <div id="casts" class="page" v-if="loaded">
        <!-- Back Action Item -->
		<div class="actions">
			<nuxt-link :to="`/casts`" class="primary_button pointer">
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
							<label for="first_name">First Name *</label>
							<input type="text" class="input" name="first_name" autocomplete="off" placeholder="Enter First Name" v-model="form.first_name" v-validate="{ required: true }">
							<transition name="slide"><span class="validate" v-if="errors.has('first_name')">{{ properFormat(errors.first('first_name')) }}</span></transition>
						</div>
                        <div class="group bordered filled">
							<label for="middle_name">Middle Name *</label>
							<input type="text" class="input" name="middle_name" autocomplete="off" placeholder="Enter Middle Name" v-model="form.middle_name" v-validate="{ required: true }">
							<transition name="slide"><span class="validate" v-if="errors.has('middle_name')">{{ properFormat(errors.first('middle_name')) }}</span></transition>
						</div>
                        <div class="group bordered filled">
							<label for="last_name">Last Name *</label>
							<input type="text" class="input" name="last_name" autocomplete="off" placeholder="Enter Last Name" v-model="form.last_name" v-validate="{ required: true }">
							<transition name="slide"><span class="validate" v-if="errors.has('last_name')">{{ properFormat(errors.first('last_name')) }}</span></transition>
						</div>
                        <div class="group bordered filled">
							<label for="suffix">Suffix *</label>
							<input type="text" class="input" name="suffix" autocomplete="off" placeholder="Enter Suffix" v-model="form.suffix">
							<transition name="slide"><span class="validate" v-if="errors.has('suffix')">{{ properFormat(errors.first('suffix')) }}</span></transition>
						</div>
					</div>
                     <div class="group bordered filled">
                        <label for="stage_name">Stage Name *</label>
                        <input type="text" class="input" name="stage_name" autocomplete="off" placeholder="Enter Stage Name" v-model="form.stage_name" v-validate="{ required: true }">
                        <transition name="slide"><span class="validate" v-if="errors.has('stage_name')">{{ properFormat(errors.first('stage_name')) }}</span></transition>
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
							@change="onFilePicked"/>
					</div>
					<div class="image_preview">
						<img :src="current_image" alt=""  v-if="form.image">
						<div class="success_button pointer" @click="onPickFile()">{{ (form.image) ? 'Change Thumbnail' : 'Add Thumbnail' }}</div>
						<transition name="slide"><span class="validate" v-if="errors.has('image')">{{ properFormat(errors.first('image')) }}</span></transition>
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
                    first_name: '',
                    middle_name: '',
                    last_name: '',
                    suffix: '',
                    stage_name: '',
					image: null
                },
				current_image: ''
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
				this.current_image = URL.createObjectURL(files[0]);
				this.form.image = files[0]
			},
            submit () {

				const me = this
                me.$validator.validateAll().then(valid => {
                    if (valid) {
                        me.$store.commit('global/loader/checkLoader', { status: true })
                        let form_data = new FormData(document.getElementById('form'))

                        me.$axios.post('/api/casts', form_data).then(res => {
                            me.$store.dispatch('global/toast/addToast', { type: 'success', message: 'Item has been added!' })
                            me.$router.push(`/casts`)

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