import addNewStep from '@/lib/tasks/add-new-step'
import { Box, Button, Center, Flex, Icon, Input, useColorModeValue } from '@chakra-ui/react'
import React, { FC, useRef, useState } from 'react'
import { IoAddOutline, IoRadioButtonOffOutline } from 'react-icons/io5'

const StepAddInput: FC<{ taskId: string; userId: string }> = ({ taskId, userId }) => {
  const [value, setValue] = useState('')
  const [isInputFocus, setIsInputFocus] = useState(false)
  const color = useColorModeValue('purple.500', `purple.200`)
  const inputRef = useRef<HTMLInputElement>(null)
  async function handleAddNewStep() {
    await addNewStep(userId, taskId, { title: value })
    setValue('')
  }
  return (
    <Flex align="center">
      <Box>
        <Center boxSize={6}>
          <Icon
            as={isInputFocus ? IoRadioButtonOffOutline : IoAddOutline}
            cursor="pointer"
            stroke={color}
            boxSize={5}
            onClick={() => inputRef.current.focus()}
          />
        </Center>
      </Box>
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type="text"
        placeholder="Add step"
        border="none"
        size="sm"
        fontSize="sm"
        onFocus={() => setIsInputFocus(true)}
        onBlur={() => setIsInputFocus(false)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleAddNewStep()
          }
        }}
        sx={{
          '::placeholder': {
            color,
            opacity: 1
          }
        }}
        _focus={{
          boxShadow: 'none',
          '::placeholder': {
            color: 'gray.300',
            opacity: 1
          }
        }}
      />
      {value && (
        <Button variant="ghost" size="sm" colorScheme="purple" fontSize="xs" onClick={handleAddNewStep}>
          ADD
        </Button>
      )}
    </Flex>
  )
}

export default StepAddInput
