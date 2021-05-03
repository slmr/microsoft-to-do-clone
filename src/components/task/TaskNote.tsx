import { Textarea, useColorModeValue } from '@chakra-ui/react'
import React, { FC, useState } from 'react'

const TaskNote: FC<{ initialValue: string; onSave: (value: string) => void }> = ({ initialValue, onSave }) => {
  const [value, setValue] = useState(initialValue)
  const bgColorMode = useColorModeValue('white', `gray.800`)

  return (
    <Textarea
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => {
        if (value) {
          onSave(value)
        }
      }}
      placeholder="Add note"
      focusBorderColor="purple.500"
      bg={bgColorMode}
      px={4}
      borderRadius="sm"
      boxShadow="sm"
      fontSize="sm"
      w="full"
    />
  )
}

export default TaskNote
