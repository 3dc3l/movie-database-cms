<template lang="html">
    <transition name="fade">
        <div id="dialog" class="basic centered" v-if="opened">
            <div class="wrapper">
                <div class="content cancel">
                    <div class="close pointer" @click="close({ status: false })">×</div>
                    <div class="content_top">
                        Error
                    </div>
                    <div class="content_middle">
                        <ul>
                            <li v-for="(data, key) in items">{{ data }}</li>
                        </ul>
                    </div>
                    <div class="content_bottom">
                        <div class="primary_button pointer" @click="close({ status: false })">OK</div>
                    </div>
                </div>
                <div class="backdrop" @click="close({ status: false })"></div>
            </div>
        </div>
    </transition>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex'

    export default {
        computed: {
            ...mapGetters('global/catcher', {
                items: 'getErrors',
                opened: 'getHasError'
            })
        },
        methods: {
            ...mapMutations('global/catcher', {
                close: 'hideHasError'
            })
        }
    }
</script>
