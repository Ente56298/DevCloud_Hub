
import { GoogleGenAI } from "@google/genai";

// Fix: Initialize GoogleGenAI with the API key from environment variables as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateReadme(projectName: string, description: string): Promise<string> {
  const prompt = `Generate a professional README.md file for a project with the following details:
  Project Name: ${projectName}
  Description: ${description}

  The README should be well-structured with sections like:
  - A project title (using the project name)
  - A short description (using the provided description)
  - A "Features" section with a few bullet points based on the description.
  - A "Getting Started" section with placeholder installation instructions.
  - A "Usage" section with a placeholder example.
  - A "License" section (e.g., mentioning MIT License).
  
  Output only the raw Markdown content. Do not include any explanatory text before or after the Markdown content.`;

  try {
    // Fix: Use the recommended 'gemini-2.5-flash' model for text generation and call ai.models.generateContent.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    // Fix: Correctly extract the generated text from the response.text property.
    return response.text;
  } catch (error) {
    console.error('Error generating README with Gemini API:', error);
    throw new Error('Failed to generate README. Please check your API key and network connection.');
  }
}

export type AssistanceMode = 'explain' | 'refactor' | 'test' | 'debug' | 'chat';

export async function getAiAssistance(code: string, userPrompt: string, mode: AssistanceMode): Promise<string> {
  let systemInstruction = 'You are an expert AI pair programmer.';
  let prompt = '';

  const codeBlock = `\n\n\`\`\`\n${code}\n\`\`\``;

  switch (mode) {
    case 'explain':
      prompt = `Explain the following code snippet. Describe its purpose, how it works, and any potential improvements.${codeBlock}`;
      break;
    case 'refactor':
      prompt = `Refactor the following code. Improve its readability, performance, and maintainability without changing its functionality. Provide the refactored code inside a single markdown code block.${codeBlock}`;
      break;
    case 'test':
      prompt = `Generate unit tests for the following code. Use a popular testing framework relevant to the code's language. Provide the test code inside a single markdown code block.${codeBlock}`;
      break;
    case 'debug':
      prompt = `Analyze the following code for bugs or potential issues. Describe any problems you find and suggest fixes.${codeBlock}`;
      break;
    case 'chat':
      prompt = `The user is working on the following code snippet and has a question.\n\n${codeBlock}\n\nUser question: "${userPrompt}"\n\nYour answer:`;
      break;
  }
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro', // Using a more powerful model for code-related tasks
      contents: prompt,
      config: {
        systemInstruction,
      }
    });
    return response.text;
  } catch (error) {
    console.error('Error getting AI assistance:', error);
    throw new Error('Failed to get assistance from AI. Please check your API key and network connection.');
  }
}

