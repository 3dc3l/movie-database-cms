<template lang="html">
    <div id="header">
        <div class="header_nav">
            <div class="title">
                {{ title }}
            </div>
            <breadcrumb :separator="'◦'" />
        </div>
        <div :class="`header_select ${(is_toggled) ? 'active' : ''}`" v-click-outside="close">
            <div class="header_user" @click="showSelect()">
                <!-- <img :src="user.images[0].path" v-if="user.images.length > 0" /> -->
                <div class="user_picture">
                    <div class="overlay">
                        {{ user.email.charAt(0) }}{{ user.email.charAt(1) }}
                    </div>
                </div>
                <div class="user_name">Hello, {{ user.email }}!</div>
            </div>
            <div class="user_select">
                <div class="select_header">
                    <div class="select_info">
                        <div class="header_name">{{ user.email }}</div>
                        <div class="header_role">Master Admin</div>
                    </div>
                </div>
                <div class="select_footer">
                   <!--
                    <nuxt-link to="/my-account" class="select_item account" @click.native.self="is_toggled = false">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="#0084B0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        <span>My Account</span>
                    </nuxt-link>
                   -->
                    <div class="pointer select_item logout" @click="logout()">
                        <span>Sign Out</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="#0084B0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import Breadcrumb from '~/components/global/Breadcrumb'

    export default {
        components: {
            Breadcrumb
        },
        data () {
            return {
                is_toggled: false,
                user_logout: false,
                user: {
                    email: ''
                }
            }
        },
        watch: {
            $route (to, from) {
                const me = this
                if (!me.user_logout) {
                    me.user = me.$auth.user
                }
            }
        },
        computed: {
            ...mapGetters({
                title: 'global/settings/getTitle'
            })
        },
        methods: {
            showSelect () {
                const me = this
                me.is_toggled ^= true
            },
            close (data = null) {
                const me = this
                me.is_toggled = false
            },
            async logout () {
                const me = this
                await me.$auth.logout().then(res => {
                    me.user_logout = true
                    window.location.assign('/')
                })
            }
        },
        mounted () {
            const me = this
            me.user = me.$auth.user
        }
    }
</script>
