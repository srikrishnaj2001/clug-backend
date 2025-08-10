'use strict';
require('dotenv').config();
const { sequelize } = require('../database/models');
const {
  User,
  UserMetadata,
  Program,
  Course,
  Module,
  Video,
  Resource,
  Event,
  Example,
  Assignment,
  Section,
  Enrollment,
} = require('../database/models');

async function seed() {
  const transaction = await sequelize.transaction();

  try {
    console.log('🧹 Cleaning existing data...');
    await Section.destroy({ where: {}, transaction });
    await Enrollment.destroy({ where: {}, transaction });
    await Assignment.destroy({ where: {}, transaction });
    await Example.destroy({ where: {}, transaction });
    await Event.destroy({ where: {}, transaction });
    await Resource.destroy({ where: {}, transaction });
    await Video.destroy({ where: {}, transaction });
    await Module.destroy({ where: {}, transaction });
    await Course.destroy({ where: {}, transaction });
    await Program.destroy({ where: {}, transaction });
    await UserMetadata.destroy({ where: {}, transaction });
    await User.destroy({ where: {}, transaction });

    console.log('✅ Clean slate');

    console.log('👤 Creating primary user...');
    const user = await User.create({
      name: 'Sri Krishna',
      email: 'srikrishna.jarugubilli2001@gmail.com',
      phone: '+91-9491864094',
    }, { transaction });

    await UserMetadata.create({
      userId: user.id,
      designation: 'Software Engineer',
      company: 'YC Demo Co',
      metadata: { interests: ['AI', 'Web'], experienceYears: 2 },
      industry: 'Technology',
      pictureUrl: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=640',
      linkedinUrl: 'https://www.linkedin.com/in/sri-krishna'
    }, { transaction });

    console.log('🎓 Creating programs...');
    const aiProgram = await Program.create({
      id: 1,
      name: 'AI & ML Program',
      description: 'A hands-on program covering modern AI, LLMs, and applied generative systems.'
    }, { transaction });

    const webProgram = await Program.create({
      id: 2,
      name: 'Web Engineering Program',
      description: 'Full-stack web engineering from fundamentals to production deployment.'
    }, { transaction });

    console.log('📚 Creating courses...');
    const aiCourse = await Course.create({
      id: 1,
      name: 'Generative AI Bootcamp',
      description: 'Build real applications with LLMs, prompting, RAG, function calling, and safety.',
      programId: aiProgram.id,
      thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200'
    }, { transaction });

    const webCourse = await Course.create({
      id: 2,
      name: 'Full Stack Web Development Bootcamp',
      description: 'Master fullstack web development from HTML/CSS to deployment with modern frameworks and tools.',
      programId: webProgram.id,
      thumbnailUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200'
    }, { transaction });

    console.log('📖 Creating modules...');
    const modules = await Module.bulkCreate([
      // Generative AI Bootcamp modules
      { id: 1, name: 'Foundations of Generative AI', description: 'Beginner-friendly overview of generative AI concepts, model types, and applications', cohortId: 101, startDate: new Date('2025-08-12'), endDate: new Date('2025-08-19'), courseId: aiCourse.id },
      { id: 2, name: 'Core Models: Text, Image, and Synthetic Media', description: 'Neural network fundamentals for generative models including GANs, image/video/audio synthesis', cohortId: 101, startDate: new Date('2025-08-20'), endDate: new Date('2025-08-27'), courseId: aiCourse.id },
      { id: 3, name: 'Large Language Models (LLMs): Text & Code', description: 'Deep dive into GPTs, code generation, summarization, translation, and multimodal models', cohortId: 101, startDate: new Date('2025-08-28'), endDate: new Date('2025-09-04'), courseId: aiCourse.id },
      { id: 4, name: 'Risks, Ethics, and Hallucinations', description: 'Understanding AI hallucinations, bias, ethical considerations, and mitigation strategies', cohortId: 101, startDate: new Date('2025-09-05'), endDate: new Date('2025-09-12'), courseId: aiCourse.id },
      { id: 5, name: 'Deploying GenAI Applications & Real-World Strategy', description: 'Enterprise adoption, deployment strategies, governance, and real-world implementation', cohortId: 101, startDate: new Date('2025-09-13'), endDate: new Date('2025-09-20'), courseId: aiCourse.id },
      
      // Fullstack Web Development Course modules
      { id: 6, name: 'HTML, CSS & Responsive Layouts', description: 'Build semantic, accessible HTML; style with modern CSS (Flexbox, Grid); make responsive layouts.', cohortId: 201, startDate: new Date('2025-08-12'), endDate: new Date('2025-08-19'), courseId: webCourse.id },
      { id: 7, name: 'JavaScript & DOM Manipulation', description: 'Master modern JavaScript (ES6+), DOM, events, asynchronous programming.', cohortId: 201, startDate: new Date('2025-08-20'), endDate: new Date('2025-08-27'), courseId: webCourse.id },
      { id: 8, name: 'Backend: Node.js, Express & Databases', description: 'Build REST APIs, connect to a database (Postgres or MongoDB), and understand authentication basics.', cohortId: 201, startDate: new Date('2025-08-28'), endDate: new Date('2025-09-04'), courseId: webCourse.id },
      { id: 9, name: 'Frontend Framework (React)', description: 'Build component-based UIs with React, use hooks, routing, and consume APIs.', cohortId: 201, startDate: new Date('2025-09-05'), endDate: new Date('2025-09-12'), courseId: webCourse.id },
      { id: 10, name: 'Deployment, Testing, DevOps Basics & Capstone', description: 'Deploy fullstack app, write tests, containerize, and set up CI/CD.', cohortId: 201, startDate: new Date('2025-09-13'), endDate: new Date('2025-09-20'), courseId: webCourse.id },
    ], { transaction, returning: true });

    console.log('🎥 Creating Generative AI Bootcamp content...');
    
    // Module 1: Foundations of Generative AI
    const aiFoundationsModule = modules[0];
    console.log(`Creating content for ${aiFoundationsModule.name}...`);
    
    const aiFoundationsVideos = await Video.bulkCreate([
      { name: 'All-in-One Artificial Intelligence (AI) Full Course 2024 | AI Tutorial for Beginners', description: 'Comprehensive AI tutorial covering fundamentals and applications', url: 'https://www.youtube.com/watch?v=SW7zE4GnVqA', transcript: 'Comprehensive introduction to generative AI including model types, applications, and core concepts...' },
      { name: 'Generative AI Full Course 2025 | Gen AI Explained | Simplilearn', description: 'Complete generative AI course with practical examples', url: 'https://www.youtube.com/watch?v=-v9PiM6cqLM', transcript: 'Learn cloud-based AI workflows, deployment patterns, and practical implementations...' },
      { name: 'Generative AI Full Course 2025 | Gen AI Tutorial for Beginners', description: 'Beginner-friendly generative AI tutorial with hands-on examples', url: 'https://www.youtube.com/watch?v=pJfzMwn6GT8', transcript: 'Step-by-step lessons covering the entire generative AI development lifecycle...' }
    ], { transaction, returning: true });

    const aiFoundationsVideoSections = await Section.bulkCreate([
      { name: aiFoundationsVideos[0].name, description: aiFoundationsVideos[0].description, type: 'VIDEO', contentId: aiFoundationsVideos[0].id, sectionId: null, moduleId: aiFoundationsModule.id },
      { name: aiFoundationsVideos[1].name, description: aiFoundationsVideos[1].description, type: 'VIDEO', contentId: aiFoundationsVideos[1].id, sectionId: null, moduleId: aiFoundationsModule.id },
      { name: aiFoundationsVideos[2].name, description: aiFoundationsVideos[2].description, type: 'VIDEO', contentId: aiFoundationsVideos[2].id, sectionId: null, moduleId: aiFoundationsModule.id }
    ], { transaction, returning: true });

    const aiFoundationsResources = await Resource.bulkCreate([
      { name: 'Wikipedia – Generative artificial intelligence', description: 'Detailed taxonomy, model types (GPTs, GANs, VAEs), and applications', url: 'https://en.wikipedia.org/wiki/Generative_artificial_intelligence' },
      { name: 'Google Cloud – What is Generative AI? Examples & Use Cases', description: 'Succinct explanation of how generative AI works and its foundation models', url: 'https://cloud.google.com/learn/what-is-generative-ai' }
    ], { transaction, returning: true });

    await Section.bulkCreate([
      { name: aiFoundationsResources[0].name, description: aiFoundationsResources[0].description, type: 'RESOURCE', contentId: aiFoundationsResources[0].id, sectionId: aiFoundationsVideoSections[0].id, moduleId: aiFoundationsModule.id },
      { name: aiFoundationsResources[1].name, description: aiFoundationsResources[1].description, type: 'RESOURCE', contentId: aiFoundationsResources[1].id, sectionId: aiFoundationsVideoSections[1].id, moduleId: aiFoundationsModule.id }
    ], { transaction });

    const aiFoundationsExamples = await Example.bulkCreate([
      { name: 'GenAI in healthcare, media, finance', description: 'Use cases such as drug discovery, synthetic data, content creation', industry: 'Healthcare' },
      { name: 'Examples of Generative AI by Gartner', description: 'Summarized applications across industries (text, code, images, video, simulations)', industry: 'Technology' }
    ], { transaction, returning: true });

    await Section.bulkCreate([
      { name: aiFoundationsExamples[0].name, description: aiFoundationsExamples[0].description, type: 'EXAMPLE', contentId: aiFoundationsExamples[0].id, sectionId: aiFoundationsVideoSections[0].id, moduleId: aiFoundationsModule.id },
      { name: aiFoundationsExamples[1].name, description: aiFoundationsExamples[1].description, type: 'EXAMPLE', contentId: aiFoundationsExamples[1].id, sectionId: aiFoundationsVideoSections[2].id, moduleId: aiFoundationsModule.id }
    ], { transaction });

    const aiFoundationsAssignment = await Assignment.create({ 
      name: 'Generative AI Model Types Essay', 
      description: 'Write a 2-page essay summarizing different generative AI model types (e.g. GPT, GAN, VAE), their typical applications, and two real-world use cases (one from tech/media and one from industry like healthcare or finance). Include citations.' 
    }, { transaction, returning: true });
    await Section.create({ name: aiFoundationsAssignment.name, description: aiFoundationsAssignment.description, type: 'ASSIGNMENT', contentId: aiFoundationsAssignment.id, sectionId: null, moduleId: aiFoundationsModule.id }, { transaction });

    // Module 2: Core Models: Text, Image, and Synthetic Media
    const aiCoreModelsModule = modules[1];
    console.log(`Creating content for ${aiCoreModelsModule.name}...`);
    
    const aiCoreModelsVideos = await Video.bulkCreate([
      { name: 'All-in-One Artificial Intelligence (AI) Full Course 2024 | AI Tutorial for Beginners', description: 'Neural network fundamentals for generative models', url: 'https://www.youtube.com/watch?v=SW7zE4GnVqA', transcript: 'Deep dive into neural network architectures used in generative AI models...' },
      { name: 'Generative AI Full Course 2025 | Gen AI Explained | Simplilearn', description: 'Cloud-based deployment and demos of generative models', url: 'https://www.youtube.com/watch?v=-v9PiM6cqLM', transcript: 'Practical demonstrations of deploying generative models in cloud environments...' },
      { name: 'Generative AI Full Course 2025 | Gen AI Tutorial for Beginners', description: 'Specific model architectures and implementations', url: 'https://www.youtube.com/watch?v=pJfzMwn6GT8', transcript: 'Technical exploration of GAN, VAE, and transformer architectures...' }
    ], { transaction, returning: true });

    const aiCoreModelsVideoSections = await Section.bulkCreate([
      { name: aiCoreModelsVideos[0].name, description: aiCoreModelsVideos[0].description, type: 'VIDEO', contentId: aiCoreModelsVideos[0].id, sectionId: null, moduleId: aiCoreModelsModule.id },
      { name: aiCoreModelsVideos[1].name, description: aiCoreModelsVideos[1].description, type: 'VIDEO', contentId: aiCoreModelsVideos[1].id, sectionId: null, moduleId: aiCoreModelsModule.id },
      { name: aiCoreModelsVideos[2].name, description: aiCoreModelsVideos[2].description, type: 'VIDEO', contentId: aiCoreModelsVideos[2].id, sectionId: null, moduleId: aiCoreModelsModule.id }
    ], { transaction, returning: true });

    const aiCoreModelsResources = await Resource.bulkCreate([
      { name: 'Wikipedia – GAN (Generative Adversarial Network)', description: 'Architecture explanation, use cases like image and video generation', url: 'https://en.wikipedia.org/wiki/Generative_adversarial_network' },
      { name: 'Wikipedia – Synthetic media', description: 'Image, video, audio synthesis, interactive media, music generation coverage', url: 'https://en.wikipedia.org/wiki/Synthetic_media' }
    ], { transaction, returning: true });

    await Section.bulkCreate([
      { name: aiCoreModelsResources[0].name, description: aiCoreModelsResources[0].description, type: 'RESOURCE', contentId: aiCoreModelsResources[0].id, sectionId: aiCoreModelsVideoSections[0].id, moduleId: aiCoreModelsModule.id },
      { name: aiCoreModelsResources[1].name, description: aiCoreModelsResources[1].description, type: 'RESOURCE', contentId: aiCoreModelsResources[1].id, sectionId: aiCoreModelsVideoSections[2].id, moduleId: aiCoreModelsModule.id }
    ], { transaction });

    const aiCoreModelsExamples = await Example.bulkCreate([
      { name: 'GANs in action', description: 'Applications like facial aging, 3D modeling, video generation', industry: 'Media' },
      { name: 'Synthetic media examples', description: 'AI-generated faces ("This Person Does Not Exist"), AI music, AI dungeon games', industry: 'Entertainment' }
    ], { transaction, returning: true });

    await Section.bulkCreate([
      { name: aiCoreModelsExamples[0].name, description: aiCoreModelsExamples[0].description, type: 'EXAMPLE', contentId: aiCoreModelsExamples[0].id, sectionId: aiCoreModelsVideoSections[0].id, moduleId: aiCoreModelsModule.id },
      { name: aiCoreModelsExamples[1].name, description: aiCoreModelsExamples[1].description, type: 'EXAMPLE', contentId: aiCoreModelsExamples[1].id, sectionId: aiCoreModelsVideoSections[1].id, moduleId: aiCoreModelsModule.id }
    ], { transaction });

    const aiCoreModelsAssignment = await Assignment.create({ 
      name: 'Generative Model Demo Project', 
      description: 'Pick one domain (image, music, or video). Use a free online demo (e.g., DALL·E mini, AI Dungeon, MelGAN demos) to generate content. Submit screenshots or outputs, describe the prompt, the model\'s behavior, strengths, limitations, and creativity observed.' 
    }, { transaction, returning: true });
    await Section.create({ name: aiCoreModelsAssignment.name, description: aiCoreModelsAssignment.description, type: 'ASSIGNMENT', contentId: aiCoreModelsAssignment.id, sectionId: null, moduleId: aiCoreModelsModule.id }, { transaction });

    // Module 3: Large Language Models (LLMs): Text & Code
    const aiLLMModule = modules[2];
    console.log(`Creating content for ${aiLLMModule.name}...`);
    
    const aiLLMVideos = await Video.bulkCreate([
      { name: 'All-in-One Artificial Intelligence (AI) Full Course 2024 | AI Tutorial for Beginners', description: 'Focused content on large language models and text generation', url: 'https://www.youtube.com/watch?v=SW7zE4GnVqA', transcript: 'Comprehensive coverage of LLM architectures, training, and applications...' },
      { name: 'Generative AI Full Course 2025 | Gen AI Explained | Simplilearn', description: 'Technical exploration of transformer models and attention mechanisms', url: 'https://www.youtube.com/watch?v=-v9PiM6cqLM', transcript: 'Understanding the transformer architecture that powers modern LLMs...' },
      { name: 'Generative AI Full Course 2025 | Gen AI Tutorial for Beginners', description: 'Practical applications of LLMs for software development', url: 'https://www.youtube.com/watch?v=pJfzMwn6GT8', transcript: 'Learn how LLMs can assist in code generation, debugging, and optimization...' }
    ], { transaction, returning: true });

    const aiLLMVideoSections = await Section.bulkCreate([
      { name: aiLLMVideos[0].name, description: aiLLMVideos[0].description, type: 'VIDEO', contentId: aiLLMVideos[0].id, sectionId: null, moduleId: aiLLMModule.id },
      { name: aiLLMVideos[1].name, description: aiLLMVideos[1].description, type: 'VIDEO', contentId: aiLLMVideos[1].id, sectionId: null, moduleId: aiLLMModule.id },
      { name: aiLLMVideos[2].name, description: aiLLMVideos[2].description, type: 'VIDEO', contentId: aiLLMVideos[2].id, sectionId: null, moduleId: aiLLMModule.id }
    ], { transaction, returning: true });

    const aiLLMResources = await Resource.bulkCreate([
      { name: 'Wikipedia – Generative AI (GPTs, multimodal models)', description: 'Overview of GPTs, multimodal models, and applications', url: 'https://en.wikipedia.org/wiki/Generative_artificial_intelligence' },
      { name: 'IBM – Generative AI Overview', description: 'Code generation, design, simulations, synthetic data highlights', url: 'https://www.ibm.com/topics/generative-ai' }
    ], { transaction, returning: true });

    await Section.bulkCreate([
      { name: aiLLMResources[0].name, description: aiLLMResources[0].description, type: 'RESOURCE', contentId: aiLLMResources[0].id, sectionId: aiLLMVideoSections[0].id, moduleId: aiLLMModule.id },
      { name: aiLLMResources[1].name, description: aiLLMResources[1].description, type: 'RESOURCE', contentId: aiLLMResources[1].id, sectionId: aiLLMVideoSections[2].id, moduleId: aiLLMModule.id }
    ], { transaction });

    const aiLLMExamples = await Example.bulkCreate([
      { name: 'Code generation, summarization, translation via GPT-type models', description: 'Practical applications of LLMs in software development and content creation', industry: 'Software Development' },
      { name: 'Synthetic data and simulations', description: 'Molecule generation, radiology image synthesis, and scientific applications', industry: 'Healthcare' }
    ], { transaction, returning: true });

    await Section.bulkCreate([
      { name: aiLLMExamples[0].name, description: aiLLMExamples[0].description, type: 'EXAMPLE', contentId: aiLLMExamples[0].id, sectionId: aiLLMVideoSections[2].id, moduleId: aiLLMModule.id },
      { name: aiLLMExamples[1].name, description: aiLLMExamples[1].description, type: 'EXAMPLE', contentId: aiLLMExamples[1].id, sectionId: aiLLMVideoSections[0].id, moduleId: aiLLMModule.id }
    ], { transaction });

    const aiLLMAssignment = await Assignment.create({ 
      name: 'ChatGPT Code Generation Project', 
      description: 'Use ChatGPT (free tier or equivalent) to generate code (e.g., a function), then ask for explanation, optimization, and translation into another language. Document prompts, outputs, and iterative improvements. Reflect on reliability and hallucination risks.' 
    }, { transaction, returning: true });
    await Section.create({ name: aiLLMAssignment.name, description: aiLLMAssignment.description, type: 'ASSIGNMENT', contentId: aiLLMAssignment.id, sectionId: null, moduleId: aiLLMModule.id }, { transaction });

    // Module 4: Risks, Ethics, and Hallucinations
    const aiEthicsModule = modules[3];
    console.log(`Creating content for ${aiEthicsModule.name}...`);
    
    const aiEthicsVideos = await Video.bulkCreate([
      { name: 'All-in-One Artificial Intelligence (AI) Full Course 2024 | AI Tutorial for Beginners', description: 'Ethical considerations and risk management in generative AI', url: 'https://www.youtube.com/watch?v=SW7zE4GnVqA', transcript: 'Comprehensive coverage of AI ethics, bias, and responsible AI development...' },
      { name: 'Generative AI Full Course 2025 | Gen AI Explained | Simplilearn', description: 'Understanding and addressing AI hallucination problems', url: 'https://www.youtube.com/watch?v=-v9PiM6cqLM', transcript: 'Deep dive into causes, types, and solutions for AI hallucinations...' },
      { name: 'Generative AI Full Course 2025 | Gen AI Tutorial for Beginners', description: 'Best practices for ethical AI development and deployment', url: 'https://www.youtube.com/watch?v=pJfzMwn6GT8', transcript: 'Guidelines and frameworks for developing trustworthy AI systems...' }
    ], { transaction, returning: true });

    const aiEthicsVideoSections = await Section.bulkCreate([
      { name: aiEthicsVideos[0].name, description: aiEthicsVideos[0].description, type: 'VIDEO', contentId: aiEthicsVideos[0].id, sectionId: null, moduleId: aiEthicsModule.id },
      { name: aiEthicsVideos[1].name, description: aiEthicsVideos[1].description, type: 'VIDEO', contentId: aiEthicsVideos[1].id, sectionId: null, moduleId: aiEthicsModule.id },
      { name: aiEthicsVideos[2].name, description: aiEthicsVideos[2].description, type: 'VIDEO', contentId: aiEthicsVideos[2].id, sectionId: null, moduleId: aiEthicsModule.id }
    ], { transaction, returning: true });

    const aiEthicsResources = await Resource.bulkCreate([
      { name: 'Wikipedia – Hallucination (AI)', description: 'Types, causes, and mitigation strategies for AI hallucinations', url: 'https://en.wikipedia.org/wiki/Hallucination_(artificial_intelligence)' },
      { name: 'Gartner – Risks of Generative AI', description: 'Details on hallucinations, bias, IP, transparency, sustainability concerns', url: 'https://www.gartner.com/en/topics/generative-ai' }
    ], { transaction, returning: true });

    await Section.bulkCreate([
      { name: aiEthicsResources[0].name, description: aiEthicsResources[0].description, type: 'RESOURCE', contentId: aiEthicsResources[0].id, sectionId: aiEthicsVideoSections[1].id, moduleId: aiEthicsModule.id },
      { name: aiEthicsResources[1].name, description: aiEthicsResources[1].description, type: 'RESOURCE', contentId: aiEthicsResources[1].id, sectionId: aiEthicsVideoSections[0].id, moduleId: aiEthicsModule.id }
    ], { transaction });

    const aiEthicsExamples = await Example.bulkCreate([
      { name: 'Agentic AI vs. Generative AI', description: 'Emerging proactive models and related ethical considerations', industry: 'Technology' },
      { name: 'Deepfake/death avatars controversy', description: 'Ethical dilemma of AI-generated likenesses of deceased individuals', industry: 'Media' }
    ], { transaction, returning: true });

    await Section.bulkCreate([
      { name: aiEthicsExamples[0].name, description: aiEthicsExamples[0].description, type: 'EXAMPLE', contentId: aiEthicsExamples[0].id, sectionId: aiEthicsVideoSections[0].id, moduleId: aiEthicsModule.id },
      { name: aiEthicsExamples[1].name, description: aiEthicsExamples[1].description, type: 'EXAMPLE', contentId: aiEthicsExamples[1].id, sectionId: aiEthicsVideoSections[2].id, moduleId: aiEthicsModule.id }
    ], { transaction });

    const aiEthicsAssignment = await Assignment.create({ 
      name: 'AI Ethics Case Study', 
      description: 'Choose one case (hallucination, deepfake, or agentic AI). Write a 2-page case study summarizing what happened, the ethical concerns, possible harm, and propose guidelines or mitigations (based on Gartner and hallucination mitigation literature).' 
    }, { transaction, returning: true });
    await Section.create({ name: aiEthicsAssignment.name, description: aiEthicsAssignment.description, type: 'ASSIGNMENT', contentId: aiEthicsAssignment.id, sectionId: null, moduleId: aiEthicsModule.id }, { transaction });

    // Module 5: Deploying GenAI Applications & Real-World Strategy
    const aiDeploymentModule = modules[4];
    console.log(`Creating content for ${aiDeploymentModule.name}...`);
    
    const aiDeploymentVideos = await Video.bulkCreate([
      { name: 'All-in-One Artificial Intelligence (AI) Full Course 2024 | AI Tutorial for Beginners', description: 'Enterprise deployment strategies and best practices', url: 'https://www.youtube.com/watch?v=SW7zE4GnVqA', transcript: 'Learn how to deploy generative AI solutions in enterprise environments...' },
      { name: 'Generative AI Full Course 2025 | Gen AI Explained | Simplilearn', description: 'Strategic approaches to generative AI adoption', url: 'https://www.youtube.com/watch?v=-v9PiM6cqLM', transcript: 'Comprehensive guide to planning and executing AI transformation initiatives...' },
      { name: 'Generative AI Full Course 2025 | Gen AI Tutorial for Beginners', description: 'Success stories and lessons learned from AI implementations', url: 'https://www.youtube.com/watch?v=pJfzMwn6GT8', transcript: 'Analysis of successful generative AI deployments across industries...' }
    ], { transaction, returning: true });

    const aiDeploymentVideoSections = await Section.bulkCreate([
      { name: aiDeploymentVideos[0].name, description: aiDeploymentVideos[0].description, type: 'VIDEO', contentId: aiDeploymentVideos[0].id, sectionId: null, moduleId: aiDeploymentModule.id },
      { name: aiDeploymentVideos[1].name, description: aiDeploymentVideos[1].description, type: 'VIDEO', contentId: aiDeploymentVideos[1].id, sectionId: null, moduleId: aiDeploymentModule.id },
      { name: aiDeploymentVideos[2].name, description: aiDeploymentVideos[2].description, type: 'VIDEO', contentId: aiDeploymentVideos[2].id, sectionId: null, moduleId: aiDeploymentModule.id }
    ], { transaction, returning: true });

    const aiDeploymentResources = await Resource.bulkCreate([
      { name: 'Gartner – Generative AI Strategy and Applications', description: 'Enterprise adoption, best practices, future projections', url: 'https://www.gartner.com/en/topics/generative-ai' },
      { name: 'Deloitte – 5 Ways to Make the Most of Generative AI', description: 'Focusing on efficiency, trust, and collaboration in organizations', url: 'https://www2.deloitte.com/us/en/insights/focus/cognitive-technologies/generative-ai-use-cases-applications.html' }
    ], { transaction, returning: true });

    await Section.bulkCreate([
      { name: aiDeploymentResources[0].name, description: aiDeploymentResources[0].description, type: 'RESOURCE', contentId: aiDeploymentResources[0].id, sectionId: aiDeploymentVideoSections[1].id, moduleId: aiDeploymentModule.id },
      { name: aiDeploymentResources[1].name, description: aiDeploymentResources[1].description, type: 'RESOURCE', contentId: aiDeploymentResources[1].id, sectionId: aiDeploymentVideoSections[0].id, moduleId: aiDeploymentModule.id }
    ], { transaction });

    const aiDeploymentExamples = await Example.bulkCreate([
      { name: 'Enterprise use cases (marketing, customer service, copywriting)', description: 'E.g., Estée Lauder using AI for SEO copy and support', industry: 'Retail' },
      { name: 'IIT Delhi\'s ethics integration in AI usage in academia', description: 'Transparency and academic integrity policies for AI use', industry: 'Education' }
    ], { transaction, returning: true });

    await Section.bulkCreate([
      { name: aiDeploymentExamples[0].name, description: aiDeploymentExamples[0].description, type: 'EXAMPLE', contentId: aiDeploymentExamples[0].id, sectionId: aiDeploymentVideoSections[2].id, moduleId: aiDeploymentModule.id },
      { name: aiDeploymentExamples[1].name, description: aiDeploymentExamples[1].description, type: 'EXAMPLE', contentId: aiDeploymentExamples[1].id, sectionId: aiDeploymentVideoSections[1].id, moduleId: aiDeploymentModule.id }
    ], { transaction });

    const aiDeploymentAssignment = await Assignment.create({ 
      name: 'Generative AI Adoption Plan (Capstone)', 
      description: 'Draft a Generative AI Adoption Plan for a hypothetical organization (e.g., marketing agency or university): include objectives, use cases (content-gen, code assistance, etc.), risk mitigation (ethical, hallucination, IP), deployment strategy (tool selection, training), and governance. Maximum 3 pages with diagrams (optional).' 
    }, { transaction, returning: true });
    await Section.create({ name: aiDeploymentAssignment.name, description: aiDeploymentAssignment.description, type: 'ASSIGNMENT', contentId: aiDeploymentAssignment.id, sectionId: null, moduleId: aiDeploymentModule.id }, { transaction });

    console.log('🎥 Creating fullstack web development course content...');
    
    // Module 6: HTML, CSS & Responsive Layouts (previously module 3)
    const htmlModule = modules[5];
    console.log(`Creating content for ${htmlModule.name}...`);
    
    const htmlVideos = await Video.bulkCreate([
      { name: 'HTML Crash Course For Absolute Beginners – Traversy Media', description: 'Comprehensive HTML tutorial covering semantic markup and accessibility', url: 'https://www.youtube.com/watch?v=UB1O30fR-EE', transcript: 'Learn HTML fundamentals including semantic tags, forms, and best practices...' },
      { name: 'CSS Crash Course For Absolute Beginners – Traversy Media', description: 'Complete CSS guide covering styling, layouts, and modern techniques', url: 'https://www.youtube.com/watch?v=yfoY53QXEnI', transcript: 'Master CSS from basics to advanced topics including Flexbox and Grid...' },
      { name: 'Responsive Web Design Tutorial – freeCodeCamp', description: 'Standalone tutorial covering responsive design principles', url: 'https://www.youtube.com/watch?v=responsive-web-design', transcript: 'Learn to create responsive layouts that work on all devices...' }
    ], { transaction, returning: true });

    const htmlVideoSections = await Section.bulkCreate([
      { name: htmlVideos[0].name, description: htmlVideos[0].description, type: 'VIDEO', contentId: htmlVideos[0].id, sectionId: null, moduleId: htmlModule.id },
      { name: htmlVideos[1].name, description: htmlVideos[1].description, type: 'VIDEO', contentId: htmlVideos[1].id, sectionId: null, moduleId: htmlModule.id },
      { name: htmlVideos[2].name, description: htmlVideos[2].description, type: 'VIDEO', contentId: htmlVideos[2].id, sectionId: null, moduleId: htmlModule.id }
    ], { transaction, returning: true });

    const htmlResources = await Resource.bulkCreate([
      { name: 'MDN — HTML: Structuring content / HTML basics', description: 'Authoritative reference for HTML fundamentals', url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content' },
      { name: 'freeCodeCamp — Responsive Web Design Curriculum', description: 'Project-based learning for responsive web design', url: 'https://www.freecodecamp.org/learn/responsive-web-design/' }
    ], { transaction, returning: true });

    await Section.bulkCreate([
      { name: htmlResources[0].name, description: htmlResources[0].description, type: 'RESOURCE', contentId: htmlResources[0].id, sectionId: htmlVideoSections[0].id, moduleId: htmlModule.id },
      { name: htmlResources[1].name, description: htmlResources[1].description, type: 'RESOURCE', contentId: htmlResources[1].id, sectionId: htmlVideoSections[2].id, moduleId: htmlModule.id }
    ], { transaction });

    const htmlExamples = await Example.bulkCreate([
      { name: 'FreeCodeCamp "Build a Responsive Café Menu / Cat Photo App"', description: 'Project-based examples for HTML/CSS fundamentals', industry: 'Education' },
      { name: 'CodePen: Responsive landing page templates', description: 'Searchable examples and templates for responsive design', industry: 'Web Development' }
    ], { transaction, returning: true });

    await Section.bulkCreate([
      { name: htmlExamples[0].name, description: htmlExamples[0].description, type: 'EXAMPLE', contentId: htmlExamples[0].id, sectionId: htmlVideoSections[0].id, moduleId: htmlModule.id },
      { name: htmlExamples[1].name, description: htmlExamples[1].description, type: 'EXAMPLE', contentId: htmlExamples[1].id, sectionId: htmlVideoSections[1].id, moduleId: htmlModule.id }
    ], { transaction });

    const htmlAssignment = await Assignment.create({ 
      name: 'Responsive Landing Page Project', 
      description: 'Build and host a responsive landing page (desktop, tablet, mobile): header + hero, features grid (Flexbox/Grid), contact form (HTML form validation), and accessible semantics. Submit HTML/CSS (GitHub repo) + live demo (e.g., CodePen / GitHub Pages).' 
    }, { transaction, returning: true });
    await Section.create({ name: htmlAssignment.name, description: htmlAssignment.description, type: 'ASSIGNMENT', contentId: htmlAssignment.id, sectionId: null, moduleId: htmlModule.id }, { transaction });

    // Module 7: JavaScript & DOM Manipulation
    const jsModule = modules[6];
    console.log(`Creating content for ${jsModule.name}...`);
    
    const jsVideos = await Video.bulkCreate([
      { name: 'JavaScript Crash Course For Beginners – Traversy Media', description: 'Complete JavaScript fundamentals for beginners', url: 'https://www.youtube.com/watch?v=hdI2bqOjy3c', transcript: 'Learn JavaScript from basics including variables, functions, objects...' },
      { name: 'Learn JavaScript – Full Course for Beginners – freeCodeCamp (Beau Carnes)', description: 'Comprehensive JavaScript course by freeCodeCamp', url: 'https://www.youtube.com/watch?v=PkZNo7MFNFg', transcript: 'Deep dive into JavaScript concepts and practical applications...' },
      { name: 'JavaScript DOM Manipulation Tutorial – freeCodeCamp', description: 'Full course on DOM manipulation and events', url: 'https://www.youtube.com/watch?v=5fb2aPlgoys', transcript: 'Master DOM manipulation, event handling, and dynamic content creation...' }
    ], { transaction, returning: true });

    const jsVideoSections = await Section.bulkCreate([
      { name: jsVideos[0].name, description: jsVideos[0].description, type: 'VIDEO', contentId: jsVideos[0].id, sectionId: null, moduleId: jsModule.id },
      { name: jsVideos[1].name, description: jsVideos[1].description, type: 'VIDEO', contentId: jsVideos[1].id, sectionId: null, moduleId: jsModule.id },
      { name: jsVideos[2].name, description: jsVideos[2].description, type: 'VIDEO', contentId: jsVideos[2].id, sectionId: null, moduleId: jsModule.id }
    ], { transaction, returning: true });

    const jsResources = await Resource.bulkCreate([
      { name: 'MDN — JavaScript Guide & First Steps', description: 'Core JS reference & tutorials from Mozilla', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide' },
      { name: 'freeCodeCamp — JS curriculum and practice projects', description: 'Interactive exercises and projects for JavaScript mastery', url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/' }
    ], { transaction, returning: true });

    await Section.bulkCreate([
      { name: jsResources[0].name, description: jsResources[0].description, type: 'RESOURCE', contentId: jsResources[0].id, sectionId: jsVideoSections[0].id, moduleId: jsModule.id },
      { name: jsResources[1].name, description: jsResources[1].description, type: 'RESOURCE', contentId: jsResources[1].id, sectionId: jsVideoSections[1].id, moduleId: jsModule.id }
    ], { transaction });

    const jsExamples = await Example.bulkCreate([
      { name: 'To-Do App tutorial (vanilla JS)', description: 'Complete tutorial for building interactive to-do application', industry: 'Web Development' },
      { name: 'Vanilla JavaScript interactive widgets', description: 'Collection of interactive widgets and games built with vanilla JS', industry: 'Web Development' }
    ], { transaction, returning: true });

    await Section.bulkCreate([
      { name: jsExamples[0].name, description: jsExamples[0].description, type: 'EXAMPLE', contentId: jsExamples[0].id, sectionId: jsVideoSections[2].id, moduleId: jsModule.id },
      { name: jsExamples[1].name, description: jsExamples[1].description, type: 'EXAMPLE', contentId: jsExamples[1].id, sectionId: jsVideoSections[1].id, moduleId: jsModule.id }
    ], { transaction });

    const jsAssignment = await Assignment.create({ 
      name: 'Interactive SPA Project', 
      description: 'Create an interactive SPA-like page (no frameworks) that includes: dynamic navigation, form validation, client-side data storage (LocalStorage), and an interactive to-do list with add/edit/delete and filters. Push code to GitHub and include README with instructions.' 
    }, { transaction, returning: true });
    await Section.create({ name: jsAssignment.name, description: jsAssignment.description, type: 'ASSIGNMENT', contentId: jsAssignment.id, sectionId: null, moduleId: jsModule.id }, { transaction });

    // Module 8: Backend: Node.js, Express & Databases
    const backendModule = modules[7];
    console.log(`Creating content for ${backendModule.name}...`);
    
    const backendVideos = await Video.bulkCreate([
      { name: 'Node.js Crash Course – Traversy Media', description: 'Node fundamentals and building APIs with Traversy Media', url: 'https://www.youtube.com/watch?v=32M1al-Y6Ag', transcript: 'Learn Node.js fundamentals including modules, file system, and HTTP...' },
      { name: 'Express Crash Course – Traversy Media', description: 'Express routing, middleware, and REST API development', url: 'https://www.youtube.com/watch?v=CnH3kAXSrmU', transcript: 'Master Express.js for building robust web applications and APIs...' },
      { name: 'PostgreSQL Tutorial – Full Course – freeCodeCamp', description: 'Complete PostgreSQL course covering SQL and database fundamentals', url: 'https://www.youtube.com/watch?v=85pG_pDkITY', transcript: 'Learn PostgreSQL from basics to advanced topics including queries and optimization...' }
    ], { transaction, returning: true });

    const backendVideoSections = await Section.bulkCreate([
      { name: backendVideos[0].name, description: backendVideos[0].description, type: 'VIDEO', contentId: backendVideos[0].id, sectionId: null, moduleId: backendModule.id },
      { name: backendVideos[1].name, description: backendVideos[1].description, type: 'VIDEO', contentId: backendVideos[1].id, sectionId: null, moduleId: backendModule.id },
      { name: backendVideos[2].name, description: backendVideos[2].description, type: 'VIDEO', contentId: backendVideos[2].id, sectionId: null, moduleId: backendModule.id }
    ], { transaction, returning: true });

    const backendResources = await Resource.bulkCreate([
      { name: 'Node.js official docs / guides', description: 'Core API reference and ecosystem documentation', url: 'https://nodejs.org/en/docs/' },
      { name: 'MongoDB University / MongoDB Basics', description: 'MongoDB fundamentals and Atlas cloud database', url: 'https://learn.mongodb.com/learning-paths/introduction-to-mongodb' }
    ], { transaction, returning: true });

    await Section.bulkCreate([
      { name: backendResources[0].name, description: backendResources[0].description, type: 'RESOURCE', contentId: backendResources[0].id, sectionId: backendVideoSections[0].id, moduleId: backendModule.id },
      { name: backendResources[1].name, description: backendResources[1].description, type: 'RESOURCE', contentId: backendResources[1].id, sectionId: backendVideoSections[2].id, moduleId: backendModule.id }
    ], { transaction });

    const backendExamples = await Example.bulkCreate([
      { name: 'Express Crash Course sample repo', description: 'Complete code examples from Traversy Media Express tutorial', industry: 'Web Development' },
      { name: 'PostgreSQL sample projects', description: 'Example queries, schemas, and freeCodeCamp SQL examples', industry: 'Database Development' }
    ], { transaction, returning: true });

    await Section.bulkCreate([
      { name: backendExamples[0].name, description: backendExamples[0].description, type: 'EXAMPLE', contentId: backendExamples[0].id, sectionId: backendVideoSections[1].id, moduleId: backendModule.id },
      { name: backendExamples[1].name, description: backendExamples[1].description, type: 'EXAMPLE', contentId: backendExamples[1].id, sectionId: backendVideoSections[2].id, moduleId: backendModule.id }
    ], { transaction });

    const backendAssignment = await Assignment.create({ 
      name: 'REST API Project', 
      description: 'Build a REST API (Node + Express) for a small app (e.g., notes or tasks) with CRUD endpoints, input validation, and DB persistence (choose Postgres or MongoDB). Add simple token-based auth (JWT). Deliver: GitHub repo, Postman collection, and short README on how to run.' 
    }, { transaction, returning: true });
    await Section.create({ name: backendAssignment.name, description: backendAssignment.description, type: 'ASSIGNMENT', contentId: backendAssignment.id, sectionId: null, moduleId: backendModule.id }, { transaction });

    // Module 9: Frontend Framework (React)
    const reactModule = modules[8];
    console.log(`Creating content for ${reactModule.name}...`);
    
    const reactVideos = await Video.bulkCreate([
      { name: 'React Crash Course – Traversy Media', description: 'Modern React with hooks by Traversy Media', url: 'https://www.youtube.com/watch?v=LDB4uaJ87e0', transcript: 'Learn React fundamentals including components, hooks, and state management...' },
      { name: 'React Tutorial for Beginners – The Net Ninja', description: 'Project-based React learning with Net Ninja', url: 'https://www.youtube.com/watch?v=Ke90Tje7VS0', transcript: 'Build complete React applications with modern patterns and best practices...' },
      { name: 'React Hooks Tutorial', description: 'Standalone React Hooks tutorial', url: 'https://www.youtube.com/watch?v=react-hooks-tutorial', transcript: 'Master React Hooks for modern state management and side effects...' }
    ], { transaction, returning: true });

    const reactVideoSections = await Section.bulkCreate([
      { name: reactVideos[0].name, description: reactVideos[0].description, type: 'VIDEO', contentId: reactVideos[0].id, sectionId: null, moduleId: reactModule.id },
      { name: reactVideos[1].name, description: reactVideos[1].description, type: 'VIDEO', contentId: reactVideos[1].id, sectionId: null, moduleId: reactModule.id },
      { name: reactVideos[2].name, description: reactVideos[2].description, type: 'VIDEO', contentId: reactVideos[2].id, sectionId: null, moduleId: reactModule.id }
    ], { transaction, returning: true });

    const reactResources = await Resource.bulkCreate([
      { name: 'React official docs (quick start & tutorial)', description: 'Best authoritative source for React development', url: 'https://react.dev/learn' },
      { name: 'React Router & common ecosystem guides', description: 'Official router documentation and state management guides', url: 'https://reactrouter.com/' }
    ], { transaction, returning: true });

    await Section.bulkCreate([
      { name: reactResources[0].name, description: reactResources[0].description, type: 'RESOURCE', contentId: reactResources[0].id, sectionId: reactVideoSections[0].id, moduleId: reactModule.id },
      { name: reactResources[1].name, description: reactResources[1].description, type: 'RESOURCE', contentId: reactResources[1].id, sectionId: reactVideoSections[1].id, moduleId: reactModule.id }
    ], { transaction });

    const reactExamples = await Example.bulkCreate([
      { name: 'React To-Do / Task Tracker tutorial repo', description: 'Complete React project examples from Traversy and Net Ninja', industry: 'Web Development' },
      { name: 'Sample React projects / clones', description: 'Netflix clone, notes app, and other starter projects on GitHub', industry: 'Web Development' }
    ], { transaction, returning: true });

    await Section.bulkCreate([
      { name: reactExamples[0].name, description: reactExamples[0].description, type: 'EXAMPLE', contentId: reactExamples[0].id, sectionId: reactVideoSections[0].id, moduleId: reactModule.id },
      { name: reactExamples[1].name, description: reactExamples[1].description, type: 'EXAMPLE', contentId: reactExamples[1].id, sectionId: reactVideoSections[1].id, moduleId: reactModule.id }
    ], { transaction });

    const reactAssignment = await Assignment.create({ 
      name: 'Fullstack Frontend Project', 
      description: 'Build a full frontend for the project API from Module 3: React app that consumes the REST API (list, create, update, delete). Include routing (list/detail), forms with validation, and a deployable build. Host frontend demo (Vercel/Netlify) and link repo.' 
    }, { transaction, returning: true });
    await Section.create({ name: reactAssignment.name, description: reactAssignment.description, type: 'ASSIGNMENT', contentId: reactAssignment.id, sectionId: null, moduleId: reactModule.id }, { transaction });

    // Module 10: Deployment, Testing, DevOps Basics & Capstone
    const devopsModule = modules[9];
    console.log(`Creating content for ${devopsModule.name}...`);
    
    const devopsVideos = await Video.bulkCreate([
      { name: 'How to Deploy a React App with Vercel', description: 'Complete guide to deploying React applications on Vercel', url: 'https://www.youtube.com/watch?v=hAuyNf0Uk-w', transcript: 'Learn to deploy React apps to production using Vercel platform...' },
      { name: 'Deploy to Netlify – Step-by-Step', description: 'Comprehensive Netlify deployment guide with continuous integration', url: 'https://www.youtube.com/watch?v=0P53S34zm44', transcript: 'Master Netlify deployment for static sites and serverless functions...' },
      { name: 'Docker Crash Course – TechWorld or Traversy Media', description: 'Containerization fundamentals for backend applications', url: 'https://www.youtube.com/watch?v=pg19Z8LL06w', transcript: 'Learn Docker basics for containerizing Node.js applications...' }
    ], { transaction, returning: true });

    const devopsVideoSections = await Section.bulkCreate([
      { name: devopsVideos[0].name, description: devopsVideos[0].description, type: 'VIDEO', contentId: devopsVideos[0].id, sectionId: null, moduleId: devopsModule.id },
      { name: devopsVideos[1].name, description: devopsVideos[1].description, type: 'VIDEO', contentId: devopsVideos[1].id, sectionId: null, moduleId: devopsModule.id },
      { name: devopsVideos[2].name, description: devopsVideos[2].description, type: 'VIDEO', contentId: devopsVideos[2].id, sectionId: null, moduleId: devopsModule.id }
    ], { transaction, returning: true });

    const devopsResources = await Resource.bulkCreate([
      { name: 'Vercel docs — Deploying fullstack & frontend frameworks', description: 'Official deployment guides for modern web applications', url: 'https://vercel.com/docs' },
      { name: 'Netlify docs — continuous deploy and Netlify CLI', description: 'Complete documentation for Netlify platform and CLI tools', url: 'https://docs.netlify.com/' }
    ], { transaction, returning: true });

    await Section.bulkCreate([
      { name: devopsResources[0].name, description: devopsResources[0].description, type: 'RESOURCE', contentId: devopsResources[0].id, sectionId: devopsVideoSections[0].id, moduleId: devopsModule.id },
      { name: devopsResources[1].name, description: devopsResources[1].description, type: 'RESOURCE', contentId: devopsResources[1].id, sectionId: devopsVideoSections[1].id, moduleId: devopsModule.id }
    ], { transaction });

    const devopsExamples = await Example.bulkCreate([
      { name: 'Deploy fullstack (React + Node + Postgres) tutorial', description: 'Complete deployment guide for fullstack applications to cloud platforms', industry: 'DevOps' },
      { name: 'CI/CD: GitHub Actions starter workflows', description: 'Example repositories with GitHub Actions for Node.js deployment', industry: 'DevOps' }
    ], { transaction, returning: true });

    await Section.bulkCreate([
      { name: devopsExamples[0].name, description: devopsExamples[0].description, type: 'EXAMPLE', contentId: devopsExamples[0].id, sectionId: devopsVideoSections[0].id, moduleId: devopsModule.id },
      { name: devopsExamples[1].name, description: devopsExamples[1].description, type: 'EXAMPLE', contentId: devopsExamples[1].id, sectionId: devopsVideoSections[2].id, moduleId: devopsModule.id }
    ], { transaction });

    const devopsAssignment = await Assignment.create({ 
      name: 'Capstone Project', 
      description: 'Complete and deploy a fullstack app (use your Module 3 API + Module 4 React frontend): Containerize backend with Docker (optional). Deploy frontend to Vercel or Netlify and backend to a provider (Render / Heroku / Vercel Serverless or any cloud). Add at least 5 unit/integration tests (Jest + React Testing Library for frontend; Jest / supertest for API). Provide a public GitHub repo, live URLs, and a short technical write-up with setup and CI instructions.' 
    }, { transaction, returning: true });
    await Section.create({ name: devopsAssignment.name, description: devopsAssignment.description, type: 'ASSIGNMENT', contentId: devopsAssignment.id, sectionId: null, moduleId: devopsModule.id }, { transaction });

    console.log('📝 Enrolling user to both courses...');
    await Enrollment.bulkCreate([
      { userId: user.id, courseId: aiCourse.id },
      { userId: user.id, courseId: webCourse.id },
    ], { transaction });

    await transaction.commit();
    console.log('🎉 Seed completed successfully');
  } catch (error) {
    await transaction.rollback();
    console.error('❌ Seed failed:', error);
    throw error;
  }
}

if (require.main === module) {
  seed().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = seed; 