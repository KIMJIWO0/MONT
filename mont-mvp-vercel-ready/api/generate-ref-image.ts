import type { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "허용되지 않은 요청입니다.",
    });
  }

  try {
    const rawPrompt =
      typeof req.body?.prompt === "string" ? req.body.prompt.trim() : "";

    if (!rawPrompt) {
      return res.status(400).json({
        success: false,
        error: "생성 설명을 입력해주세요.",
      });
    }

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "MY_OPENAI_API_KEY") {
      return res.status(500).json({
        success: false,
        error: "OPENAI_API_KEY가 설정되지 않았습니다.",
      });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const translation = await openai.chat.completions.create({
      model: "gpt-5.1-mini",
      messages: [
        {
          role: "system",
          content:
            "Translate and expand the user's Korean or English scene description into a concise English prompt for a photorealistic cinematic image generator. Preserve the user's meaning exactly. Do not add unrelated people, animals, locations, logos, or text. Output only the English prompt.",
        },
        {
          role: "user",
          content: rawPrompt,
        },
      ],
    });

    const translatedPrompt =
      translation.choices?.[0]?.message?.content?.trim() || rawPrompt;

    const finalPrompt = `
Create a realistic cinematic filming reference image.

Scene:
${translatedPrompt}

Requirements:
photorealistic,
cinematic composition,
realistic camera framing,
accurate subject,
accurate location,
accurate number of people,
accurate camera shot type,
natural lighting,
16:9 widescreen composition,
no text overlay,
no logo,
no watermark.
`;

    const image = await openai.images.generate({
      model: "gpt-image-2",
      prompt: finalPrompt,
      size: "1536x1024",
    });

    const b64 = image.data?.[0]?.b64_json;

    if (!b64) {
      throw new Error("OpenAI 이미지 데이터가 반환되지 않았습니다.");
    }

    return res.status(200).json({
      success: true,
      imageUrl: `data:image/png;base64,${b64}`,
      originalPrompt: rawPrompt,
      translatedPrompt,
      promptUsed: finalPrompt,
      model: "gpt-image-2",
    });
  } catch (error: unknown) {
    console.error("OpenAI image generation failed:", error);
    const message =
      error instanceof Error
        ? error.message
        : "AI 이미지 생성에 실패했습니다. API 설정을 확인해주세요.";

    return res.status(500).json({
      success: false,
      error: message,
    });
  }
}
