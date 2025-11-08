const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Dados dos sensores
let sensorData = [];
let lightsState = {
  sala: false,
  quarto1: false, 
  quarto2: false,
  quarto3: false,
  corredor: false,
  cozinha: false,
  banheiro: false
};

app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 Servidor ESP32 Online!',
    status: 'funcionando',
    time: new Date().toLocaleString('pt-BR')
  });
});

// ESP32 envia dados de temperatura
app.post('/api/data', (req, res) => {
  const { temperature, humidity, device } = req.body;

  const newData = {
    temperature,
    humidity,
    device,
    timestamp: new Date().toLocaleString('pt-BR')
  };

  sensorData.unshift(newData);
  if (sensorData.length > 50) sensorData = sensorData.slice(0, 50);

  console.log('📨 Dados recebidos:', newData);
  res.json({ status: 'OK', message: 'Dados salvos!' });
});

// ESP32 busca estado das luzes
app.get('/api/lights', (req, res) => {
  res.json({ lights: lightsState });
});

// Interface web controla luzes
app.post('/api/lights', (req, res) => {
  const { comodo, estado } = req.body;
  
  if (lightsState.hasOwnProperty(comodo)) {
    lightsState[comodo] = estado;
    console.log(`💡 ${comodo}: ${estado ? 'LIGADA' : 'DESLIGADA'}`);
    res.json({ status: 'OK', comodo, estado });
  } else {
    res.status(400).json({ error: 'Cômodo não encontrado' });
  }
});

// Ver dados coletados
app.get('/api/data', (req, res) => {
  res.json({ data: sensorData });
});

app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando na porta ${PORT}`);
});
