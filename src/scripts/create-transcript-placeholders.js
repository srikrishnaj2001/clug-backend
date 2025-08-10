'use strict';

const fs = require('fs').promises;
const path = require('path');

// Video information from our courses
const courseVideos = [
  // Generative AI Bootcamp
  { id: 'SW7zE4GnVqA', title: 'All-in-One Artificial Intelligence (AI) Full Course 2024 | AI Tutorial for Beginners', module: 'Foundations of Generative AI' },
  { id: '-v9PiM6cqLM', title: 'Generative AI Full Course 2025 | Gen AI Explained | Simplilearn', module: 'Core Models: Text, Image, and Synthetic Media' },
  { id: 'pJfzMwn6GT8', title: 'Generative AI Full Course 2025 | Gen AI Tutorial for Beginners', module: 'Large Language Models (LLMs): Text & Code' },
  
  // Fullstack Web Development
  { id: 'UB1O30fR-EE', title: 'HTML Crash Course For Absolute Beginners – Traversy Media', module: 'HTML, CSS & Responsive Layouts' },
  { id: 'yfoY53QXEnI', title: 'CSS Crash Course For Absolute Beginners – Traversy Media', module: 'HTML, CSS & Responsive Layouts' },
  { id: 'zJSY8tbf_ys', title: 'Frontend Web Development Bootcamp Course (JavaScript, HTML, CSS)', module: 'HTML, CSS & Responsive Layouts' },
  { id: 'hdI2bqOjy3c', title: 'JavaScript Crash Course For Beginners – Traversy Media', module: 'JavaScript & DOM Manipulation' },
  { id: 'PkZNo7MFNFg', title: 'Learn JavaScript – Full Course for Beginners – freeCodeCamp (Beau Carnes)', module: 'JavaScript & DOM Manipulation' },
  { id: '5fb2aPlgoys', title: 'JavaScript DOM Manipulation Tutorial – freeCodeCamp', module: 'JavaScript & DOM Manipulation' },
  { id: '32M1al-Y6Ag', title: 'Node.js Crash Course – Traversy Media', module: 'Backend: Node.js, Express & Databases' },
  { id: 'CnH3kAXSrmU', title: 'Express Crash Course – Traversy Media', module: 'Backend: Node.js, Express & Databases' },
  { id: '85pG_pDkITY', title: 'PostgreSQL Tutorial – Full Course – freeCodeCamp', module: 'Backend: Node.js, Express & Databases' },
  { id: 'LDB4uaJ87e0', title: 'React Crash Course – Traversy Media', module: 'Frontend Framework (React)' },
  { id: 'Ke90Tje7VS0', title: 'React Tutorial for Beginners – The Net Ninja', module: 'Frontend Framework (React)' },
  { id: 'TNhaISOUy6Q', title: '10 React Hooks Explained // Plus Build your own from Scratch', module: 'Frontend Framework (React)' },
  { id: 'hAuyNf0Uk-w', title: 'How to Deploy a React App with Vercel', module: 'Deployment, Testing, DevOps Basics & Capstone' },
  { id: '0P53S34zm44', title: 'Deploy to Netlify – Step-by-Step', module: 'Deployment, Testing, DevOps Basics & Capstone' },
  { id: 'pg19Z8LL06w', title: 'Docker Crash Course – TechWorld or Traversy Media', module: 'Deployment, Testing, DevOps Basics & Capstone' },
];

