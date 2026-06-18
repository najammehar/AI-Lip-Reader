import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock environment variables
process.env.VITE_CNN_API_URL = 'http://localhost:8000/cnn'
process.env.VITE_LANDMARKS_API_URL = 'http://localhost:8000/landmarks'
process.env.VITE_LANDMARKS_100_API_URL = 'http://localhost:8000/landmarks100'
process.env.VITE_FUSION_CROSSATTN_API_URL = 'http://localhost:8000/fusion'
process.env.VITE_FUSION_GATED_API_URL = 'http://localhost:8000/fusion/gated'
process.env.VITE_FUSION_CONCAT_API_URL = 'http://localhost:8000/fusion/concat'

// Mock fetch globally for API calls
global.fetch = vi.fn((url) => {
  const urlStr = typeof url === 'string' ? url : url.toString()
  
  const mockResponses = {
    '/cnn': { 
      success: true,
      prediction: 0.95, 
      labels: ['A', 'B', 'C'], 
      confidence: 0.95 
    },
    '/landmarks': { 
      success: true,
      landmarks: [[100, 100], [150, 150], [200, 200]], 
      frames_processed: 25 
    },
    '/landmarks100': { 
      success: true,
      landmarks: [[100, 100], [150, 150]], 
      confidence_scores: [0.95, 0.92] 
    },
    '/fusion': { 
      success: true,
      result: 'success', 
      prediction: 'HELLO',
      confidence: 0.88 
    },
    '/fusion/gated': { 
      success: true,
      result: 'success', 
      prediction: 'WORLD',
      confidence: 0.90 
    },
    '/fusion/concat': { 
      success: true,
      result: 'success', 
      prediction: 'TEST',
      confidence: 0.87 
    },
    '/health': { 
      status: 'healthy', 
      version: '1.0.0' 
    }
  }
  
  // Find matching mock response
  for (const [endpoint, response] of Object.entries(mockResponses)) {
    if (urlStr.includes(endpoint)) {
      return Promise.resolve(
        new Response(JSON.stringify(response), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      )
    }
  }
  
  // Return error for unmocked endpoints
  return Promise.resolve(
    new Response(JSON.stringify({ error: 'Unmocked endpoint' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    })
  )
})

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
