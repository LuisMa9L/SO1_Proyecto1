const socket = io()

new Vue({
    el: '#chat-app',
    data: {
        message: '',
        messages: []
    },
    created() {
        const vm = this;
        socket.on('chat message', function (msg,libre,disponible) { 
            var mvv = (parseFloat(disponible)-parseFloat(libre))/1024;

            console.log('msg:',msg,'libre:',libre,'disponible',disponible,'::',mvv);
            let valor = 100-parseFloat(msg);
            update(contador++,valor.toFixed(3));
           /*  vm.messages.push({
                text: msg,
                date: new Date().toLocaleDateString()
            }) */
        })
    },
    methods: {
        sendMessage() {
            socket.emit('chat message', this.message);
            this.message = '';
        }
    }
});