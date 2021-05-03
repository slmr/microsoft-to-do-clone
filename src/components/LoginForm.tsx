import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
  Flex,
  Icon
} from '@chakra-ui/react'
import { useAuth } from '@/context/auth-context'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FcGoogle } from 'react-icons/fc'
import Link from '@/components/Link'

interface LoginValues {
  email: string
  password: string
}
const LoginForm = () => {
  const router = useRouter()
  const { login, authWithGoogle } = useAuth()
  const [loginError, setLoginError] = useState('')
  const bg = useColorModeValue('gray.100', `gray.800`)
  const cardBg = useColorModeValue('white', `gray.700`)
  const cardBoxShadow = useColorModeValue('lg', `var(--chakra-shadows-dark-lg)`)
  const color = useColorModeValue('purple.500', `purple.200`)

  const {
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<LoginValues>()

  const onSubmit = async ({ email, password }: LoginValues) => {
    setLoginError('')
    try {
      await login(email, password)
      router.push('/')
    } catch (error) {
      setLoginError('Invalid email or password')
    }
  }

  async function handleAuthWithGoogle() {
    try {
      setLoginError('')
      await authWithGoogle()
      router.push('/')
    } catch (error) {
      setLoginError(error.message)
    }
  }

  return (
    <>
      <Head>
        <title>Login - To do Clone</title>
      </Head>
      <Container h="100vh" minW="100%" display="flex" alignItems="center" justifyContent="center" bg={bg}>
        <Box maxW="md" width="full">
          <Box borderRadius="xl" p={12} bg={cardBg} boxShadow={cardBoxShadow}>
            <Flex align="center" mb={8}>
              <Icon viewBox="0 0 797 797" boxSize={16} mr={4}>
                <rect width="797" height="797" rx="108" fill="#805ad5" />
                <path
                  d="M666.875 232.5L378.9 562.9 260.63 444.622m-11.57 119.56L129.5 444.622M535.745 232.5L372.476 420.2"
                  fill="none"
                  stroke="#fff"
                  strokeLinecap="square"
                  strokeMiterlimit="10"
                  strokeWidth="44"
                />
              </Icon>
              <Heading>Sign in</Heading>
            </Flex>
            <Stack as="form" spacing={6} onSubmit={handleSubmit(onSubmit)}>
              {loginError && (
                <Alert status="error" aria-label="error">
                  <AlertIcon />
                  {loginError}
                </Alert>
              )}
              <Controller
                name="email"
                control={control}
                rules={{
                  required: { value: true, message: 'Please enter your email.' },
                  pattern: {
                    message: 'Please enter valid email',
                    value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                  }
                }}
                defaultValue=""
                render={({ field: { onChange, value }, fieldState: { invalid, error } }) => (
                  <FormControl id="email" isInvalid={invalid}>
                    <FormLabel>Email Address</FormLabel>
                    <Input type="text" onChange={onChange} value={value} />
                    <FormErrorMessage>{error?.message}</FormErrorMessage>
                  </FormControl>
                )}
              />
              <Controller
                name="password"
                control={control}
                rules={{ required: { value: true, message: 'Please enter a password.' } }}
                defaultValue=""
                render={({ field: { onChange, value }, fieldState: { invalid, error } }) => (
                  <FormControl id="password" isInvalid={invalid}>
                    <FormLabel>Password</FormLabel>
                    <Input type="password" onChange={onChange} value={value} />
                    <FormErrorMessage>{error?.message}</FormErrorMessage>
                  </FormControl>
                )}
              />

              <Button colorScheme="purple" size="lg" type="submit" isLoading={isSubmitting}>
                Sign In
              </Button>
            </Stack>
            <Box display="flex" alignItems="center" mt={6}>
              <Box flex="1 1 0%">
                <Divider />
              </Box>
              <Box px={2}>
                <Text color="gray.500" fontWeight="medium" fontSize="sm">
                  or continue with
                </Text>
              </Box>
              <Box flex="1 1 0%">
                <Divider />
              </Box>
            </Box>
            <Box mt={6}>
              <Button leftIcon={<FcGoogle />} size="lg" isFullWidth onClick={handleAuthWithGoogle} variant="outline">
                Google
              </Button>
            </Box>
            <Box mt={6}>
              <Text textAlign="center">
                Don&apos;t have an account?{' '}
                <Link href="/register" color={color} fontWeight="medium">
                  Register
                </Link>
              </Text>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  )
}

export default LoginForm
