export default {
    populateErrors (state, payload) {
        state.errors = []
        payload.items.forEach((item, key) => {
            state.errors.push(item)
        })
        state.has_error = true
    },
    hideHasError (state, payload) {
        state.errors = []
        state.has_error = payload.status
    }
}
