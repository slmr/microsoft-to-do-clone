import { useRouter } from 'next/router'
import { render, fireEvent, screen, waitFor } from 'test-utils'
import Login from '@/pages/login'
import { useAuth } from '@/context/auth-context'

jest.mock('next/router', () => ({
  useRouter: jest.fn()
}))
jest.mock('@/context/auth-context')

describe('Login with email and password', () => {
  let expectedLogin: jest.Mock
  let expectedEmail: string
  let expectedPassword: string
  let expectedRouterPush: jest.Mock

  beforeEach(() => {
    expectedRouterPush = jest.fn()
    expectedLogin = jest.fn()
    expectedLogin.mockResolvedValue('')
    expectedEmail = 'test@test.com'
    expectedPassword = '123456'
    ;(useRouter as jest.Mock).mockReturnValue({ push: expectedRouterPush })
    ;(useAuth as jest.Mock).mockReturnValue({
      login: expectedLogin
    })
  })

  test('should show error for required fields', async () => {
    render(<Login />)
    const loginButton = screen.getByRole('button', { name: /sign in/i })
    fireEvent.click(loginButton)
    expect(await screen.findByText('Please enter your email.')).toBeVisible()
    expect(await screen.findByText('Please enter a password.')).toBeVisible()

    expect(expectedLogin).not.toHaveBeenCalled()
    expect(expectedRouterPush).not.toHaveBeenCalled()
  })

  test('should show alert error if password not match', async () => {
    expectedLogin.mockRejectedValue({
      message: 'Invalid email or password'
    })

    render(<Login />)
    const email = screen.getByRole('textbox', { name: /email address/i })
    const password = screen.getByLabelText(/password/i)
    const loginButton = screen.getByRole('button', { name: /sign in/i })

    fireEvent.change(email, { target: { value: 'foo@gmail.com' } })
    fireEvent.change(password, { target: { value: expectedPassword } })
    fireEvent.click(loginButton)

    await waitFor(() => {
      expect(expectedLogin).toHaveBeenCalledTimes(1)
      expect(expectedLogin).toHaveBeenCalledWith('foo@gmail.com', expectedPassword)
    })
    const errorAlert = screen.getByRole('alert', { name: /error/i })
    expect(errorAlert).toBeInTheDocument()
    expect(errorAlert).toHaveTextContent(/^Invalid email or password$/)
  })

  test('should redirect on login successfully', async () => {
    render(<Login />)
    const email = screen.getByRole('textbox', { name: /email address/i })
    const password = screen.getByLabelText(/password/i)
    const loginButton = screen.getByRole('button', { name: /sign in/i })

    fireEvent.change(email, { target: { value: expectedEmail } })
    fireEvent.change(password, { target: { value: expectedPassword } })
    fireEvent.click(loginButton)

    await waitFor(() => {
      expect(expectedLogin).toHaveBeenCalledTimes(1)
      expect(expectedLogin).toHaveBeenCalledWith(expectedEmail, expectedPassword)

      expect(expectedRouterPush).toHaveBeenCalledTimes(1)
      expect(expectedRouterPush).toHaveBeenCalledWith('/')
    })
  })
})

describe('Login with provider Google', () => {
  let expectedRegisterWithGoogle: jest.Mock
  let expectedRouterPush: jest.Mock

  beforeEach(() => {
    expectedRouterPush = jest.fn()
    expectedRegisterWithGoogle = jest.fn()
    expectedRegisterWithGoogle.mockResolvedValue('')
    ;(useAuth as jest.Mock).mockReturnValue({ authWithGoogle: expectedRegisterWithGoogle })
    ;(useRouter as jest.Mock).mockReturnValue({ push: expectedRouterPush })
  })

  test('should redirect to home page', async () => {
    render(<Login />)
    const registerWithGoogleButton = screen.getByRole('button', { name: /google/i })

    fireEvent.click(registerWithGoogleButton)

    await waitFor(() => {
      expect(expectedRegisterWithGoogle).toHaveBeenCalledTimes(1)
      expect(expectedRouterPush).toHaveBeenCalledTimes(1)
      expect(expectedRouterPush).toHaveBeenCalledWith('/')
    })
  })

  test('should display error when user close popup window login google', async () => {
    expectedRegisterWithGoogle.mockRejectedValue({
      code: 'auth/popup-closed-by-user',
      message: 'The popup has been closed by the user before finalizing the operation.'
    })
    render(<Login />)
    const registerWithGoogleButton = screen.getByRole('button', { name: /google/i })

    fireEvent.click(registerWithGoogleButton)

    await waitFor(() => {
      expect(expectedRegisterWithGoogle).toHaveBeenCalledTimes(1)
    })
    const errorAlert = screen.getByRole('alert', { name: /error/i })
    expect(errorAlert).toBeInTheDocument()
    expect(errorAlert).toHaveTextContent(/^The popup has been closed by the user before finalizing the operation.$/)
    expect(expectedRouterPush).not.toHaveBeenCalled()
  })
})
