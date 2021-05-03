import { useAuth } from '@/context/auth-context'
import { useUser } from '@/context/user-context'
import {
  Avatar,
  Box,
  chakra,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Portal,
  Switch,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React from 'react'
import {
  IoChevronForwardOutline,
  IoHelpOutline,
  IoLogOutOutline,
  IoNotificationsOutline,
  IoSettingsOutline
} from 'react-icons/io5'
import Link from './Link'
import SearchInput from './SearchInput'

const Header = () => {
  const { logout } = useAuth()
  const user = useUser()
  const router = useRouter()
  const searchInput = useDisclosure({ defaultIsOpen: router.query?.taskType === 'search' })
  const { colorMode, toggleColorMode } = useColorMode()
  const bg = useColorModeValue('purple.500', `purple.700`)

  return (
    <chakra.header bg={bg} zIndex={100} display="flex" alignItems="center" py={2} px={4}>
      <Link href="/" color="white" fontWeight="600" fontSize="lg" whiteSpace="nowrap" pr={4}>
        To do clone
      </Link>
      <SearchInput isOpen={searchInput.isOpen} onOpen={searchInput.onOpen} onClose={searchInput.onClose} />
      <HStack spacing={2} ml={1}>
        <Menu closeOnSelect={false}>
          <MenuButton
            as={IconButton}
            variant="unstyled"
            _hover={{
              bg: 'purple.300'
            }}
            size="sm"
            aria-label="Settings"
            title="Settings"
            display={[searchInput.isOpen ? 'none' : 'flex', 'flex']}
            icon={<Icon as={IoSettingsOutline} color="white" boxSize={5} />}
          />
          <Portal>
            <MenuList>
              <MenuItem>
                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="dark-mode" mb="0" flex="1 1 0px">
                    Dark mode
                  </FormLabel>
                  <Switch
                    id="dark-mode"
                    colorScheme="purple"
                    isChecked={colorMode === 'dark'}
                    onChange={() => toggleColorMode()}
                  />
                </FormControl>
              </MenuItem>
            </MenuList>
          </Portal>
        </Menu>
        <IconButton
          variant="unstyled"
          display={[searchInput.isOpen ? 'none' : 'flex', 'flex']}
          _hover={{
            bg: 'purple.300'
          }}
          size="sm"
          aria-label="Help & Feedback"
          title="Help & Feedback"
          icon={<Icon as={IoHelpOutline} color="white" boxSize={5} />}
        />
        <IconButton
          variant="unstyled"
          display={[searchInput.isOpen ? 'none' : 'flex', 'flex']}
          _hover={{
            bg: 'purple.300'
          }}
          size="sm"
          aria-label="What news"
          title="What news"
          icon={<Icon as={IoNotificationsOutline} color="white" boxSize={5} />}
        />
        <Menu closeOnSelect={false} gutter={10}>
          <MenuButton>
            <Avatar
              aria-label={`Account manager for ${user.displayName}`}
              title={`Account manager for ${user.displayName}`}
              size="sm"
              name={user.displayName}
              src={user.photoURL}
              borderWidth="1px"
            />
          </MenuButton>
          <Portal>
            <MenuList minW={['3xs', 'xs']} boxShadow="lg">
              <MenuItem alignItems="center" justifyContent="space-between" onClick={() => router.push('/account')}>
                <Box display="flex" alignItems="center">
                  <Avatar
                    aria-label={`Account manager for ${user.displayName}`}
                    title={`Account manager for ${user.displayName}`}
                    name={user.displayName}
                    src={user.photoURL}
                    borderWidth="1px"
                    mr={2}
                  />
                  <Box>
                    <Text fontWeight="medium" fontSize="md">
                      {user.displayName}
                    </Text>
                    <Text>{user.email}</Text>
                  </Box>
                </Box>
                <Box ml={2}>
                  <Icon as={IoChevronForwardOutline} boxSize={4} />
                </Box>
              </MenuItem>
              <MenuDivider />
              <MenuItem alignItems="center" justifyContent="space-between" onClick={() => logout()}>
                Logout
                <Icon as={IoLogOutOutline} boxSize={4} />
              </MenuItem>
              <MenuDivider />
              <MenuItem>
                <FormControl display="flex" alignItems="center">
                  <Text mb="0" flex="1 1 0px">
                    Dark mode
                  </Text>
                  <Switch
                    id="dark-mode"
                    colorScheme="purple"
                    isChecked={colorMode === 'dark'}
                    onChange={() => toggleColorMode()}
                  />
                </FormControl>
              </MenuItem>
            </MenuList>
          </Portal>
        </Menu>
      </HStack>
    </chakra.header>
  )
}

export default Header
