/**
 * Environment configuration for the application
 */
module.exports = {
  // Gumlet configuration
  gumlet: {
    collectionId: process.env.GUMLET_COLLECTION_ID || '681def920fafb76d8bcaf064',
    apiKey: process.env.GUMLET_API_KEY || 'gumlet_bcbcc47e5fc99515e7541d655ceee8ac'
  }
}; 