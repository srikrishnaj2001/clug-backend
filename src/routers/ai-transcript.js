const express = require('express');
const router = express.Router();
const Joi = require('joi');
const geminiService = require('../services/gemini');
const { sendResponse } = require('../utils/helpers');
const { validate } = require('../utils/validation');

// Validation schemas
const askQuestionSchema = Joi.object({
  question: Joi.string().min(1).max(2000).required().messages({
    'string.min': 'Question cannot be empty',
    'string.max': 'Question is too long (max 2000 characters)',
    'any.required': 'Question is required'
  }),
  videoId: Joi.string().min(1).max(50).required().messages({
    'string.min': 'Video ID cannot be empty',
    'string.max': 'Video ID is too long',
    'any.required': 'Video ID is required'
  })
});

const transcriptInfoSchema = Joi.object({
  videoId: Joi.string().min(1).max(50).required().messages({
    'string.min': 'Video ID cannot be empty',
    'string.max': 'Video ID is too long',
    'any.required': 'Video ID is required'
  })
});

/**
 * @route  POST /ai-transcript/chat
 * @desc   Chatbot-friendly endpoint for asking questions about videos
 * @body   { question: string, videoId: string }
 * @access Public
 * @returns Simple question-answer format for chatbot UI
 */
router.post('/chat', validate(askQuestionSchema, 'body'), async (req, res) => {
  const { question, videoId } = req.body;
  
  try {
    const result = await geminiService.askGeminiWithTranscript(question, videoId);
    
    if (result.success) {
      // Return simplified format for chatbot interface
      return res.status(200).json({
        success: true,
        question: result.data.question,
        answer: result.data.answer,
        videoId: result.data.videoId,
        timestamp: result.data.timestamp
      });
    } else {
      // Handle errors gracefully for chatbot
      return res.status(result.statusCode || 500).json({
        success: false,
        error: result.message || 'Failed to process question',
        question,
        videoId
      });
    }
  } catch (error) {
    console.error('Error in /ai-transcript/chat:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error while processing your question',
      question,
      videoId
    });
  }
});

/**
 * @route  POST /ai-transcript/ask
 * @desc   Ask a question about a video using its transcript
 * @body   { question: string, videoId: string }
 * @access Public
 */
router.post('/ask', validate(askQuestionSchema, 'body'), async (req, res) => {
  const { question, videoId } = req.body;
  
  try {
    const result = await geminiService.askGeminiWithTranscript(question, videoId);
    return sendResponse(res, result);
  } catch (error) {
    console.error('Error in /ai-transcript/ask:', error);
    return sendResponse(res, {
      success: false,
      statusCode: 500,
      message: 'Internal server error while processing your question'
    });
  }
});

/**
 * @route  GET /ai-transcript/info/:videoId
 * @desc   Get information about a video transcript
 * @param  {string} videoId - Video ID
 * @access Public
 */
router.get('/info/:videoId', validate(transcriptInfoSchema, 'params'), async (req, res) => {
  const { videoId } = req.params;
  
  try {
    const result = await geminiService.getTranscriptInfo(videoId);
    return sendResponse(res, result);
  } catch (error) {
    console.error('Error in /ai-transcript/info:', error);
    return sendResponse(res, {
      success: false,
      statusCode: 500,
      message: 'Internal server error while fetching transcript info'
    });
  }
});

/**
 * @route  GET /ai-transcript/available
 * @desc   Get list of available transcripts
 * @access Public
 */
router.get('/available', async (req, res) => {
  try {
    const fs = require('fs').promises;
    const path = require('path');
    
    const transcriptsDir = path.join(process.cwd(), 'transcripts');
    const files = await fs.readdir(transcriptsDir);
    
    // Filter for .txt files and extract video IDs
    const transcripts = files
      .filter(file => file.endsWith('.txt') && /^\d+\.txt$/.test(file))
      .map(file => {
        const videoId = file.replace('.txt', '');
        return { videoId, filename: file };
      })
      .sort((a, b) => parseInt(a.videoId) - parseInt(b.videoId));
    
    return sendResponse(res, {
      success: true,
      statusCode: 200,
      data: {
        count: transcripts.length,
        transcripts
      }
    });
  } catch (error) {
    console.error('Error in /ai-transcript/available:', error);
    return sendResponse(res, {
      success: false,
      statusCode: 500,
      message: 'Error fetching available transcripts'
    });
  }
});

/**
 * @route  POST /ai-transcript/batch-ask
 * @desc   Ask multiple questions about a video
 * @body   { questions: string[], videoId: string }
 * @access Public
 */
router.post('/batch-ask', async (req, res) => {
  const schema = Joi.object({
    questions: Joi.array().items(
      Joi.string().min(1).max(2000)
    ).min(1).max(5).required().messages({
      'array.min': 'At least one question is required',
      'array.max': 'Maximum 5 questions allowed per batch',
      'any.required': 'Questions array is required'
    }),
    videoId: Joi.string().min(1).max(50).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: error.details[0].message
    });
  }

  const { questions, videoId } = req.body;
  
  try {
    const results = [];
    
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const result = await geminiService.askGeminiWithTranscript(question, videoId);
      
      results.push({
        questionIndex: i,
        question,
        ...result
      });
      
      // Add a small delay between requests to avoid rate limiting
      if (i < questions.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;
    
    return sendResponse(res, {
      success: true,
      statusCode: 200,
      data: {
        videoId,
        totalQuestions: questions.length,
        successfulAnswers: successCount,
        failedAnswers: failCount,
        results
      }
    });
  } catch (error) {
    console.error('Error in /ai-transcript/batch-ask:', error);
    return sendResponse(res, {
      success: false,
      statusCode: 500,
      message: 'Internal server error while processing batch questions'
    });
  }
});

module.exports = router; 