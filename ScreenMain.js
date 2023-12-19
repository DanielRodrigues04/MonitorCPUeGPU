const blessed = require('blessed');
const contrib = require('blessed-contrib');
const fetch = require('node-fetch');

const screen = blessed.screen();

const grid = new contrib.grid({ rows: 1, cols: 2, screen });

const tableCPU = grid.set(0, 0, 1, 1, contrib.table, {
  label: 'Informações da CPU',
  keys: true,
  fg: 'white',
  selectedFg: 'white',
  selectedBg: 'green',
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
    const responseCPU = await fetch('http://localhost:3000/info/cpu');
    const cpuData = await responseCPU.json();

    let gpuData = { gpuInfo: {} };

    const responseGPU = await fetch('http://localhost:3000/info/amd-gpu');
    const rawData = await responseGPU.json();

    if (rawData && rawData.gpuInfo) {
      gpuData = rawData;
    }

    if (cpuData && cpuData.cpuInfo) {
      const cpuInfoFormatted = Object.entries(cpuData.cpuInfo).map(([key, value]) => [key, value]);
      tableCPU.setData({ headers: ['Atributo', 'Valor'], data: cpuInfoFormatted });
    } else {
      tableCPU.setData({ headers: ['Atributo', 'Valor'], data: [['N/A', 'N/A']] });
    }

    if (gpuData.gpuInfo && Object.keys(gpuData.gpuInfo).length > 0) {
      const gpuInfoFormatted = Object.entries(gpuData.gpuInfo).map(([key, value]) => [key, value]);
      tableGPU.setData({ headers: ['Atributo', 'Valor'], data: gpuInfoFormatted });
    } else {
      tableGPU.setData({ headers: ['Atributo', 'Valor'], data: [['N/A', 'N/A']] });
    }

    screen.render();
  } catch (error) {
    console.error('Erro:', error);
  }
};

setInterval(updateSystemInfo, 2000);
updateSystemInfo();

screen.key(['q', 'C-c'], () => {
  return process.exit(0);
});

screen.render();
