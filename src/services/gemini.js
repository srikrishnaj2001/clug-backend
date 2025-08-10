'use strict';

const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs').promises;
const path = require('path');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function readTranscriptFile(videoId) {
  try {
    const transcriptPath = path.join(process.cwd(), 'transcripts', `${videoId}.txt`);
    const transcriptContent = await fs.readFile(transcriptPath, 'utf8');
    return transcriptContent;
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Transcript file not found for video ID: ${videoId}`);
    }
    throw new Error(`Error reading transcript file: ${error.message}`);
  }
}

function truncateTranscript(transcript, maxTokens = 30000) {
  // Rough estimation: 1 token ≈ 4 characters
  const maxChars = maxTokens * 4;
  
  if (transcript.length <= maxChars) {
    return transcript;
  }
  
  // Try to truncate at a sentence boundary
  const truncated = transcript.substring(0, maxChars);
  const lastSentence = truncated.lastIndexOf('. ');
  
  if (lastSentence > maxChars * 0.8) {
    return truncated.substring(0, lastSentence + 1);
  }
  
  return truncated + '...';
}

async function askGeminiWithTranscript(question, videoId) {
  try {
    // Validate inputs
    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return {
        success: false,
        statusCode: 400,
        message: 'Question is required and must be a non-empty string'
      };
    }

    if (!videoId || typeof videoId !== 'string') {
      return {
        success: false,
        statusCode: 400,
        message: 'Video ID is required and must be a string'
      };
    }

    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return {
        success: false,
        statusCode: 500,
        message: 'Gemini API key not configured'
      };
    }

    // Read the transcript file
    let transcript;
    try {
      transcript = await readTranscriptFile(videoId);
    } catch (error) {
      return {
        success: false,
        statusCode: 404,
        message: error.message
      };
    }

    // Truncate transcript if too long
    const processedTranscript = truncateTranscript(transcript);

    // Get the generative model (using the latest and most suitable model for our use case)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Create the prompt with transcript context
    const prompt = `You are an AI tutor helping students learn from an educational video.  
You are given the complete transcript of the video and a student's question.  
Your task is to answer strictly based on the transcript content.

TRANSCRIPT:  
${processedTranscript}

STUDENT QUESTION:  
${question.trim()}

GUIDELINES:  
1. Use ONLY the information from the transcript—do not invent or guess facts not in it.  
2. If the transcript lacks enough detail to answer, respond exactly with:  
   "The transcript does not contain enough information to answer this question."  
3. Support your answer with specific details, examples, or direct quotes from the transcript whenever possible.  
4. Keep explanations clear, concise, and in simple language suitable for learning.  
5. If the question is unrelated to the video’s topic, politely inform the student and encourage them to ask a relevant question.  
6. Write your answer in clear, well-structured paragraphs (2–4 sentences each).  
7. Avoid headings, lists, or bullet points—just provide the answer in flowing, easy-to-read paragraphs.  
8. Do not include any external knowledge, personal opinions, or unrelated commentary.

ANSWER:`;

    // Generate response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const answer = response.text();

    if (!answer || answer.trim().length === 0) {
      return {
        success: false,
        statusCode: 500,
        message: 'No response generated from Gemini'
      };
    }

    return {
      success: true,
      statusCode: 200,
      data: {
        question: question.trim(),
        answer: answer.trim(),
        videoId,
        transcriptLength: transcript.length,
        processedLength: processedTranscript.length,
        timestamp: new Date().toISOString()
      }
    };

  } catch (error) {
    console.error('Error in askGeminiWithTranscript:', error);
    
    // Handle specific Gemini API errors
    if (error.message?.includes('API key')) {
      return {
        success: false,
        statusCode: 401,
        message: 'Invalid or missing Gemini API key'
      };
    }
    
    if (error.message?.includes('quota') || error.message?.includes('limit')) {
      return {
        success: false,
        statusCode: 429,
        message: 'API quota exceeded. Please try again later.'
      };
    }

    return {
      success: false,
      statusCode: 500,
      message: 'An error occurred while processing your question',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    };
  }
}

async function getTranscriptInfo(videoId) {
  try {
    const transcript = await readTranscriptFile(videoId);
    
    // Extract basic info about the transcript
    const lines = transcript.split('\n').filter(line => line.trim().length > 0);
    const wordCount = transcript.split(/\s+/).length;
    const charCount = transcript.length;
    
    // Try to extract title from transcript if it follows our format
    const titleMatch = transcript.match(/^Title: (.+)$/m);
    const title = titleMatch ? titleMatch[1] : 'Unknown';
    
    return {
      success: true,
      statusCode: 200,
      data: {
        videoId,
        title,
        characterCount: charCount,
        wordCount,
        lineCount: lines.length,
        available: true
      }
    };
  } catch (error) {
    return {
      success: false,
      statusCode: 404,
      message: error.message,
      data: {
        videoId,
        available: false
      }
    };
  }
}

module.exports = {
  askGeminiWithTranscript,
  getTranscriptInfo,
  readTranscriptFile
}; 