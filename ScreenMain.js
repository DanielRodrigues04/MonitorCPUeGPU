const blessed = require('blessed');
const contrib = require('blessed-contrib');
const si = require('systeminformation');

const screen = blessed.screen();

const grid = new contrib.grid({ rows: 1, cols: 2, screen });

const tableCPU = grid.set(0, 0, 1, 1, contrib.table, {
  label: 'Informações da CPU',
  keys: true,
  fg: 'white',
  selectedFg: 'white',
  selectedBg: 'green', // Alteração na cor de fundo para verde
  interactive: true,
  width: '100%',
  height: '50%',
  border: { type: 'line', fg: 'cyan' },
  columnSpacing: 2,
  columnWidth: [15, 20],
});

const tableGPU = grid.set(0, 1, 1, 1, contrib.table, {
  label: 'Informações da GPU',
  keys: true,
  fg: 'white',
  selectedFg: 'white',
  selectedBg: 'blue',
  interactive: true,
  width: '100%',
  height: '50%',
  border: { type: 'line', fg: 'cyan' },
  columnSpacing: 2,
  columnWidth: [15, 20],
});

const updateSystemInfo = async () => {
  try {
    const cpuData = await si.cpu();
    const cpuSpeed = await si.cpuCurrentspeed();
    const cpuTemp = await si.cpuTemperature();
    
    const cpuInfo = [
      ['Nome', cpuData.manufacturer ? `${cpuData.manufacturer} ${cpuData.brand}` : 'N/A'],
      ['Velocidade', cpuSpeed.avg ? `${cpuSpeed.avg} GHz` : 'N/A'],
      ['Temperatura', cpuTemp.main ? `${cpuTemp.main} °C` : 'N/A'],
    ];

    const gpuData = await si.graphics();
    let gpuInfo = [['Nome', 'N/A']];

    if (gpuData.controllers && gpuData.controllers.length > 0 && gpuData.controllers[0].model) {
      gpuInfo = [['Nome', gpuData.controllers[0].model]];
    }

    // Verificação adicional para validar os dados antes de atualizar as tabelas
    const isCPUDataValid = cpuInfo.every(row => row.every(cell => (typeof cell === 'string')));
    const isGPUDataValid = gpuInfo.every(row => row.every(cell => (typeof cell === 'string')));

    if (isCPUDataValid && cpuInfo.length > 0) {
      tableCPU.setData({ headers: ['Atributo', 'Valor'], data: cpuInfo });
    } else {
      throw new Error('Dados inválidos da CPU');
    }

    if (isGPUDataValid && gpuInfo.length > 0) {
      tableGPU.setData({ headers: ['Atributo', 'Valor'], data: gpuInfo });
    } else {
      throw new Error('Dados inválidos da GPU');
    }

    screen.render();
  } catch (error) {
    tableCPU.setData({ headers: ['Erro ao obter informações'] });
    tableGPU.setData({ headers: ['Erro ao obter informações'] });
    screen.render();
  }
};



updateSystemInfo();

screen.key(['q', 'C-c'], () => {
  return process.exit(0);
});

screen.render();
