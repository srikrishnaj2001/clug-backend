'use strict';

const fs = require('fs').promises;
const path = require('path');
const { YoutubeTranscript } = require('youtube-transcript');

// Video URLs from our courses
const videoUrls = [
  // Generative AI Bootcamp videos (repeated for different modules)
  'https://www.youtube.com/watch?v=SW7zE4GnVqA', // All-in-One AI Full Course 2024
  'https://www.youtube.com/watch?v=-v9PiM6cqLM', // Generative AI Full Course 2025 - Simplilearn
  'https://www.youtube.com/watch?v=pJfzMwn6GT8', // Generative AI Full Course 2025 - Beginners
  
  // Fullstack Web Development videos
  'https://www.youtube.com/watch?v=UB1O30fR-EE', // HTML Crash Course - Traversy Media
  'https://www.youtube.com/watch?v=yfoY53QXEnI', // CSS Crash Course - Traversy Media
  'https://youtu.be/zJSY8tbf_ys?si=d6iJZktHAqhrQ-ZK', // Responsive Web Design
  'https://www.youtube.com/watch?v=hdI2bqOjy3c', // JavaScript Crash Course - Traversy Media
  'https://www.youtube.com/watch?v=PkZNo7MFNFg', // Learn JavaScript Full Course - freeCodeCamp
  'https://www.youtube.com/watch?v=5fb2aPlgoys', // JavaScript DOM Manipulation - freeCodeCamp
  'https://www.youtube.com/watch?v=32M1al-Y6Ag', // Node.js Crash Course - Traversy Media
  'https://www.youtube.com/watch?v=CnH3kAXSrmU', // Express Crash Course - Traversy Media
  'https://www.youtube.com/watch?v=85pG_pDkITY', // PostgreSQL Tutorial - freeCodeCamp
  'https://www.youtube.com/watch?v=LDB4uaJ87e0', // React Crash Course - Traversy Media
  'https://www.youtube.com/watch?v=Ke90Tje7VS0', // React Tutorial - Net Ninja
  'https://youtu.be/TNhaISOUy6Q?si=tEbiQxzEzZqOd0Og', // React Hooks Tutorial
  'https://www.youtube.com/watch?v=hAuyNf0Uk-w', // Deploy React App with Vercel
  'https://www.youtube.com/watch?v=0P53S34zm44', // Deploy to Netlify
  'https://www.youtube.com/watch?v=pg19Z8LL06w', // Docker Crash Course
];

function extractVideoId(url) {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function sanitizeFilename(title) {
  return title
    .replace(/[<>:"/\\|?*]/g, '') // Remove invalid filename characters
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .substring(0, 100); // Limit length
}

async function fetchTranscript(videoId, index) {
  try {
    console.log(`[${index}] Fetching transcript for video: ${videoId}`);
    
    // Fetch transcript using youtube-transcript
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    
    if (!transcript || transcript.length === 0) {
      console.log(`❌ No transcript available for: ${videoId}`);
      return null;
    }
    
    // Combine all transcript parts into a single text
    const fullTranscript = transcript
      .map(item => item.text)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    console.log(`✅ Successfully fetched transcript (${fullTranscript.length} characters)`);
    
    // Generate a title based on first few words or use video ID
    const title = fullTranscript.substring(0, 50).replace(/[^a-zA-Z0-9\s]/g, '') || `Video_${videoId}`;
    
    // Save transcript to file
    const filename = `${sanitizeFilename(title)}_${videoId}.txt`;
    const filepath = path.join(process.cwd(), 'transcripts', filename);
    
    const content = `Video ID: ${videoId}
URL: https://www.youtube.com/watch?v=${videoId}
Fetched: ${new Date().toISOString()}
Length: ${fullTranscript.length} characters

Transcript:
${fullTranscript}`;
    
    await fs.writeFile(filepath, content, 'utf8');
    console.log(`💾 Saved transcript: ${filename}`);
    
    return {
      videoId,
      filename,
      length: fullTranscript.length,
      preview: fullTranscript.substring(0, 200) + '...'
    };
    
  } catch (error) {
    console.error(`❌ Error processing video ${videoId}:`, error.message);
    return null;
  }
}

async function fetchAllTranscripts() {
  console.log('🚀 Starting transcript fetching process...');
  console.log(`📋 Processing ${videoUrls.length} videos\n`);
  
  // Get unique video IDs to avoid duplicates
  const uniqueVideos = [];
  const processedIds = new Set();
  
  for (const url of videoUrls) {
    const videoId = extractVideoId(url);
    if (videoId && !processedIds.has(videoId)) {
      uniqueVideos.push({ url, videoId });
      processedIds.add(videoId);
    }
  }
  
  console.log(`📋 Found ${uniqueVideos.length} unique videos (${videoUrls.length - uniqueVideos.length} duplicates removed)\n`);
  
  const results = [];
  const errors = [];
  
  for (let i = 0; i < uniqueVideos.length; i++) {
    const { url, videoId } = uniqueVideos[i];
    
    try {
      const result = await fetchTranscript(videoId, i + 1);
      if (result) {
        results.push(result);
      } else {
        errors.push({ url, videoId, error: 'No transcript available' });
      }
    } catch (error) {
      console.error(`❌ Failed to process ${videoId}:`, error.message);
      errors.push({ url, videoId, error: error.message });
    }
    
    // Add a small delay to be respectful to YouTube's servers
    if (i < uniqueVideos.length - 1) {
      console.log('⏳ Waiting 3 seconds...\n');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  // Summary
  console.log('\n📊 SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Successfully fetched: ${results.length} transcripts`);
  console.log(`❌ Failed: ${errors.length} videos`);
  
  if (results.length > 0) {
    console.log('\n✅ Successfully processed:');
    results.forEach((result, index) => {
      console.log(`${index + 1}. ${result.filename}`);
      console.log(`   Video ID: ${result.videoId}`);
      console.log(`   Length: ${result.length} characters`);
      console.log(`   Preview: ${result.preview}`);
      console.log('');
    });
  }
  
  if (errors.length > 0) {
    console.log('\n❌ Failed videos:');
    errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error.videoId} - ${error.error}`);
    });
  }
  
  console.log(`\n🎉 Process completed! Check the 'transcripts' folder for saved files.`);
  
  return { success: results.length, failed: errors.length };
}

// Run the script
if (require.main === module) {
  fetchAllTranscripts().catch(console.error);
}

module.exports = { fetchAllTranscripts, fetchTranscript }; 