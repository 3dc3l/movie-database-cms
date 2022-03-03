<template lang="html">
    <div class="loader">
        <div class="wrapper">
            <div class="icon">
                <img src="/logo.png" width="68px" />
            </div>
            <div class="dots"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>
    </div>
</template>

<script>
    export default {
        mounted () {
            document.body.classList.add('no_scroll', 'no_click')
        }
    }
</script>
