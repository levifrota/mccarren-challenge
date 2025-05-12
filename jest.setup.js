// Mock Vite's import.meta.env
global.import = {
  meta: {
    env: {
      VITE_OPENAI_KEY: 'mock-api-key',
      // Add any other environment variables your app uses
      MODE: 'test'
    }
  }
};