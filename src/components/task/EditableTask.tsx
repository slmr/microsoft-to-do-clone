import updateTask from '@/lib/tasks/update-task'
import { Task } from '@/type/task'
import {
  Box,
  Center,
  chakra,
  Flex,
  Icon,
  IconButton,
  Tooltip,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import {
  IoCheckmarkCircle,
  IoCheckmarkCircleOutline,
  IoRadioButtonOffOutline,
  IoStar,
  IoStarOutline
} from 'react-icons/io5'
import TextareaAutosize from 'react-textarea-autosize'

const EditableTask = ({ userId, task }: { task: Task; userId: string }) => {
  const [editableValue, setEditableValue] = useState('')
  const { isOpen, onClose, onOpen } = useDisclosure()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [caretPosition, setCaretPosition] = useState<number>(0)

  // Set curet position
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.setSelectionRange(caretPosition, caretPosition)
    }
  }, [caretPosition, isOpen])

  // Initial content value
  useEffect(() => {
    if (task?.title) {
      setEditableValue(task?.title)
    }
  }, [task, setEditableValue])

  // Close editable content when router/task id change
  useEffect(() => {
    onClose()
  }, [onClose, task])

  async function toggleMarkImportant() {
    await updateTask(userId, task.id, { important: !task.important })
  }
  async function toggleMarkCompleted() {
    await updateTask(userId, task.id, { completed: !task.completed })
  }
  async function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (editableValue === '') {
        return
      }
      await updateTask(userId, task?.id, { title: editableValue })
      const target = e.target as HTMLInputElement
      target.blur()
    }
  }
  const color = useColorModeValue('purple.500', `purple.200`)
  const hoverColor = useColorModeValue('gray.100', `gray.600`)
  const bgColor = useColorModeValue('gray.50', `gray.700`)
  const focusBoxShadow = useColorModeValue(
    'var(--chakra-colors-purple-500) 0px 0px 0px 1px',
    `var(--chakra-colors-purple-200) 0px 0px 0px 1px`
  )

  return (
    <Flex align="center" px={3} pt={3}>
      <Tooltip label={`Mark as ${task?.completed ? 'not completed' : 'completed'}`} hasArrow>
        <Box
          sx={{
            ':hover': {
              '.checkbox-complete': {
                opacity: 1
              }
            }
          }}
          role="button"
          onClick={toggleMarkCompleted}
        >
          <Center boxSize={6} position="relative" mr={1}>
            {task?.completed ? (
              <Icon as={IoCheckmarkCircle} boxSize={6} fill={color} />
            ) : (
              <>
                <Icon as={IoRadioButtonOffOutline} boxSize={6} stroke={color} />
                <Icon
                  position="absolute"
                  top="50%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                  opacity={0}
                  as={IoCheckmarkCircleOutline}
                  className="checkbox-complete"
                  boxSize={6}
                  stroke={color}
                />
              </>
            )}
          </Center>
        </Box>
      </Tooltip>

      <Box
        flex="1 1 0px"
        py={1}
        display="flex"
        sx={{
          '.resizeable-textarea': {
            resize: 'none',
            lineHeight: 'shorter',
            p: 2,
            border: 'none',
            borderRadius: 'sm',
            fontSize: 'md',
            fontWeight: 'medium',
            bg: bgColor,
            width: '100%',
            h: '36px',
            overflow: 'auto',
            ':focus': {
              boxShadow: focusBoxShadow
            }
          }
        }}
      >
        {isOpen ? (
          <>
            <TextareaAutosize
              ref={textareaRef}
              value={editableValue}
              maxLength={255}
              onChange={(e) => {
                setEditableValue(e.target.value)
              }}
              onBlur={async () => {
                if (editableValue !== task.title) {
                  await updateTask(userId, task?.id, { title: editableValue })
                }
                onClose()
              }}
              className="resizeable-textarea"
              onKeyDown={handleKeyDown}
            />
          </>
        ) : (
          <Box
            overflow="visible"
            onClick={() => {
              const selObj = window.getSelection()
              setCaretPosition(selObj.focusOffset)
              onOpen()
            }}
            w="full"
            sx={{
              ':hover': {
                bg: hoverColor
              }
            }}
            userSelect="text"
            borderRadius="sm"
            lineHeight="shorter"
            p={2}
            wordBreak="break-word"
          >
            <chakra.span
              textDecoration={task?.completed ? 'line-through' : 'none'}
              color={task?.completed ? 'gray.500' : 'inherit'}
              fontSize="md"
              fontWeight="medium"
            >
              {editableValue}
            </chakra.span>
          </Box>
        )}
      </Box>

      <Tooltip label={task?.important ? 'Remove importance.' : 'Mark task as important.'} hasArrow>
        <IconButton
          aria-label={task?.important ? 'Remove importance.' : 'Mark task as important.'}
          variant="ghost"
          borderRadius="sm"
          size="sm"
          onClick={toggleMarkImportant}
          colorScheme="purple"
          icon={
            <Icon
              as={task?.important ? IoStar : IoStarOutline}
              boxSize={4}
              fill={task?.important ? color : 'currentColor'}
            />
          }
        />
      </Tooltip>
    </Flex>
  )
}

export default EditableTask
