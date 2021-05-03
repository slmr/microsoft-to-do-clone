import { useTaskType } from '@/context/task-type-context'
import { useUser } from '@/context/user-context'
import addNewTask from '@/lib/tasks/add-new-task'
import {
  InputLeftElement,
  Icon,
  Input,
  InputGroup,
  Button,
  InputRightElement,
  useColorModeValue
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { IoAddOutline, IoRadioButtonOffOutline } from 'react-icons/io5'

const AddTask = () => {
  const [task, setTask] = useState('')
  const [isInputFocus, setIsInputFocus] = useState(false)
  const user = useUser()
  const { taskType } = useTaskType()
  const color = useColorModeValue('purple.500', `purple.200`)
  const borderborderBottomColorColorMode = useColorModeValue('gray.200', `gray.600`)

  async function handleSubmit() {
    try {
      await addNewTask({
        userId: user.uid,
        taskType: taskType.type === 'list' ? 'list' : 'inbox',
        data: {
          title: task,
          listId: taskType.type === 'list' ? taskType.id : 'inbox',
          myday: taskType.id === 'myday',
          important: taskType.id === 'important'
        }
      })
      setTask('')
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <InputGroup size="lg">
      <InputLeftElement pointerEvents="none">
        <Icon as={isInputFocus ? IoRadioButtonOffOutline : IoAddOutline} color="gray.500" boxSize={6} />
      </InputLeftElement>
      <Input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Add a task"
        onFocus={() => setIsInputFocus(true)}
        onBlur={() => setIsInputFocus(false)}
        fontSize="sm"
        borderTopWidth="0"
        borderLeftWidth="0"
        borderRightWidth="0"
        onKeyDown={(e) => {
          if (task === '') {
            return
          }
          if (e.key === 'Enter') {
            handleSubmit()
          }
        }}
        borderBottomWidth="1px"
        borderBottomColor={borderborderBottomColorColorMode}
        borderRadius="0"
        pl="3.25rem"
        sx={{
          '::placeholder': {
            color,
            opacity: 1
          }
        }}
        _focus={{
          boxShadow: '0 1px 0 0px #805ad5',
          '::placeholder': {
            color: 'gray.300',
            opacity: 1
          }
        }}
      />
      {task && (
        <InputRightElement>
          <Button variant="ghost" colorScheme="purple" size="sm" onClick={handleSubmit}>
            ADD
          </Button>
        </InputRightElement>
      )}
    </InputGroup>
  )
}

export default AddTask
