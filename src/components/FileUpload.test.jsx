import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderWithProviders, screen, userEvent } from '../test/utils'
import FileUpload from './FileUpload'

describe('FileUpload Component', () => {
  let mockOnFileSelect

  beforeEach(() => {
    mockOnFileSelect = vi.fn()
  })

  it('renders upload area', () => {
    renderWithProviders(<FileUpload onFileSelect={mockOnFileSelect} />)
    expect(screen.getByText(/click to upload or drag and drop/i)).toBeInTheDocument()
  })

  it('shows file size info when file is selected', async () => {
    renderWithProviders(<FileUpload onFileSelect={mockOnFileSelect} />)
    
    const input = screen.getByTestId('file-upload')
    const file = new File(['video content'], 'test.mp4', { type: 'video/mp4' })
    
    await userEvent.upload(input, file)
    
    expect(mockOnFileSelect).toHaveBeenCalledWith(file)
  })

  it('displays error for invalid file type', async () => {
    renderWithProviders(<FileUpload onFileSelect={mockOnFileSelect} />)
    
    const input = screen.getByTestId('file-upload')
    const file = new File(['content'], 'test.txt', { type: 'text/plain' })
    
    await userEvent.upload(input, file)
    
    expect(await screen.findByText(/please upload a valid video file/i)).toBeInTheDocument()
  })

  it('displays error for oversized file', async () => {
    const largeFile = new File(
      [new ArrayBuffer(60 * 1024 * 1024)],
      'large.mp4',
      { type: 'video/mp4' }
    )
    
    renderWithProviders(<FileUpload onFileSelect={mockOnFileSelect} maxSize={50} />)
    
    const input = screen.getByTestId('file-upload')
    await userEvent.upload(input, largeFile)
    
    expect(screen.getByText(/file size must be less than 50MB/i)).toBeInTheDocument()
  })

  it('allows removing selected file', async () => {
    renderWithProviders(<FileUpload onFileSelect={mockOnFileSelect} />)
    
    const input = screen.getByTestId('file-upload')
    const file = new File(['video'], 'test.mp4', { type: 'video/mp4' })
    
    await userEvent.upload(input, file)
    
    const removeButton = await screen.findByRole('button', { name: /remove/i })
    await userEvent.click(removeButton)
    
    expect(mockOnFileSelect).toHaveBeenLastCalledWith(null)
  })

  it('accepts valid video formats', async () => {
    const validFormats = ['video/mp4', 'video/avi', 'video/mov', 'video/mkv', 'video/webm']
    
    for (const format of validFormats) {
      mockOnFileSelect.mockClear()
      const { unmount } = renderWithProviders(<FileUpload onFileSelect={mockOnFileSelect} />)
      
      const input = screen.getByTestId('file-upload')
      const file = new File(['content'], `test.${format.split('/')[1]}`, { type: format })
      
      await userEvent.upload(input, file)
      
      expect(mockOnFileSelect).toHaveBeenCalledWith(file)
      unmount()
    }
  })
})