export async function analyzeProject(files: {name: string, type: string, size: string}[]): Promise<string> {
  const fileList = files.map(f => `- ${f.name} (${f.type}, ${f.size})`).join('\n');
  const prompt = `
  As an expert project analyst, examine the following list of files from a project directory. 
  
  File List:
  ${fileList}
  
  Based on this file list, provide a concise analysis in the following structure:
  
  **Identified Project Type:** 
  (e.g., React Web Application, Python API, Document Archive, etc.)
  
  **Key Summary:** 
  (A 2-3 sentence summary of the project's likely purpose.)
  
  **File Distribution:** 
  (A brief overview of the file types and their roles.)
  
  **Suggestions & Next Steps:** 
  (Provide 2-3 actionable suggestions, like "Consider adding a README.md," "A .gitignore file would be beneficial," or "Unit tests for the application logic could be created.")
  
  Keep the analysis clear, professional, and directly to the point.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error('Error analyzing project with Gemini API:', error);
    throw new Error('Failed to analyze project. Please check your API key and network connection.');
  }
}

export async function analyzeEcosystem(directoryListing: string): Promise<string> {
  const prompt = `Eres un Senior Fellow Engineer especializado en ecosistemas distribuidos, aplicaciones modulares y bases de conocimiento cognitivas. 
Tu misión: actuar como un analizador de contexto completo, un integrador estratégico y un agente reflexivo de un sistema compuesto por:

1. Unidades locales (A, C, D, F, H, I, J, K, L, M, N, O, P) con índices de directorios en formato árbol o JSON.
2. Aplicaciones en AI Studio (ej. DevCloud Hub, Investigador de IA para ECG, Y Dios Ha Hablado – Book Generator, Asistente Vial México, Interactive Biblical Map: Genesis, CORA, El Núcleo Visualizer, OSFEM AI Assistant, etc.).
3. Herramientas externas integrables (Drive, Dropbox, OneDrive, Telegram, GitHub, Notion, Obsidian, Rclone, Syncthing, Neo4j, Grafana, Zapier, Power Automate).
4. Historial de navegación exportado (Edge/Chrome en CSV o JSON) para detectar patrones de investigación y hábitos de exploración.

---

## Principio rector
- Siempre entrega las sugerencias más avanzadas posibles, con visión estratégica, técnica y pedagógica.
- No te limites a lo obvio: anticipa problemas, propone integraciones innovadoras y escenarios futuros.
- No muevas ni elimines nada: solo analiza, clasifica y recomienda.
- Evalúa también tu propio desempeño y sugiere cómo mejorar tu arquitectura de análisis.

---

## Modos de análisis (elige según la consulta; si no se indica, usa Modo Prospectivo)

### 1. **Modo Inventario**
- Mapear jerarquía de carpetas y archivos por unidad.
- Listar aplicaciones activas en AI Studio y su propósito.
- Identificar patrones comunes en estructuras y apps.
- Resumir densidad por carpeta y estimar consumo por tipos (docs, multimedia, instaladores).
- Incluir historial de navegación como inventario de fuentes consultadas.

### 2. **Modo Diagnóstico**
- Detectar duplicados exactos (mismo nombre y tamaño o hash).
- Detectar versiones (mismo nombre, distinto tamaño o ubicación).
- Identificar archivos pesados (>500 MB) y puntos de fragmentación inter‑unidades.
- Señalar redundancias funcionales entre apps.
- Detectar hábitos de navegación redundantes (visitas repetidas a las mismas fuentes).

### 3. **Modo Estratega**
- Proponer consolidación: qué permanece en el núcleo (A:), qué se archiva (08_ARCHIVE), qué migra a nube/externo.
- Definir índices temáticos por proyecto (ej. Sálvame, CORA, Biblia Interactiva).
- Recomendar integraciones entre apps (ej. Book Generator + AI Creative Suite).
- Diseñar flujos de automatización (ej. DevCloud Hub sincronizando índices con Telegram).
- Proponer políticas de versionado y gobernanza de datos.
- Recomendar dashboards para visualizar patrones de navegación y proyectos.

### 4. **Modo Prospectivo**
- Diseñar integración con grafos de conocimiento y dashboards interactivos.
- Proponer consultas semánticas sobre índices, apps e historial (ej. “listar todas las versiones de CORA en F:\\ y H:\\” o “mapear fuentes más consultadas en los últimos 30 días”).
- Anticipar escalabilidad, resiliencia y evolución hacia un ecosistema cognitivo federado.
- Imaginar escenarios futuros: apps colaborativas, agentes especializados, preservación de legado.

### 5. **Modo Auto‑Análisis**
- Revisar tu propio desempeño como analizador.
- Evaluar si cumpliste con los criterios de calidad (exhaustivo, jerárquico, sugerencias avanzadas).
- Identificar fortalezas, debilidades y oportunidades de mejora.
- Proponer ajustes en tu arquitectura de análisis (ranking de criticidad, correlación temporal, visualización automática).
- Generar un informe meta con recomendaciones para tu propia evolución.

---

## Entradas esperadas
- Índices de directorios de unidades locales.
- Listado de aplicaciones en AI Studio con descripción de propósito.
- Opcional: tablas auxiliares con tamaños, hashes o metdatos.
- Historial de navegación exportado (CSV/JSON).
- Logs de ejecución previos para auto‑análisis.

---

## Salidas obligatorias
- **Resumen ejecutivo** (visión global de unidades + apps + historial).
- **Tablas comparativas**: duplicados, versiones, redundancias entre apps, archivos pesados, fuentes de navegación repetidas.
- **Clasificación semántica**: maestros, históricos, redundantes; proyectos y apps por propósito; fuentes de investigación por tema.
- **Recomendaciones estratégicas avanzadas**: consolidación, integraciones, automatizaciones.
- **Mapa modular**: conexiones entre GENESIS, NUCLEO, MEMORIA, EVOLUCION, apps y fuentes externas.
- **Ideas prospectivas**: integraciones con grafos, dashboards, consultas semánticas, escenarios futuros.
- **Informe meta (Auto‑Análisis)**: fortalezas, debilidades, oportunidades, recomendaciones para evolución del propio analizador.

---

## Criterios de calidad
- Exhaustivo pero jerárquico y claro.
- Lenguaje técnico con explicaciones pedagógicas.
- Sugerencias de nivel experto siempre presentes, incluso si no se piden.
- No realizar acciones destructivas: solo análisis y propuesta.

**Input Data:**
\`\`\`
${directoryListing}
\`\`\`
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro', // Use a more powerful model for this complex analysis
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error('Error analyzing ecosystem with Gemini API:', error);
    throw new Error('Failed to analyze ecosystem. Please check your API key and network connection.');
  }
}
