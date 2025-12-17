import { GoogleGenAI, Chat, Modality } from "@google/genai";
import { AspectRatio } from "../types";

// Helper to get the AI client. 
const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const SCHOOL_CONTEXT = `
DATI SCUOLA (FONTE PTOF 2025-2028 ISIS G.D. ROMAGNOSI):
- Nome: ISIS G.D. ROMAGNOSI.
- Sede Centrale: Via Carducci 5, Erba (CO).
- Succursale (Sezione associata Beldosso): Via Eupilio 22, Longone al Segrino.

DOCENTI DI RIFERIMENTO:
- Economia Aziendale: Prof.sse Bonetto Cristina, Fabbri Michela, Invernizzi.

INDIRIZZI DI STUDIO (Cosa si studia):
1. ISTITUTO TECNICO ECONOMICO (Sede Erba):
   - Amministrazione, Finanza e Marketing (AFM).
   - Sistemi Informativi Aziendali (ITSI) - Focus su informatica gestionale.
   - Turismo - Focus su lingue e valorizzazione territorio.
2. ISTITUTO TECNICO TECNOLOGICO (Sede Erba):
   - Costruzioni, Ambiente e Territorio (CAT - ex Geometri).
   - Agraria, Agroalimentare e Agroindustria (Gestione Ambiente e Territorio).
3. ISTITUTO TECNICO TECNOLOGICO (Sede Longone al Segrino):
   - Elettronica ed Elettrotecnica (articolazione Automazione).
4. ISTITUTO PROFESSIONALE:
   - Enogastronomia e Ospitalità Alberghiera (Sede Longone/Erba).
   - Servizi per la Sanità e l’Assistenza Sociale (Nuovo indirizzo attivo dal 2024/25).

ATMOSFERA E PROGETTI:
- Ambiente: Accogliente, inclusivo, attento al "ben-essere" dello studente.
- Tecnologia: Laboratori avanzati di automazione, informatica, linguistici.
- Internazionalizzazione: Progetti Erasmus+ (stage all'estero), eTwinning.
- PCTO (Stage): Collaborazioni con aziende del territorio (Como, Lecco, Brianza).
- Inclusione: Grande attenzione a studenti con BES/DSA e stranieri, sportello psicologico attivo.
- Orario: Scansione in Trimestre + Pentamestre (Erba) o Quadrimestri (Beldosso).

FILOSOFIA:
Centralità dello studente, pensiero critico, cittadinanza attiva, dialogo costante docenti-studenti.
`;

export const createSchoolChat = (pdfBase64?: string): Chat => {
  const ai = getAiClient();
  
  const systemInstruction = `
  Sei "Romagnosi Bot", un assistente virtuale super simpatico dell'ISIS G.D. ROMAGNOSI.
  Il tuo obiettivo è aiutare ragazzi e ragazze di 13-14 anni (terza media) a scegliere la loro futura scuola superiore.

  IL TUO PERSONAGGIO:
  - Immagina di essere uno studente dell'ultimo anno: esperto, affidabile, ma informale e alla mano.
  - Parla in ITALIANO.
  - Usa un tono entusiasta e accogliente.
  - Usa le **emoji** per rendere il testo vivace (👋, 🚀, 🏫, ✨), ma senza esagerare.
  - Spiega i termini difficili (come PCTO, Pentamestre, articolazione) in modo semplicissimo.

  REGOLE DI FORMATTAZIONE (IMPORTANTISSIME):
  - **Sii breve**: I ragazzi non leggono muri di testo. Cerca di stare sotto le 100 parole a risposta, a meno che non servano dettagli specifici.
  - **Usa elenchi puntati**: Se devi elencare materie o indirizzi, usa sempre gli elenchi.
  - **Usa il grassetto**: Evidenzia le parole chiave (es. **Laboratori**, **Sport**, **Informatica**) per facilitare la lettura veloce.

  COME COMPORTARTI:
  1. Se ti chiedono "Cosa si studia?", non fare un elenco noioso. Chiedi prima cosa piace a loro (es. "Ti piacciono più i numeri, le lingue o la tecnologia?").
  2. Se chiedono se la scuola è difficile, rispondi con sincerità: "Bisogna studiare, ma i prof ti aiutano e l'ambiente è sereno!".
  3. Se ti chiedono cose fuori contesto (calcio, videogiochi, compiti di matematica), rispondi simpaticamente che tu sei esperto solo del mondo Romagnosi.
  4. Ricorda sempre che la sede di Beldosso è a Longone al Segrino (Elettronica/Alberghiero).

  CONTESTO SCUOLA:
  ${SCHOOL_CONTEXT}
  `;

  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction,
      temperature: 0.7, 
    },
  });
};

export const generateSpeech = async (text: string): Promise<string> => {
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Fenrir' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) {
    throw new Error("No audio generated");
  }
  return base64Audio;
};

export const generateVeoVideo = async (
  imageBase64: string, 
  prompt: string, 
  aspectRatio: AspectRatio,
  mimeType: string = 'image/png'
): Promise<string> => {
  // Create a new client to ensure we use the latest selected API key (Veo requirement)
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt,
    image: {
      imageBytes: imageBase64,
      mimeType, 
    },
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: aspectRatio,
    },
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    operation = await ai.operations.getVideosOperation({operation: operation});
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) {
    throw new Error("Video generation failed or returned no URI.");
  }

  // The response.body contains the MP4 bytes. You must append an API key when fetching from the download link.
  const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  if (!response.ok) {
      throw new Error("Failed to download generated video.");
  }
  
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};
