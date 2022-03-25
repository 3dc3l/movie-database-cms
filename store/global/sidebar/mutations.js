export default {
    checkToggler (state, payload) {
        state.toggled = payload.status
    },
    checkShow (state, payload) {
        state.is_show = payload.is_show
    }
}
