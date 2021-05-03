import Register from '@/pages/register'
import { fireEvent, render, screen, waitFor } from 'test-utils'
import { useRouter } from 'next/router'
import { useAuth } from '@/context/auth-context'

jest.mock('next/router')
jest.mock('@/context/auth-context')

describe('Register with email and password', () => {
  let expectedRegister: jest.Mock
  let expectedRouterPush: jest.Mock
  let expectedEmail: string
  let expectedPassword: string
  let expectedName: string
  beforeEach(() => {
    expectedRouterPush = jest.fn()
    expectedRegister = jest.fn()
    expectedRegister.mockResolvedValue('')
    expectedName = 'Affri'
    expectedEmail = 'test@test.com'
    expectedPassword = '123456'
    ;(useAuth as jest.Mock).mockReturnValue({ register: expectedRegister })
    ;(useRouter as jest.Mock).mockReturnValue({ push: expectedRouterPush })
  })

  test('should render correctly', () => {
    render(<Register />)
    const name = screen.getByRole('textbox', { name: /name/i })
    const email = screen.getByRole('textbox', { name: /email address/i })
    const password = screen.getByLabelText(/password/i)
    const registerButton = screen.getByRole('button', { name: /register/i })

    expect(name).toBeVisible()
    expect(email).toBeVisible()
    expect(password).toBeVisible()
    expect(registerButton).toBeVisible()
  })

  test('should show error for required fields', async () => {
    render(<Register />)

    const registerButton = screen.getByRole('button', { name: /register/i })

    fireEvent.submit(registerButton)

    expect(await screen.findByRole('button', { name: /loading/i })).toBeVisible()
    expect(await screen.findByText('Please enter your name.')).toBeVisible()
    expect(await screen.findByText('Please enter your email.')).toBeVisible()
    expect(await screen.findByText('Please enter a password.')).toBeVisible()

    expect(expectedRegister).not.toHaveBeenCalled()
    expect(expectedRouterPush).not.toHaveBeenCalled()
  })

  test('should display matching error when password length is invalid', async () => {
    render(<Register />)
    const name = screen.getByRole('textbox', { name: /name/i })
    const email = screen.getByRole('textbox', { name: /email address/i })
    const password = screen.getByLabelText(/password/i)
    const registerButton = screen.getByRole('button', { name: /register/i })

    fireEvent.change(name, { target: { value: expectedName } })
    fireEvent.change(email, { target: { value: expectedEmail } })
    fireEvent.change(password, { target: { value: '12345' } })
    fireEvent.click(registerButton)

    expect(await screen.findByText('Password should be at least 6 characters')).toBeVisible()

    expect(expectedRegister).not.toHaveBeenCalled()
    expect(expectedRouterPush).not.toHaveBeenCalled()
  })

  test('should display matching error when email is invalid', async () => {
    render(<Register />)
    const name = screen.getByRole('textbox', { name: /name/i })
    const email = screen.getByRole('textbox', { name: /email address/i })
    const password = screen.getByLabelText(/password/i)
    const registerButton = screen.getByRole('button', { name: /register/i })

    fireEvent.change(name, { target: { value: expectedName } })
    fireEvent.change(email, { target: { value: 'email' } })
    fireEvent.change(password, { target: { value: expectedPassword } })
    fireEvent.click(registerButton)

    expect(await screen.findByText('Please enter valid email.')).toBeVisible()

    expect(expectedRegister).not.toHaveBeenCalled()
    expect(expectedRouterPush).not.toHaveBeenCalled()
  })

  test('should show alert error if email already use by another account', async () => {
    expectedRegister.mockRejectedValue({ code: 'auth/email-already-in-use', message: 'Email already exist' })

    render(<Register />)
    const name = screen.getByRole('textbox', { name: /name/i })
    const email = screen.getByRole('textbox', { name: /email address/i })
    const password = screen.getByLabelText(/password/i)
    const registerButton = screen.getByRole('button', { name: /register/i })

    fireEvent.change(name, { target: { value: expectedName } })
    fireEvent.change(email, { target: { value: expectedEmail } })
    fireEvent.change(password, { target: { value: expectedPassword } })
    fireEvent.click(registerButton)
    await waitFor(() => {
      expect(expectedRegister).toHaveBeenCalledTimes(1)
      expect(expectedRegister).toHaveBeenCalledWith({
        name: expectedName,
        email: expectedEmail,
        password: expectedPassword
      })
    })
    const errorEmail = screen.getByRole('alert', { name: /error/i })
    expect(errorEmail).toBeInTheDocument()
    expect(errorEmail).toHaveTextContent(/^Email already exist$/)
    expect(expectedRouterPush).not.toHaveBeenCalled()
  })

  test('should redirect to home page', async () => {
    render(<Register />)
    const name = screen.getByRole('textbox', { name: /name/i })
    const email = screen.getByRole('textbox', { name: /email address/i })
    const password = screen.getByLabelText(/password/i)
    const registerButton = screen.getByRole('button', { name: /register/i })

    fireEvent.change(name, { target: { value: expectedName } })
    fireEvent.change(email, { target: { value: expectedEmail } })
    fireEvent.change(password, { target: { value: expectedPassword } })
    fireEvent.click(registerButton)

    await waitFor(() => {
      expect(expectedRegister).toHaveBeenCalledTimes(1)
      expect(expectedRegister).toHaveBeenCalledWith({
        name: expectedName,
        email: expectedEmail,
        password: expectedPassword
      })
      expect(expectedRouterPush).toHaveBeenCalledTimes(1)
      expect(expectedRouterPush).toHaveBeenCalledWith('/')
    })
  })
})

describe('Register provider Google', () => {
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
    render(<Register />)
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
    render(<Register />)
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
