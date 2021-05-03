import { useAuth } from '@/context/auth-context'
import { useUser } from '@/context/user-context'
import {
  Avatar,
  Box,
  Button,
  chakra,
  Container,
  Heading,
  Icon,
  useColorModeValue,
  Flex,
  Text,
  Editable,
  EditableInput,
  EditablePreview,
  ButtonGroup,
  useEditableControls,
  useColorMode,
  IconButton,
  Alert,
  AlertIcon
} from '@chakra-ui/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useRef, useState } from 'react'
import { IoArrowForwardOutline, IoMoon, IoSunnyOutline } from 'react-icons/io5'
import firebase from '@/lib/firebase'
/* Here's a custom control */
function EditableControls() {
  const { isEditing, getSubmitButtonProps, getCancelButtonProps, getEditButtonProps } = useEditableControls()

  return (
    <Box ml={4}>
      {isEditing ? (
        <ButtonGroup justifyContent="center" size="sm">
          <Button variant="ghost" colorScheme="purple" aria-label="Save name" {...getSubmitButtonProps()} size="sm">
            Save
          </Button>
          <Button variant="ghost" aria-label="Cancel editing" {...getCancelButtonProps()} size="sm">
            Cancel
          </Button>
        </ButtonGroup>
      ) : (
        <Button variant="ghost" colorScheme="purple" aria-label="Edit name" size="sm" {...getEditButtonProps()}>
          Edit name
        </Button>
      )}
    </Box>
  )
}
const AccountSettingPage = () => {
  const { updateProfile } = useAuth()
  const user = useUser()
  const { colorMode, toggleColorMode } = useColorMode()
  const bg = useColorModeValue('purple.500', `purple.700`)
  const router = useRouter()
  const inputFileRef = useRef<HTMLInputElement>(null)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string>('')

  async function handleUploadProfilePicture(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files.length > 0) {
      setUploadErrorMessage('')
      setUploadStatus('pending')
      const allowedExtensions = ['jpg', 'png']
      const sizeLimit = 3145728
      const file = event.target.files[0]
      const fileExtension = file.name.split('.').pop()

      if (!allowedExtensions.includes(fileExtension)) {
        setUploadErrorMessage('file type not allowed')
        setUploadStatus('error')
        return
      }
      if (file.size > sizeLimit) {
        setUploadStatus('error')
        setUploadErrorMessage('file size too large')
        return
      }
      const storageRef = firebase.storage().ref(`${user.uid}`)
      const userProfileRef = storageRef.child(`profile.${file.name.split('.').pop()}`)
      const snapshot = await userProfileRef.put(file)
      const url = await snapshot.ref.getDownloadURL()
      await updateProfile({ photoURL: url })
      const storeageAllList = await storageRef.listAll()
      if (storeageAllList.items.length > 1) {
        const results = []
        const deletedItems = storeageAllList.items.filter((item) => item.name !== snapshot.ref.name)
        // eslint-disable-next-line no-plusplus
        for (let index = 0; index < deletedItems.length; index++) {
          const item = deletedItems[index]
          results.push(item.delete())
        }
        await Promise.all(results)
      }
      setUploadStatus('success')
    }
  }
  return (
    <>
      <Head>
        <title>My Account - To do Clone</title>
      </Head>
      <chakra.header bg={bg} h="52px">
        <Container
          maxW="container.lg"
          display="flex"
          alignItems="center"
          py={2}
          justifyContent="space-between"
          h="full"
        >
          <Heading size="md" color="white">
            My Account
          </Heading>
          <Flex align="center">
            <IconButton
              aria-label="Toggle color mode"
              display="flex"
              icon={<Icon as={colorMode === 'dark' ? IoSunnyOutline : IoMoon} />}
              onClick={toggleColorMode}
              mr={4}
              size="sm"
            />
            <Button
              aria-label="Back to App"
              rightIcon={<Icon as={IoArrowForwardOutline} boxSize={4} />}
              onClick={() => router.push('/tasks/inbox')}
              size="sm"
            >
              Back to App
            </Button>
          </Flex>
        </Container>
      </chakra.header>
      <chakra.main>
        <Container maxW="container.lg">
          <Heading size="md" mt={10} mb={4}>
            Personal information
          </Heading>
          <Box borderRadius="md" boxShadow="md" borderWidth="1px" p={4}>
            <Flex align="center" mb={2}>
              <Avatar size="2xl" src={user.photoURL} mr={6} />
              <Box>
                <chakra.input
                  ref={inputFileRef}
                  type="file"
                  display="none"
                  opacity={0}
                  visibility="hidden"
                  onChange={handleUploadProfilePicture}
                  accept=".jpg, .png"
                />
                <Box>
                  <Flex align="center">
                    <Button
                      aria-label="Change photo"
                      onClick={() => {
                        inputFileRef.current.click()
                      }}
                      isLoading={uploadStatus === 'pending'}
                    >
                      Change photo
                    </Button>
                    <Text ml={2} fontSize="xs" color="gray.400">
                      (max size: 3 Mb, type: .jpg, .png)
                    </Text>
                  </Flex>
                  {uploadErrorMessage && (
                    <Alert mt={2} status="error">
                      <AlertIcon />
                      {uploadErrorMessage}
                    </Alert>
                  )}
                </Box>
              </Box>
            </Flex>
            <Flex
              flexDir={['column', 'row']}
              alignItems={['flex-start', 'center']}
              justifyContent="space-between"
              borderBottomWidth="1px"
              py={2}
            >
              <Box w="24vw">
                <Text fontSize="sm">Name</Text>
              </Box>
              <Editable
                display="flex"
                alignItems="center"
                flex="1 1 0px"
                justifyContent="space-between"
                w="100%"
                isPreviewFocusable={false}
                defaultValue={user.displayName}
                onSubmit={async (value) => {
                  await updateProfile({ displayName: value })
                }}
              >
                <Box flex="1 1 0px">
                  <EditablePreview fontWeight="500" />
                  <EditableInput />
                </Box>
                <EditableControls />
              </Editable>
            </Flex>
            <Flex
              flexDir={['column', 'row']}
              alignItems={['flex-start', 'center']}
              justifyContent="space-between"
              py={2}
            >
              <Box w="24vw">
                <Text fontSize="sm">Email</Text>
              </Box>
              <Flex align="center" flex="1 1 0px" justifyContent="space-between" w="100%">
                <Text fontWeight="500">{user.email}</Text>
              </Flex>
            </Flex>
          </Box>
        </Container>
      </chakra.main>
    </>
  )
}

export default AccountSettingPage
