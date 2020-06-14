const socket = io()

socket.on('chat message', function (msg,libre,disponible) { 
    var mvv = (parseFloat(disponible)-parseFloat(libre))/1024;

    //console.log('msg:',msg,'libre:',libre,'disponible',disponible,'::',mvv);
    let valor = 100-parseFloat(msg);
    actualizar_data_cpu(conta_x_cpu++,valor.toFixed(3));
    
    
    let e_ram_total = document.getElementById('cpu_utilizado');
    e_ram_total.innerHTML= `<span class="fa fa-arrow-circle-right"></span> Porcentaje utilizado: ${valor.toFixed(3)} %`
})


socket.on('valores ram', function (total, libre, disponible, enUso) { 
    var mvv = (parseFloat(disponible)-parseFloat(libre))/1024;

    //console.log('msg:',msg,'libre:',libre,'disponible',disponible,'::',mvv);
    let valor = enUso;
    let e_ram_total = document.getElementById('ram_total');
    e_ram_total.innerHTML= `<span class="fa fa-arrow-circle-right"></span> Memoria total: ${total} MB<br>`
    
    e_ram_total = document.getElementById('ram_consumida');
    e_ram_total.innerHTML= `<span class="fa fa-arrow-circle-right"></span> Memoria consumida: ${enUso} MB`
    
    e_ram_total = document.getElementById('ram_porcentaje');
    let v_porcentaje = enUso / total * 100;
    e_ram_total.innerHTML= `<span class="fa fa-arrow-circle-right"></span> Memoria consumida: ${v_porcentaje.toFixed(2)} %`

    actualizar_data_ram(conta_x_ram++,valor.toFixed(3));
})

/* 
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
            }) * /
        })
    },
    methods: {
        sendMessage() {
            socket.emit('chat message', this.message);
            this.message = '';
        }
    }
}); */