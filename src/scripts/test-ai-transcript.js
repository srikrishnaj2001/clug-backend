'use strict';

require('dotenv').config();
const geminiService = require('../services/gemini');

async function testAITranscript() {
  console.log('🧪 Testing AI Transcript Service...\n');

  // Check if API key is configured
  if (!process.env.GEMINI_API_KEY) {
    console.log('❌ GEMINI_API_KEY not found in environment variables');
    console.log('💡 Please add GEMINI_API_KEY to your .env file');
    return;
  }

  console.log('✅ GEMINI_API_KEY found in environment');

  // Test 1: Get transcript info
  console.log('\n📋 Test 1: Getting transcript info for video ID 70...');
  try {
    const infoResult = await geminiService.getTranscriptInfo('70');
    if (infoResult.success) {
      console.log('✅ Transcript info retrieved successfully');
      console.log(`   Title: ${infoResult.data.title}`);
      console.log(`   Word count: ${infoResult.data.wordCount}`);
      console.log(`   Character count: ${infoResult.data.characterCount}`);
    } else {
      console.log('❌ Failed to get transcript info:', infoResult.message);
      return;
    }
  } catch (error) {
    console.log('❌ Error getting transcript info:', error.message);
    return;
  }

  // Test 2: Ask a simple question
  console.log('\n❓ Test 2: Asking a question about the video...');
  try {
    const questionResult = await geminiService.askGeminiWithTranscript(
      'What are the main topics covered in this video?', 
      '70'
    );
    
    if (questionResult.success) {
      console.log('✅ Question answered successfully');
      console.log(`   Question: ${questionResult.data.question}`);
      console.log(`   Answer: ${questionResult.data.answer.substring(0, 200)}...`);
      console.log(`   Processing time: ${questionResult.data.timestamp}`);
    } else {
      console.log('❌ Failed to answer question:', questionResult.message);
    }
  } catch (error) {
    console.log('❌ Error asking question:', error.message);
  }

  // Test 3: Test with invalid video ID
  console.log('\n🚫 Test 3: Testing with invalid video ID...');
  try {
    const invalidResult = await geminiService.askGeminiWithTranscript(
      'What is this about?', 
      'invalid-id'
    );
    
    if (!invalidResult.success && invalidResult.statusCode === 404) {
      console.log('✅ Correctly handled invalid video ID');
      console.log(`   Error message: ${invalidResult.message}`);
    } else {
      console.log('❌ Unexpected result for invalid video ID');
    }
  } catch (error) {
    console.log('❌ Error testing invalid video ID:', error.message);
  }

  // Test 4: Test with empty question
  console.log('\n❌ Test 4: Testing with empty question...');
  try {
    const emptyResult = await geminiService.askGeminiWithTranscript('', '70');
    
    if (!emptyResult.success && emptyResult.statusCode === 400) {
      console.log('✅ Correctly handled empty question');
      console.log(`   Error message: ${emptyResult.message}`);
    } else {
      console.log('❌ Unexpected result for empty question');
    }
  } catch (error) {
    console.log('❌ Error testing empty question:', error.message);
  }

  console.log('\n🎉 AI Transcript testing completed!');
  console.log('\n📝 API Endpoints to test:');
  console.log('   POST /ai-transcript/ask');
  console.log('   GET  /ai-transcript/info/:videoId');
  console.log('   GET  /ai-transcript/available');
  console.log('   POST /ai-transcript/batch-ask');
  
  console.log('\n🔧 Example API calls:');
  console.log('   curl -X POST http://localhost:8008/ai-transcript/ask \\');
  console.log('     -H "Content-Type: application/json" \\');
  console.log('     -d \'{"question": "What are the main topics?", "videoId": "70"}\'');
  console.log('');
  console.log('   curl http://localhost:8008/ai-transcript/info/70');
  console.log('');
  console.log('   curl http://localhost:8008/ai-transcript/available');
}

if (require.main === module) {
  testAITranscript().catch(console.error);
}

module.exports = { testAITranscript }; 