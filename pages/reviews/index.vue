<template>
    <div id="reviews" class="page" v-if="loaded">
        <table class="table">
            <thead>
                <tr>
                    <th class="stick">
                        <div :class="`label`">
                            Author's Email
                        </div>
                    </th>
                    <th class="stick">
                        <div :class="`label`">
                            Content
                        </div>
                    </th>
                    <th class="stick">
                        <div :class="`label`">
                            Movie Title
                        </div>
                    </th>
                </tr>
            </thead>
			<tbody v-if="res.length > 0">
				<tr v-for="(data, key) in res" :key="key">
                   <td>{{ data.user.email }}</td>
                   <td>{{ data.content }}</td>
                   <td v-if="data.movie">{{ data.movie.title }}</td>
                   <td class="buttons">
						<div class="wrapper">
							<nuxt-link :to="`/reviews/${data.id}/update`" class="item edit">
								<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" class="icon"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
								<span>Edit</span>
							</nuxt-link>
							<div class="item ml delete pointer" @click="toggleConfirmation(data)">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" class="icon"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                <span>Delete</span>
                            </div>
						</div>
					</td>
				</tr>
			</tbody>
			<tbody class="no_results" v-else>
				<tr>
					<td colspan="7">No Result(s) Found.</td>
				</tr>
			</tbody>
        </table>

        <!-- Confirmation -->
        <delete-confirmation
            ref="confirmation"
            :item="'reviews'"
            :api="api"
        />
    </div>
</template>
<script>
	import DeleteConfirmation from '~/components/global/DeleteConfirmation'

    export default {
        components: {
			DeleteConfirmation
        },
        data () {
            return {
                res: [],
                loaded: false,
                api: '',
            }
        },
        methods: {
            toggleConfirmation (data) {
                const me = this
                setTimeout( () => {
                    me.api = `/api/reviews/${data.id}`
                    me.$refs.confirmation.opened = true
                }, 10)
            },
            /**
             * fetch all api
             * @param  {[string]} [status=null] [checker if initial load or note]
             */
            fetchData (status = null) {
                const me = this
                me.$axios.get('api/reviews').then(res => {
                    me.res = res.data
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
                })
            },
            /**
             * ready state method
             * check if DOM is still in the interactive state
             * @param  {[object]} event [event listener of DOM]
             */
            initialization (event) {
                const me = this
                if (document.readyState != 'interactive') {
                    me.fetchData('initial')
                    me.$store.commit('global/loader/checkLoader', { status: false })
                    document.body.classList.remove('no_scroll', 'no_click')
                }
            }
        },
        mounted () {
            this.initialization()
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