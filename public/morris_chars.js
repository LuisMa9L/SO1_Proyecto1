
var conta_x_cpu = 0;
var data_cpu = [];

var graph_cpu = new Morris.Line({
    // ID del elemento para dibujar la gráfica
    element: 'mi-div-cpu',
    data: data_cpu,
    xkey: 'no',
    ykeys: ['Valor'],
    labels: ['Valor'],
    ymin: 'auto',
    ymax: 'auto',
    parseTime: false,
    hideHover: true,
    pointFillColors: [ '#C9302C'],
    pointStrokeColors: [ '#C9302C'],
    postUnits: ' %'
});

function actualizar_data_cpu(yyy,vvv) {
    // mantener vector con no mas de 30 datos
    if (data_cpu.length > 30) data_cpu.shift();
    data_cpu.push({ no: ""+yyy.toFixed(3), Valor: vvv });
    graph_cpu.setData(data_cpu);
}

// RAM

var conta_x_ram = 0;
var data_ram = [];

var graph_ram = new Morris.Line({
    // ID del elemento para dibujar la gráfica
    element: 'mi-div-ram',
    data: data_ram,
    xkey: 'year',
    ykeys: ['Valor'],
    labels: ['Valor'],
    ymin: 'auto',
    ymax: 'auto',
    parseTime: false,
    hideHover: true,
    pointFillColors: [ '#C9302C'],
    pointStrokeColors: [ '#C9302C'],
    postUnits: ' MB'
});

function actualizar_data_ram(yyy,vvv) {
    // mantener vector con no mas de 30 datos
    if (data_ram.length > 30) data_ram.shift();
    data_ram.push({ year: ""+yyy.toFixed(3), Valor: vvv });
    graph_ram.setData(data_ram);
}