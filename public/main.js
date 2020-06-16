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
    let valor = total - enUso - disponible;
    let e_ram_total = document.getElementById('ram_total');
    e_ram_total.innerHTML= `<span class="fa fa-arrow-circle-right"></span> Memoria total: ${total} MB<br>`
    
    e_ram_total = document.getElementById('ram_consumida');
    e_ram_total.innerHTML= `<span class="fa fa-arrow-circle-right"></span> Memoria consumida: ${valor} MB`
    
    e_ram_total = document.getElementById('ram_porcentaje');
    let v_porcentaje = enUso / total * 100;
    e_ram_total.innerHTML= `<span class="fa fa-arrow-circle-right"></span> Memoria consumida: ${v_porcentaje.toFixed(2)} %`

    actualizar_data_ram(conta_x_ram++,valor.toFixed(3));
})

socket.on('pro tabla', function (msg) { 
    //console.log("hm;vXDXDXD");
    GenerarTabla(msg);
    //console.log("---->",msg);
})
socket.on('pp', function (msg) { 
    
    //console.log("---->",msg);
})

function GenerarTabla(datos) {
    let cont_ejecucion = 0;
    let cont_suspendidos = 0;
    let cont_detenidos = 0;
    let cont_zombi = 0;

    tabla_ht = '<tbody>';
    tabla_ht = `<thead><tr><th>Pid</th><th>Nombre</th><th>Usuario</th><th>Estado</th><th>Ram kB</th><th>Kill</th></tr></thead>`;
    for (let index = 0; index < datos.length; index++) {
        const fila = datos[index];
        
        fila_ht = '';
        let mi_pid = "---";
        for (let indice = 0; indice < fila.length; indice++) {
            const dato = fila[indice];
            if (indice == 0) {
                mi_pid = dato;
            }
            fila_ht += `<td>${dato}</td>`;

            if (indice != 3 ) continue;
            switch (dato) {
                case '(running)':
                    cont_ejecucion++;
                    break;
                case '(sleeping)':
                    cont_suspendidos++;
                    break;
                case '(idle)':
                    cont_detenidos++;
                    break;
                default:
                    cont_zombi++;
                    break;
            }
        }
        fila_ht+= `<td>${GenerarBoton(mi_pid)}</td>`;
        tabla_ht += `<tr>${fila_ht}</tr>`;
    }
    tabla_ht += '</tbody>';

    e_tabla = document.getElementById('mi_tabla');
    e_tabla.innerHTML= tabla_ht;

    // Datos generales de la tabla

    let e_ram_total = document.getElementById('pro_cantidad');
    e_ram_total.innerHTML= `<span class="fa fa-caret-right"></span> Cantidad de procesos: ` + datos.length

    e_ram_total = document.getElementById('pro_ejecucion');
    e_ram_total.innerHTML= `<span class="fa fa-caret-right"></span> Procesos en ejecución:` + cont_ejecucion

    e_ram_total = document.getElementById('pro_suspendidos');
    e_ram_total.innerHTML= `<span class="fa fa-caret-right"></span> Procesos suspendidos:` + cont_suspendidos

    e_ram_total = document.getElementById('pro_detenidos');
    e_ram_total.innerHTML= `<span class="fa fa-caret-right"></span> Procesos detenidos:` + cont_detenidos

    e_ram_total = document.getElementById('pro_zombie');
    e_ram_total.innerHTML= `<span class="fa fa-caret-right"></span> Procesos zombie:` + cont_zombi
}

function GenerarBoton(pid) {
    return `<a href="killer?idUs=${pid}"><button>KILL</button></a>`
}


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