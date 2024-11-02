// ./src/App.js

import React, { useState } from 'react';
import './App.css';
import { computerVision, isConfigured as ComputerVisionIsConfigured } from './azure-cognitiveservices-computervision';

function App() {

  // Estados para armazenar a URL da imagem, a descrição e se está em processamento
  const [fileSelected, setFileSelected] = useState('');
  const [description, setDescription] = useState('');
  const [processing, setProcessing] = useState(false);

  // Função que lida com mudanças no input de URL
  const handleChange = (e) => {
    setFileSelected(e.target.value);
  }

  // Função para enviar a URL para a API e buscar a descrição
  const onFileUrlEntered = async () => {
    if (!fileSelected) {
      alert("Por favor, insira uma URL de imagem.");
      return;
    }

    // Segurar a interface durante o processamento
    setProcessing(true);
    setDescription('');

    try {
      // Chama o serviço Azure Computer Vision
      const response = await computerVision(fileSelected);
      console.log("Resposta completa da Azure:", response); // Log da resposta completa para depuração

      // Verifica se há uma descrição na resposta e exibe corretamente
      if (response && response.description) {
        setDescription(response.description);
      } else {
        setDescription('Nenhuma descrição encontrada para a imagem.');
      }

    } catch (error) {
      console.error('Erro ao buscar a descrição da imagem:', error.message);
      console.error('Erro completo:', error);
      setDescription('Erro ao obter a descrição da imagem.');
    } finally {
      setProcessing(false);
    }
  };

  // Função que renderiza a interface de análise
  const Analyze = () => {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h1>Azure Vision - Descrição da Imagem</h1>
        <div>
          <input
            type="text"
            placeholder="Digite a URL da imagem"
            size="50"
            value={fileSelected}
            onChange={handleChange}
            style={{ padding: '10px', fontSize: '16px' }}
          />
        </div>
        <button
          onClick={onFileUrlEntered}
          style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px' }}
          disabled={processing}
        >
          {processing ? 'Processando...' : 'Obter Descrição'}
        </button>
        <div style={{ marginTop: '20px', fontSize: '18px' }}>
          {description && <p><strong>Descrição da Imagem:</strong> {description}</p>}
        </div>
      </div>
    );
  };

  // Função para exibir uma mensagem caso o Azure não esteja configurado
  const CantAnalyze = () => {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Erro de Configuração</h2>
        <p>Chave e/ou endpoint não estão configurados em ./azure-cognitiveservices-computervision.js.</p>
      </div>
    );
  }

  // Função para determinar o que deve ser renderizado com base na configuração
  function Render() {
    const ready = ComputerVisionIsConfigured();
    return ready ? <Analyze /> : <CantAnalyze />;
  }

  return (
    <div>
      {Render()}
    </div>
  );
}

export default App;