function sanitizeFilename(title) {
  return title
    .replace(/[<>:"/\\|?*]/g, '') // Remove invalid filename characters
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .substring(0, 80); // Limit length
}

async function createPlaceholderTranscript(video) {
  const filename = `${sanitizeFilename(video.title)}_${video.id}.txt`;
  const filepath = path.join(process.cwd(), 'transcripts', filename);
  
  const placeholderContent = `Title: ${video.title}
Video ID: ${video.id}
Module: ${video.module}
URL: https://www.youtube.com/watch?v=${video.id}
Status: TRANSCRIPT NOT AVAILABLE
Created: ${new Date().toISOString()}

=== TRANSCRIPT PLACEHOLDER ===

This video does not have auto-generated transcripts available through YouTube's API.

MANUAL TRANSCRIPT OPTIONS:
1. Watch the video and create manual notes
2. Use YouTube's auto-captions (if available) by:
   - Opening the video on YouTube
   - Clicking the "CC" button
   - Copying the captions manually
3. Use browser extensions like "YouTube Transcript" 
4. Use AI transcription services:
   - Upload audio to services like Rev.com, Otter.ai, or Whisper AI
   - Use local Whisper AI installation for offline transcription

CONTENT SUMMARY PLACEHOLDER:
Based on the title "${video.title}", this video likely covers:
${generateContentSummary(video)}

LEARNING OBJECTIVES:
${generateLearningObjectives(video)}

=== END PLACEHOLDER ===

Note: This is a placeholder file. Replace this content with the actual transcript when available.`;

  await fs.writeFile(filepath, placeholderContent, 'utf8');
  console.log(`📄 Created placeholder: ${filename}`);
  
  return filename;
}

function generateContentSummary(video) {
  const { title, module } = video;
  
  if (title.includes('HTML')) {
    return `- HTML fundamentals and semantic markup
- Basic HTML structure and elements
- Forms, tables, and media elements
- HTML5 features and best practices`;
  }
  
  if (title.includes('CSS')) {
    return `- CSS fundamentals and styling basics
- Selectors, properties, and values
- Flexbox and CSS Grid layout systems
- Responsive design principles`;
  }
  
  if (title.includes('JavaScript')) {
    return `- JavaScript fundamentals and syntax
- Variables, functions, and control structures
- DOM manipulation and event handling
- ES6+ features and modern JavaScript`;
  }
  
  if (title.includes('Node.js')) {
    return `- Node.js runtime and npm ecosystem
- Building server-side applications
- File system and HTTP modules
- Creating REST APIs`;
  }
  
  if (title.includes('Express')) {
    return `- Express.js framework fundamentals
- Routing and middleware
- Building REST APIs
- Error handling and best practices`;
  }
  
  if (title.includes('PostgreSQL')) {
    return `- SQL fundamentals and database concepts
- PostgreSQL installation and setup
- Creating tables and relationships
- Queries, joins, and advanced operations`;
  }
  
  if (title.includes('React')) {
    return `- React fundamentals and component architecture
- JSX syntax and component composition
- State management and props
- Hooks and modern React patterns`;
  }
  
  if (title.includes('Docker')) {
    return `- Containerization concepts and Docker basics
- Creating and managing containers
- Dockerfile creation and image building
- Container orchestration fundamentals`;
  }
  
  if (title.includes('Deploy') || title.includes('Vercel') || title.includes('Netlify')) {
    return `- Deployment strategies and best practices
- Cloud platform setup and configuration
- Continuous integration and deployment
- Environment management`;
  }
  
  if (title.includes('AI') || title.includes('Generative')) {
    return `- Artificial intelligence fundamentals
- Generative AI concepts and applications
- Model types and architectures
- Practical AI implementation`;
  }
  
  return `- Core concepts related to ${module}
- Practical examples and implementations
- Best practices and common patterns
- Real-world applications and use cases`;
}

function generateLearningObjectives(video) {
  const { module } = video;
  
  const objectives = {
    'Foundations of Generative AI': [
      'Understand basic AI and machine learning concepts',
      'Learn about different types of generative models',
      'Explore real-world applications of AI',
      'Identify ethical considerations in AI development'
    ],
    'Core Models: Text, Image, and Synthetic Media': [
      'Understand neural network architectures',
      'Learn about GANs, VAEs, and transformers',
      'Explore image and video generation techniques',
      'Practice with model implementations'
    ],
    'Large Language Models (LLMs): Text & Code': [
      'Master LLM concepts and applications',
      'Learn code generation techniques',
      'Understand transformer architecture',
      'Practice with text generation tasks'
    ],
    'HTML, CSS & Responsive Layouts': [
      'Master HTML semantic markup',
      'Create responsive layouts with CSS',
      'Implement modern CSS techniques',
      'Build accessible web interfaces'
    ],
    'JavaScript & DOM Manipulation': [
      'Master JavaScript fundamentals',
      'Learn DOM manipulation techniques',
      'Implement event handling',
      'Create interactive web applications'
    ],
    'Backend: Node.js, Express & Databases': [
      'Build server-side applications with Node.js',
      'Create REST APIs with Express',
      'Design and implement databases',
      'Implement authentication and security'
    ],
    'Frontend Framework (React)': [
      'Master React component architecture',
      'Implement state management',
      'Create dynamic user interfaces',
      'Build production-ready applications'
    ],
    'Deployment, Testing, DevOps Basics & Capstone': [
      'Deploy applications to cloud platforms',
      'Implement testing strategies',
      'Set up CI/CD pipelines',
      'Monitor and maintain applications'
    ]
  };
  
  const moduleObjectives = objectives[module] || [
    'Understand core concepts',
    'Apply practical skills',
    'Implement best practices',
    'Build real-world projects'
  ];
  
  return moduleObjectives.map((obj, index) => `${index + 1}. ${obj}`).join('\n');
}

async function createAllPlaceholders() {
  console.log('📝 Creating transcript placeholders...');
  console.log(`📋 Processing ${courseVideos.length} videos\n`);
  
  const results = [];
  
  for (const video of courseVideos) {
    try {
      const filename = await createPlaceholderTranscript(video);
      results.push({ video: video.title, filename, status: 'success' });
    } catch (error) {
      console.error(`❌ Error creating placeholder for ${video.id}:`, error.message);
      results.push({ video: video.title, status: 'error', error: error.message });
    }
  }
  
  // Summary
  console.log('\n📊 SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successfully created: ${results.filter(r => r.status === 'success').length} placeholders`);
  console.log(`❌ Failed: ${results.filter(r => r.status === 'error').length} placeholders`);
  
  console.log('\n📁 Files created in transcripts/ folder:');
  results.filter(r => r.status === 'success').forEach((result, index) => {
    console.log(`${index + 1}. ${result.filename}`);
  });
  
  console.log(`\n💡 NEXT STEPS:`);
  console.log(`1. Review the placeholder files in the 'transcripts' folder`);
  console.log(`2. For priority videos, manually create transcripts using the suggested methods`);
  console.log(`3. Replace placeholder content with actual transcripts as they become available`);
  console.log(`4. Consider using OpenAI Whisper or similar AI tools for batch transcription`);
  
  return results;
}

// Manual transcript creation guide
async function createTranscriptGuide() {
  const guideContent = `# YouTube Transcript Extraction Guide

## Why Transcripts Are Not Available

Most YouTube videos do not have publicly accessible auto-generated transcripts through API access due to:
- Privacy settings by video creators
- YouTube's API restrictions
- Anti-scraping measures
- Regional availability limitations

## Manual Transcript Creation Methods

### Method 1: YouTube UI (Recommended)
1. Open the video on YouTube
2. Click the "..." (More) button below the video
3. Select "Show transcript" 
4. Copy the transcript text manually
5. Clean up timestamps and formatting

### Method 2: Browser Extensions
- **YouTube Transcript**: Chrome/Firefox extension
- **Video Transcript**: Automated transcript extraction
- **Scholarcy**: Academic video summarization

### Method 3: AI Transcription Services
- **OpenAI Whisper**: Free, high-accuracy AI transcription
- **Rev.com**: Professional transcription service
- **Otter.ai**: Real-time transcription
- **Google Cloud Speech-to-Text**: API-based solution

### Method 4: Local Whisper Installation
\`\`\`bash
# Install Whisper
pip install openai-whisper

# Download video audio
youtube-dl -x --audio-format mp3 [VIDEO_URL]

# Transcribe with Whisper
whisper audio_file.mp3 --model medium --language en
\`\`\`

### Method 5: Browser DevTools (Advanced)
1. Open YouTube video
2. Enable captions (CC button)
3. Open DevTools (F12)
4. Look for caption data in Network tab
5. Extract JSON transcript data

## Recommended Workflow

1. **Priority**: Start with most important course videos
2. **Batch Process**: Group videos by topic/module
3. **Quality Control**: Review and edit auto-generated content
4. **Format**: Use consistent formatting for all transcripts
5. **Storage**: Save in \`transcripts/\` folder with standardized naming

## File Naming Convention
\`\`\`
[Video_Title]_[Video_ID].txt
\`\`\`

## Transcript Format Template
\`\`\`
Title: [Video Title]
Video ID: [YouTube ID]
Module: [Course Module]
URL: https://www.youtube.com/watch?v=[ID]
Transcribed: [Date]
Method: [Manual/Whisper/etc]

Transcript:
[Actual transcript content here...]
\`\`\`

## Tips for Better Transcripts

1. **Remove Filler Words**: Remove "um", "uh", excessive "you know"
2. **Add Punctuation**: Structure text with proper sentences
3. **Include Technical Terms**: Ensure code/technical terms are accurate
4. **Paragraph Breaks**: Add breaks for better readability
5. **Timestamps**: Include major section timestamps if needed

## Automation Options

For large-scale transcript generation, consider:
- Setting up a local Whisper server
- Using cloud-based speech-to-text APIs
- Creating a pipeline with youtube-dl + Whisper
- Batch processing during off-hours

---
This guide was generated on ${new Date().toISOString()}
`;

  const guidePath = path.join(process.cwd(), 'transcripts', 'TRANSCRIPT_GUIDE.md');
  await fs.writeFile(guidePath, guideContent, 'utf8');
  console.log(`📖 Created transcript guide: TRANSCRIPT_GUIDE.md`);
}

// Run the script
if (require.main === module) {
  Promise.all([
    createAllPlaceholders(),
    createTranscriptGuide()
  ]).catch(console.error);
}

module.exports = { createAllPlaceholders, createPlaceholderTranscript }; 