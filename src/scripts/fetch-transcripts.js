'use strict';

const fs = require('fs').promises;
const path = require('path');

// Video URLs from our courses
const videoUrls = [
  // Generative AI Bootcamp videos (repeated for different modules)
  'https://www.youtube.com/watch?v=SW7zE4GnVqA', // All-in-One AI Full Course 2024
  'https://www.youtube.com/watch?v=-v9PiM6cqLM', // Generative AI Full Course 2025 - Simplilearn
  'https://www.youtube.com/watch?v=pJfzMwn6GT8', // Generative AI Full Course 2025 - Beginners
  'https://www.youtube.com/watch?v=SW7zE4GnVqA', // Module 2
  'https://www.youtube.com/watch?v=-v9PiM6cqLM', 
  'https://www.youtube.com/watch?v=pJfzMwn6GT8',
  'https://www.youtube.com/watch?v=SW7zE4GnVqA', // Module 3
  'https://www.youtube.com/watch?v=-v9PiM6cqLM',
  'https://www.youtube.com/watch?v=pJfzMwn6GT8',
  'https://www.youtube.com/watch?v=SW7zE4GnVqA', // Module 4
  'https://www.youtube.com/watch?v=-v9PiM6cqLM',
  'https://www.youtube.com/watch?v=pJfzMwn6GT8',
  'https://www.youtube.com/watch?v=SW7zE4GnVqA', // Module 5
  'https://www.youtube.com/watch?v=-v9PiM6cqLM',
  'https://www.youtube.com/watch?v=pJfzMwn6GT8',
  
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

async function fetchTranscript(videoId, title) {
  try {
    console.log(`Fetching transcript for: ${title}`);
    
    const { Innertube } = await import('youtubei.js');
    const youtube = await Innertube.create();
    const info = await youtube.getInfo(videoId);
    
    if (!info.basic_info.title) {
      console.log(`❌ Could not get video info for: ${videoId}`);
      return null;
    }
    
    const actualTitle = info.basic_info.title;
    console.log(`📹 Video: ${actualTitle}`);
    
    // Try to get transcript
    let transcript = null;
    
    // Check if transcript is available
    if (info.captions && info.captions.caption_tracks && info.captions.caption_tracks.length > 0) {
      console.log(`📝 Found ${info.captions.caption_tracks.length} caption tracks`);
      
      // Try to get English captions first
      let captionTrack = info.captions.caption_tracks.find(track => 
        track.language_code === 'en' || 
        track.language_code === 'en-US' ||
        track.name.simpleText?.toLowerCase().includes('english')
      );
      
      // If no English captions, get the first available
      if (!captionTrack && info.captions.caption_tracks.length > 0) {
        captionTrack = info.captions.caption_tracks[0];
      }
      
      if (captionTrack) {
        console.log(`📄 Using caption track: ${captionTrack.name.simpleText || captionTrack.language_code}`);
        
        try {
          const captionData = await youtube.session.http.fetch(captionTrack.base_url);
          const captionText = await captionData.text();
          
          // Parse the XML and extract text
          transcript = parseCaptionXML(captionText);
          
        } catch (captionError) {
          console.log(`❌ Error fetching captions: ${captionError.message}`);
        }
      }
    }
    
    if (!transcript) {
      console.log(`❌ No transcript available for: ${actualTitle}`);
      return null;
    }
    
    // Save transcript to file
    const filename = `${sanitizeFilename(actualTitle)}_${videoId}.txt`;
    const filepath = path.join(process.cwd(), 'transcripts', filename);
    
    const content = `Title: ${actualTitle}
Video ID: ${videoId}
URL: https://www.youtube.com/watch?v=${videoId}
Fetched: ${new Date().toISOString()}

Transcript:
${transcript}`;
    
    await fs.writeFile(filepath, content, 'utf8');
    console.log(`✅ Saved transcript: ${filename}`);
    
    return {
      videoId,
      title: actualTitle,
      filename,
      transcript: transcript.substring(0, 500) + '...' // Return preview
    };
    
  } catch (error) {
    console.error(`❌ Error processing video ${videoId}:`, error.message);
    return null;
  }
}

function parseCaptionXML(xmlText) {
  // Simple XML parsing to extract text from captions
  const textRegex = /<text[^>]*>(.*?)<\/text>/g;
  const texts = [];
  let match;
  
  while ((match = textRegex.exec(xmlText)) !== null) {
    // Decode HTML entities and clean up
    let text = match[1]
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/<[^>]*>/g, '') // Remove any remaining HTML tags
      .trim();
    
    if (text) {
      texts.push(text);
    }
  }
  
  return texts.join(' ').replace(/\s+/g, ' ').trim();
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
    
    console.log(`\n[${i + 1}/${uniqueVideos.length}] Processing video: ${videoId}`);
    
    try {
      const result = await fetchTranscript(videoId, `Video_${i + 1}`);
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
      console.log('⏳ Waiting 2 seconds...');
      await new Promise(resolve => setTimeout(resolve, 2000));
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
      console.log(`${index + 1}. ${result.title}`);
      console.log(`   File: ${result.filename}`);
      console.log(`   Preview: ${result.transcript}`);
      console.log('');
    });
  }
  
  if (errors.length > 0) {
    console.log('\n❌ Failed videos:');
    errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error.url}`);
      console.log(`   Error: ${error.error}`);
      console.log('');
    });
  }
  
  console.log(`\n🎉 Process completed! Check the 'transcripts' folder for saved files.`);
}

// Run the script
if (require.main === module) {
  fetchAllTranscripts().catch(console.error);
}

module.exports = { fetchAllTranscripts, fetchTranscript }; 