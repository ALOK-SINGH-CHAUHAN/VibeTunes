import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function GET() {
  try {
    console.log('Testing Gemini API connection...')
    console.log('API Key:', process.env.GEMINI_API_KEY ? '✓ Configured' : '✗ Missing')
    
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'Gemini API key not configured',
        config: {
          apiKey: process.env.GEMINI_API_KEY ? '✓' : '✗'
        }
      }, { status: 400 })
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    
    console.log('✓ Gemini AI model initialized')
    
    // Test a simple prompt
    const testPrompt = "Return a JSON array with 3 music genres: ['rock', 'jazz', 'classical']"
    const result = await model.generateContent(testPrompt)
    const responseText = result.response.text()
    
    console.log('✓ Gemini API response received')
    console.log('Response:', responseText)
    
    // Test mood interpretation
    const moodPrompt = `Extract 3 search terms for music from this mood: "happy workout". Respond with JSON array only.`
    const moodResult = await model.generateContent(moodPrompt)
    const moodResponse = moodResult.response.text()
    
    console.log('✓ Mood interpretation test completed')
    
    let searchTerms = []
    try {
      const cleanResponse = moodResponse.trim().replace(/^```json\n?/, '').replace(/\n?```$/, '')
      searchTerms = JSON.parse(cleanResponse)
    } catch (parseError) {
      console.log('Could not parse mood response as JSON:', moodResponse)
      searchTerms = ['happy', 'workout', 'energy'] // fallback
    }
    
    return NextResponse.json({
      success: true,
      message: 'Gemini API integration working correctly',
      config: {
        apiKey: '✓ Configured'
      },
      model: '✓ Initialized',
      testPrompt: {
        input: testPrompt,
        response: responseText
      },
      moodInterpretation: {
        input: 'happy workout',
        extractedTerms: searchTerms,
        rawResponse: moodResponse
      }
    })
    
  } catch (error) {
    console.error('❌ Gemini API test failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      config: {
        apiKey: process.env.GEMINI_API_KEY ? '✓' : '✗'
      }
    }, { status: 500 })
  }
}