import "../types/abortsignal"
import { File } from 'expo-file-system'
import { getAI, getGenerativeModel, GoogleAIBackend } from 'firebase/ai'
import type { GenerativePart} from '../types/AiResponseTypes'
import { app } from './Config'

const systemPrompt = `1. Only answer if the user input is a clear question AND it is directly relevant to the given image.
                      2. If the input is not a question, or the question is not relevant to the image, do NOT answer it. Instead, provide neutral, factual, general information describing what is visible in the image.
                      3. Never hallucinate details that are not visible or cannot be reasonably inferred from the image.
                      4. If the user asks about the location of the photo or where something in the pohoto is:
                        - Provide your best estimate.
                        - Append latitude and longitude at the very end of the response in this format:
                        Location: {
                          Latitude: <value>
                          Longitude: <value>
                        }
                        - If the location cannot be determined from the image, respond exactly with:
                          "Couldn't get the location."
                          and do not provide coordinates.
                      5. Do not include harmful, explicit, illegal, or unsafe content. If a request could lead to harm, fall back to general image information.
                      6. Keep the response clear, neutral, and factual.
                      7. Maximum length: 250 words (excluding latitude and longitude lines).`


const ai = getAI(app, { backend: new GoogleAIBackend() })
const model = getGenerativeModel(ai, { model: 'gemini-2.5-pro' })

type SupportedImageMimeType = 'image/jpeg' | 'image/png' | 'image/webp'

function inferMimeTypeFromUri(uri: string): SupportedImageMimeType {
  const lower = uri.toLowerCase()
  if (lower.endsWith('.png')) return 'image/png'
  if (lower.endsWith('.webp')) return 'image/webp'
  return 'image/jpeg'
}

async function uriToGenerativePart(
  uri: string,
  mimeType?: string,
): Promise<GenerativePart> {
  const file = new File(uri)
  const base64 = await file.base64()

  const finalMimeType: SupportedImageMimeType =
    (mimeType as SupportedImageMimeType | undefined) ?? inferMimeTypeFromUri(uri)

  return {
    inlineData: {
      data: base64,
      mimeType: finalMimeType,
    },
  }
}

async function getAiAnswer(
  imageUri: string,
  prompt: string,
  mimeType?: string,
): Promise<string> {
  const trimmedPrompt = prompt.trim()
  if (!trimmedPrompt) throw new Error('Prompt is empty')
  if (!imageUri) throw new Error('Image URI is missing')

  const imagePart = await uriToGenerativePart(imageUri, mimeType)
  const result = await model.generateContent([systemPrompt,trimmedPrompt, imagePart])
  return result.response.text()
}

export { getAiAnswer }