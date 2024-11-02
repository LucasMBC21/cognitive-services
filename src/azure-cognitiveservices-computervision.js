// ./src/azure-cognitiveservices-computervision.js

// Azure SDK client libraries
import { ComputerVisionClient } from '@azure/cognitiveservices-computervision';
import { ApiKeyCredentials } from '@azure/ms-rest-js';

// Authentication requirements
const key = process.env.REACT_APP_AZURE_COMPUTER_VISION_KEY;
const endpoint = process.env.REACT_APP_AZURE_COMPUTER_VISION_ENDPOINT;

// Verificação de configuração
export const isConfigured = () => {
    const result = (key && endpoint && key.length > 0 && endpoint.length > 0);
    console.log(`ComputerVision isConfigured = ${result}`);
    return result;
}

// Analisar Imagem a partir da URL
export const computerVision = async (url) => {
    // Autenticar com o serviço da Azure
    const computerVisionClient = new ComputerVisionClient(
        new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }), 
        endpoint
    );

    try {
        // Analisar a imagem para obter a descrição
        const analysis = await computerVisionClient.analyzeImage(url, { visualFeatures: ["Description"] });

        // Retornar apenas a descrição encontrada
        if (analysis.description && analysis.description.captions.length > 0) {
            return { description: analysis.description.captions[0].text };
        } else {
            return { description: 'Nenhuma descrição encontrada para a imagem.' };
        }
    } catch (error) {
        console.error('Erro ao analisar a imagem:', error);
        throw new Error('Erro ao analisar a imagem.');
    }
}
