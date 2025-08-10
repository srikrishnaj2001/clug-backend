'use strict';

const { fetchTranscript } = require('./fetch-transcripts');

async function testTranscript() {
  console.log('🧪 Testing transcript fetching with one video...\n');
  
  // Test with HTML Crash Course video (usually has good captions)
  const testVideoId = 'UB1O30fR-EE';
  
  try {
    const result = await fetchTranscript(testVideoId, 'HTML Crash Course Test');
    
    if (result) {
      console.log('\n✅ Test successful!');
      console.log(`Title: ${result.title}`);
      console.log(`File: ${result.filename}`);
      console.log(`Preview: ${result.transcript}`);
    } else {
      console.log('\n❌ Test failed - no transcript available');
    }
    
  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
  }
}

if (require.main === module) {
  testTranscript().catch(console.error);
} 