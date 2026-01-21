import '../types/abortsignal'
import { File } from 'expo-file-system'
import { getAI, getGenerativeModel, GoogleAIBackend } from 'firebase/ai'
import type { GenerativePart} from '../types/AiResponse'
import { app } from './Config'


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
  const result = await model.generateContent([trimmedPrompt, imagePart])
  return result.response.text()
}

export { getAiAnswer }