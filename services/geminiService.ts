import { GoogleGenAI, Type, Modality } from "@google/genai";
import { VocabWord } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Text Generation ---

export const generateVocabulary = async (topic: string): Promise<VocabWord[]> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Generate a list of 6 English vocabulary words suitable for a Korean Middle School Year 1 student (Grade 7) related to the topic: "${topic}".
    For each word, provide:
    1. The English word.
    2. A simple phonetic guide (e.g., [apple]).
    3. The Korean meaning (definition).
    4. A simple example sentence using the word.
    5. The Korean translation of the example sentence.
    
    Ensure the difficulty level is appropriate for beginners/intermediate learners (CEFR A1/A2).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            word: { type: Type.STRING },
            pronunciation: { type: Type.STRING },
            meaning: { type: Type.STRING },
            exampleSentence: { type: Type.STRING },
            exampleTranslation: { type: Type.STRING },
          },
          required: ["word", "pronunciation", "meaning", "exampleSentence", "exampleTranslation"],
        },
      },
    },
  });

  if (response.text) {
    return JSON.parse(response.text) as VocabWord[];
  }
  return [];
};

// --- TTS Logic ---

// Helper to decode base64
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Helper to decode audio data
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

let audioContext: AudioContext | null = null;

export const playPronunciation = async (text: string) => {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }

    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // 'Kore' is usually good for clear enunciation
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!base64Audio) {
      console.error("No audio data received");
      return;
    }

    const audioBuffer = await decodeAudioData(
      decode(base64Audio),
      audioContext,
      24000,
      1,
    );

    const outputNode = audioContext.createGain();
    outputNode.gain.value = 1.0; 
    outputNode.connect(audioContext.destination);

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(outputNode);
    source.start();

  } catch (error) {
    console.error("TTS Error:", error);
  }
};