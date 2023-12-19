const express = require('express');
const os = require('os');

const app = express();
const port = 3000;

// Rota para obter informações da CPU
app.get('/info/cpu', (req, res) => {
  const cpuInfo = {
    model: os.cpus()[0].model,
    speed: os.cpus()[0].speed,
    cores: os.cpus().length,
  };

  res.json({ cpuInfo });
});

// Rota para obter informações da GPU AMD (simulação)
app.get('/info/amd-gpu', (req, res) => {
  // Dados simulados da GPU AMD
  const gpuInfo = {
    model: 'AMD Radeon RX 6800',
    memory: '16 GB',
  };

  res.json({ gpuInfo });
});

// Rota para obter informações gerais do sistema
app.get('/info/system', (req, res) => {
  const systemInfo = {
    platform: os.platform(),
    architecture: os.arch(),
    totalMemory: os.totalmem(),
    freeMemory: os.freemem(),
  };

  res.json({ systemInfo });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
