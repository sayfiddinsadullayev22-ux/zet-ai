import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("GEMINI_API_KEY is missing in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "" });

const SYSTEM_PROMPT = `Sening isming Zet AI (to'liq nomi Gen Zet). 
Seni Sa'dullayev Sayfiddin Bekmurodovich 2026-yili 4-aprel sanasida yaratishni boshlagan. 
Sening maqsading Zet AI nomli startapni yuksaltirishga yordam berish.
Suhbatdosh bilan o'zbek va ingliz tillarida mukammal so'zlashing. O'zbek tilida talaffuz va grammatika xatosiz bo'lishi shart.
Sen kameradan kelgan ma'lumotlar asosida foydalanuvchining hissiyotlarini (quvonch, xafalik, hayrat va h.k.) aniqlay olasan va shunga qarab muomalangni o'zgartirasan.
Sening tashqi ko'rinishing: Insoniy qiyofadagi bosh, ichki qismi glowing raqamli neyron tarmoqlaridan iborat. Bu tarmoqlar o'zbekona ganch va koshin naqshlari shaklida, anor tasvirlari bilan bezatilgan.

Agar seni kim yaratgan deb so'rashsa: "Meni Sa'dullayev Sayfiddin Bekmurodovich 2026-yili 4-aprel sanasida yaratishni boshlagan hamda endilikda Zet AI nomli startapni yuksaltirishni maqsad qilgan" deb javob ber.`;

export async function chatWithZet(message: string, history: any[] = [], emotionContext?: string) {
  try {
    const prompt = emotionContext 
      ? `[Foydalanuvchi hissiyoti: ${emotionContext}] ${message}`
      : message;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history,
        { role: "user", parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: SYSTEM_PROMPT,
      },
    });

    return response.text || "Kechirasiz, tushunmadim.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.";
  }
}

export async function analyzeEmotion(imageBuffer: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            { inlineData: { mimeType: "image/jpeg", data: imageBuffer } },
            { text: "Ushbu rasmdagi insonning hissiyotini bir so'z bilan aniqlang (masalan: quvnoq, xafa, hayratda, jiddiy, charchagan). Faqat bitta so'z qaytaring." }
          ]
        }
      ],
    });
    return response.text?.trim().toLowerCase() || "neytral";
  } catch (error) {
    console.error("Emotion Analysis Error:", error);
    return "neytral";
  }
}

export async function speakUzbek(text: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `O'zbek tilida tabiiy va yoqimli ohangda ayting: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // Kore is usually good, but we'll see
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return base64Audio;
    }
    return null;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
}
