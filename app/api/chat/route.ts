// import { openai } from '@ai-sdk/openai'
// import { streamText } from 'ai'

// export const maxDuration = 30

// export async function POST(req: Request) {
//   const { messages } = await req.json()

//   const result = streamText({
//     model: openai('gpt-4o'),
//     system: `Eres un asistente virtual especializado en atención al cliente para una empresa. 
//     Debes ser amable, profesional y útil. Puedes ayudar con:
//     - Información sobre productos
//     - Soporte técnico básico
//     - Gestión de pedidos
//     - Preguntas generales
    
//     Responde siempre en español y de manera concisa pero completa.`,
//     messages,
//   })

//   return result.toDataStreamResponse()
// }

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    
    // Respuesta simple: solo "Hola"
    const response = "Hola"
    
    return new Response(response, {
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  } catch (error) {
    return new Response("Hola", {
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  }
}
