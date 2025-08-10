const { sequelize } = require('../database/models');
const { Video } = require('../database/models');

async function updateVideoUrls() {
  const transaction = await sequelize.transaction();
  
  try {
    console.log('🎥 Updating video URLs...');
    
    // Video URLs mapped to video IDs with relevant content
    const videoUpdates = [
      {
        id: 1,
        title: 'Introduction to Generative AI',
        url: 'https://www.youtube.com/watch?v=2IK3DFHRFfw' // Introduction to Generative AI by IBM Technology
      },
      {
        id: 2,
        title: 'Setting Up Your AI Development Environment',
        url: 'https://www.youtube.com/watch?v=kqtD5dpn9C8' // Python for AI/ML Development Setup
      },
      {
        id: 3,
        title: 'Understanding Large Language Models',
        url: 'https://www.youtube.com/watch?v=5sLYAQS9sWQ' // Understanding Large Language Models by Andrej Karpathy
      },
      {
        id: 4,
        title: 'OpenAI API Integration',
        url: 'https://www.youtube.com/watch?v=c-g6epk3fFE' // OpenAI API Tutorial
      },
      {
        id: 5,
        title: 'Building Your First AI Chatbot',
        url: 'https://www.youtube.com/watch?v=pYiXiX0K3ak' // Build AI Chatbot Tutorial
      },
      {
        id: 6,
        title: 'Prompt Engineering Techniques',
        url: 'https://www.youtube.com/watch?v=_VjQlb_Uy8k' // Prompt Engineering Guide
      },
      {
        id: 7,
        title: 'Fine-tuning Models',
        url: 'https://www.youtube.com/watch?v=eC6Hd1hFvos' // Fine-tuning Language Models
      },
      {
        id: 8,
        title: 'AI Ethics and Safety',
        url: 'https://www.youtube.com/watch?v=LqjP7O9SxOM' // AI Ethics and Safety
      },
      {
        id: 9,
        title: 'React Fundamentals',
        url: 'https://www.youtube.com/watch?v=SqcY0GlETPk' // React Tutorial for Beginners
      },
      {
        id: 10,
        title: 'Building REST APIs with Node.js',
        url: 'https://www.youtube.com/watch?v=fgTGADljAeg' // Node.js REST API Tutorial
      },
      {
        id: 11,
        title: 'Database Design and Integration',
        url: 'https://www.youtube.com/watch?v=ztHopE5Wnpc' // Database Design Tutorial
      },
      {
        id: 12,
        title: 'Deployment and DevOps',
        url: 'https://www.youtube.com/watch?v=9pzfgcaWo7Y' // DevOps Deployment Tutorial
      }
    ];

    // Update each video with its URL
    for (const videoUpdate of videoUpdates) {
      await Video.update(
        { url: videoUpdate.url },
        { 
          where: { id: videoUpdate.id },
          transaction 
        }
      );
      console.log(`✅ Updated "${videoUpdate.title}" with URL`);
    }
    
    await transaction.commit();
    
    console.log('\n🎉 All video URLs updated successfully!');
    console.log(`Updated ${videoUpdates.length} videos with relevant educational content URLs`);
    
  } catch (error) {
    await transaction.rollback();
    console.error('❌ Failed to update video URLs:', error);
    throw error;
  }
}

// Run the update function
if (require.main === module) {
  updateVideoUrls()
    .then(() => {
      console.log('\n✅ Video URL update completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Video URL update failed:', error);
      process.exit(1);
    });
}

module.exports = updateVideoUrls; 