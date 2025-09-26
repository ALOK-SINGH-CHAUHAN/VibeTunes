const { GoogleGenerativeAI } = require('@google/generative-ai');

// Test script for Gemini API
async function testGemini() {
  try {
    console.log('Testing Gemini API...');
    
    // Check if API key is available
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.log('❌ GEMINI_API_KEY not found in environment variables');
      return;
    }
    
    console.log('✓ API Key found');
    
    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Try different model names
    const modelsToTry = [
      'gemini-1.5-flash',
      'gemini-1.5-pro', 
      'gemini-pro',
      'gemini-1.0-pro'
    ];
    
    for (const modelName of modelsToTry) {
      try {
        console.log(`\n🔄 Testing model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        
        // Simple test
        const result = await model.generateContent("Hello! Please respond with 'working'");
        const response = result.response.text();
        
        console.log(`✅ Model ${modelName} works! Response:`, response.trim());
        
        // Test mood interpretation
        const moodResult = await model.generateContent(
          "Extract 3 search terms for music from this mood: 'happy workout'. Respond with JSON array only."
        );
        const moodResponse = moodResult.response.text();
        
        console.log(`✅ Mood interpretation with ${modelName}:`, moodResponse.trim());
        
        console.log(`\n🎉 Gemini API test successful with model: ${modelName}!`);
        return;
        
      } catch (modelError) {
        console.log(`❌ Model ${modelName} failed:`, modelError.message);
        continue;
      }
    }
    
    console.log('\n❌ All models failed');
    
  } catch (error) {
    console.error('❌ Gemini API test failed:', error.message);
  }
}

testGemini();