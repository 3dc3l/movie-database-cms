<template>
    <div id="movie" class="page" v-if="loaded">
        <!-- Back Action Item -->
		<div class="actions">
			<nuxt-link :to="`/articles`" class="primary_button pointer">
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
						<label for="name">Title *</label>
						<input type="text" class="input" name="title" autocomplete="off" placeholder="Enter Title" v-model="form.title" v-validate="{ required: true }">
						<transition name="slide"><span class="validate" v-if="errors.has('title')">{{ properFormat(errors.first('title')) }}</span></transition>
					</div>
                    <div class="group bordered filled">
                        <label for="published_date">Published Date *</label>
                        <v-ctk v-model="form.published_date" :format="'YYYY'" :only-date="true" :no-button="true" :formatted="'YYYY'" :no-label="true" :color="'#0084B0'" id="published_date" name="published_date" data-vv-name="published_date" label="Select Published Date" v-validate="{ required: true }"></v-ctk>
                        <transition name="slide"><span class="validate" v-if="errors.has('published_date')">{{ properFormat(errors.first('published_date')) }}</span></transition>
                    </div>
					<!-- multiple select 
					<div class="group_inline two">
						<div class="group select bordered filled">
							<label for="status">Sub Topic (select Main topic first)*</label>
							<div class="custom_select" v-click-outside="close_sub_topic">
								<div :class="form.sub_topic.length ? 'selected_item' : 'not_active selected_item'" @click="dropdown.sub_topic = !dropdown.sub_topic">
									<span v-line-clamp:20="1">
										{{ form.sub_topic.length ? return_checkbox_value('sub_topic') : 'Select by Sub Topic'}}
									</span> 
								</div>
								<transition name="fade">
									<div class="select_dropdown" v-show="dropdown.sub_topic">
										<div :class="is_checked('sub_topic',index) ? 'dropdown_item active_dropdown' : 'dropdown_item'" v-for="(item, index) in sub_topic" :key="index">
											<label :for="`sub_topic_${index}`" class="radio_container">
												<span :class="`checkmark ${is_checked('sub_topic',index) ? 'checked' : ''}`"></span>
												<input type="checkbox" name="sub_topic" v-model="form.sub_topic" :value="index" :id="`sub_topic_${index}`" @change="change_filter('sub_topic',index)" v-validate="{ required: true }">
												{{ item.name }}
											</label>
										</div>
									</div>
								</transition>
							</div>
							<transition name="slide"><span class="validate" v-if="errors.has('sub_topic')">{{ properFormat(errors.first('sub_topic')) }}</span></transition>
						</div>
						<div class="group select bordered filled">
							<label for="published_date">SDG (select Sub topic first)</label>
							<select class="input" name="sdgs" v-model="form.sdgs" :readonly="form.sub_topic != '' && form.sub_topic != null && form.sub_topic != 0 ? false :  true">
								<option value="">Select SDGS</option>
								<option :value="index" v-for="(item, index) in sdgs" :key="index">{{ item.name }}</option>
							</select>
							<div class="dd"></div>
							<transition name="slide"><span class="validate" v-if="errors.has('sdgs')">{{ properFormat(errors.first('sdgs')) }}</span></transition>
						</div>
					</div>
					 multiple select -->
					
                    <div class="buttons fixed">
                        <nuxt-link to="/articles" class="cancel_button half_width btn lg">Cancel</nuxt-link>
                        <button type="submit" class="success_button half_width btn lg pointer">Submit</button>
                    </div>
				</div>
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
                    release_year: '',
                    genres: [],
                    casts: [],
                }
            }
        },
        methods: {
            submit () {

            }
        }
    }
</script>