// let data = {
//     list: JSON.parse('<%- jsonStr %>')
// }

let app = new Vue({
    el: '#app',
    data: {
        list: JSON.parse('<%- jsonStr %>')
    }
})