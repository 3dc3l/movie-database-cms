<template lang="html">
    <transition name="fade">
        <div id="dialog" :class="[ 'basic', (centered) ? 'centered' : '' ]" v-if="opened">
            <div class="wrapper">
                <div class="content cancel">
                    <div class="close pointer" @click="close()">×</div>
                    <div class="content_top">
                        Confirmation
                    </div>
                    <div class="content_middle">
                        Are you sure you want to delete this {{ item }}? <br />
                        This action cannot be undone.
                    </div>
                    <div class="content_bottom">
                        <div class="inline">
                            <div class="cancel_button outline pointer ml ten" @click="close()">Cancel</div>
                            <div class="primary_button pointer" @click="confirm()">Confirm</div>
                        </div>
                    </div>
                </div>
                <div class="backdrop" @click="close()"></div>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        props: {
            item: {
                type: String,
                default: ''
            },
            centered: {
                type: Boolean,
                default: false
            },
            api: {
                type: String,
                default: ''
            },
            for_asset: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                opened: false
            }
        },
        methods: {
            close () {
                const me = this
                me.opened = false
            },
            confirm () {
                const me = this
                me.$store.commit('global/loader/checkLoader', { status: true })
                me.$axios.delete(me.api).then(res => {
                    me.close()
                    me.$store.dispatch('global/toast/addToast', { type: 'success', message: 'Item has been deleted!' })
                    if (me.for_asset) {
                        me.$parent.initialization()
                    } else {
                        me.$parent.fetchData()
                    }
                }).catch(err => {
                    console.log(err.data);
                }).then(() => {
                    setTimeout( () => {
                        me.$store.commit('global/loader/checkLoader', { status: false })
                        me.loaded = true
                        document.body.classList.remove('no_scroll', 'no_click')
                    }, 500)
                })
            }
        }
    }
</script>
