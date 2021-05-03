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
import Link from '../components/Link'

interface LoginValues {
  name: string
  email: string
  password: string
}
const Register = () => {
  const router = useRouter()
  const { register, authWithGoogle } = useAuth()

  const {
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<LoginValues>()
  const [registerError, setRegisterError] = useState('')
  const onSubmit = async ({ name, email, password }: LoginValues) => {
    try {
      setRegisterError('')
      await register({ name, email, password })
      router.push('/')
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setRegisterError(error.message)
      }
    }
  }

  async function handleAuthWithGoogle() {
    try {
      setRegisterError('')
      await authWithGoogle()
      router.push('/')
    } catch (error) {
      setRegisterError(error.message)
    }
  }

  const bg = useColorModeValue('gray.100', `gray.800`)
  const cardBg = useColorModeValue('white', `gray.700`)
  const cardBoxShadow = useColorModeValue('lg', `var(--chakra-shadows-dark-lg)`)
  const color = useColorModeValue('purple.500', `purple.200`)

  return (
    <>
      <Head>
        <title>Register - To do Clone</title>
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
              <Heading>Sign up</Heading>
            </Flex>
            <Box mt={6}>
              <Button leftIcon={<FcGoogle />} size="lg" isFullWidth onClick={handleAuthWithGoogle} variant="outline">
                Google
              </Button>
            </Box>
            <Box display="flex" alignItems="center" my={6}>
              <Box flex="1 1 0%">
                <Divider />
              </Box>
              <Box px={2}>
                <Text color="gray.500" fontWeight="medium" fontSize="sm">
                  or sign up with
                </Text>
              </Box>
              <Box flex="1 1 0%">
                <Divider />
              </Box>
            </Box>

            <Stack as="form" spacing={6} onSubmit={handleSubmit(onSubmit)}>
              {registerError && (
                <Alert status="error" aria-label="error">
                  <AlertIcon />
                  {registerError}
                </Alert>
              )}
              <Controller
                name="name"
                control={control}
                rules={{
                  required: { value: true, message: 'Please enter your name.' }
                }}
                defaultValue=""
                render={({ field: { onChange, value }, fieldState: { invalid, error } }) => (
                  <FormControl id="name" isInvalid={invalid}>
                    <FormLabel>Name</FormLabel>
                    <Input type="text" onChange={onChange} value={value} />
                    <FormErrorMessage>{error?.message}</FormErrorMessage>
                  </FormControl>
                )}
              />
              <Controller
                name="email"
                control={control}
                rules={{
                  required: { value: true, message: 'Please enter your email.' },
                  pattern: {
                    message: 'Please enter valid email.',
                    value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                  }
                }}
                defaultValue=""
                render={({ field: { onChange, value }, fieldState: { invalid, error } }) => (
                  <FormControl id="email" isInvalid={invalid}>
                    <FormLabel>Email Address</FormLabel>
                    <Input type="email" onChange={onChange} value={value} />
                    <FormErrorMessage>{error?.message}</FormErrorMessage>
                  </FormControl>
                )}
              />
              <Controller
                name="password"
                control={control}
                rules={{
                  required: { value: true, message: 'Please enter a password.' },
                  minLength: { value: 6, message: 'Password should be at least 6 characters' }
                }}
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
                Register
              </Button>
            </Stack>

            <Box mt={6}>
              <Text textAlign="center">
                Already have an account?{' '}
                <Link href="/login" color={color} fontWeight="medium">
                  Login
                </Link>
              </Text>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  )
}

export default Register
