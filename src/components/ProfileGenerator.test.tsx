import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ProfileGenerator from './ProfileGenerator'
import { generateCompanyProfile } from '../services/ai-service'

jest.mock('../services/ai-service', () => ({
  generateCompanyProfile: jest.fn(),
}))

describe('ProfileGenerator', () => {
  const onProfileGenerated = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows error when URL is empty', () => {
    render(<ProfileGenerator onProfileGenerated={onProfileGenerated} />)
    fireEvent.click(screen.getByRole('button', { name: /generate profile/i }))
    expect(screen.getByText(/enter a company website url/i)).toBeInTheDocument()
    expect(generateCompanyProfile).not.toHaveBeenCalled()
  })

  it('shows error for invalid URL', () => {
    render(<ProfileGenerator onProfileGenerated={onProfileGenerated} />)
    const input = screen.getByPlaceholderText(/enter company website url/i)
    fireEvent.change(input, { target: { value: 'not-a-url.com' } })
    fireEvent.click(screen.getByRole('button', { name: /generate profile/i }))
    expect(screen.getByText(/please enter a valid url/i)).toBeInTheDocument()
    expect(generateCompanyProfile).not.toHaveBeenCalled()
  })

  it('calls generateCompanyProfile when URL is valid', async () => {
    const fakeProfile = {
      company_name: 'Test Co',
      service_line: [],
      company_description: '',
      tier1_keywords: [],
      tier2_keywords: [],
      emails: [],
      poc: [],
    }
    ;(generateCompanyProfile as jest.Mock).mockResolvedValueOnce(fakeProfile)

    render(<ProfileGenerator onProfileGenerated={onProfileGenerated} />)
    const input = screen.getByPlaceholderText(/enter company website url/i)
    fireEvent.change(input, { target: { value: 'https://mccarren.ai' } })
    fireEvent.click(screen.getByRole('button', { name: /generate profile/i }))

    expect(generateCompanyProfile).toHaveBeenCalledWith('https://mccarren.ai')
    await waitFor(() => {
      expect(onProfileGenerated).toHaveBeenCalledWith(fakeProfile)
    })
  })
})