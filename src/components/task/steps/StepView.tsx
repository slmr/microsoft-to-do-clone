import { Step } from '@/type/task'
import { Box, Flex, Icon, IconButton, ListItem, Tooltip, useColorModeValue } from '@chakra-ui/react'
import React, { FC, useState } from 'react'
import { IoCheckmarkCircle, IoCheckmarkCircleOutline, IoCloseOutline, IoRadioButtonOffOutline } from 'react-icons/io5'
import TextareaAutosize from 'react-textarea-autosize'
import { Draggable } from 'react-beautiful-dnd'

const StepView: FC<{
  index: number
  step: Step
  onToggleCompleted: (stepId: string, completed: boolean) => Promise<void>
  onRename: (stepId: string, title: string) => Promise<void>
  onDelete: (step: Step) => void
}> = ({ step, onToggleCompleted, onDelete, onRename, index }) => {
  const [stepTitle, setStepTitle] = useState(step.title)
  const color = useColorModeValue('purple.500', `purple.200`)
  const textColor = useColorModeValue('gray.500', `gray.400`)
  const hoverBgColor = useColorModeValue('gray.50', `gray.800`)
  async function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (stepTitle === '') {
        return
      }
      await onRename(step.id, stepTitle)
      const target = e.target as HTMLInputElement
      target.blur()
    }
  }

  return (
    <Draggable draggableId={step.id} index={index}>
      {(provide) => (
        <ListItem
          ref={provide.innerRef}
          key={step.id}
          sx={{ ':hover': { bg: hoverBgColor } }}
          borderBottomWidth="1px"
          mx={1}
          borderRadius="sm"
          {...provide.draggableProps}
        >
          <Flex align="center" minH="42px">
            <Tooltip label={`Mark as ${step.completed ? 'not completed' : 'completed'}`} hasArrow>
              <IconButton
                display="flex"
                variant="unstyled"
                aria-label={`Mark as ${step.completed ? 'not completed' : 'completed'}`}
                onClick={() => onToggleCompleted(step.id, !step.completed)}
                _hover={{
                  '.checkbox-complete': {
                    opacity: 1
                  }
                }}
                icon={
                  step.completed ? (
                    <Icon as={IoCheckmarkCircle} boxSize={5} fill={color} />
                  ) : (
                    <>
                      <Icon as={IoRadioButtonOffOutline} boxSize={5} stroke={color} />
                      <Icon
                        className="checkbox-complete"
                        position="absolute"
                        top="50%"
                        left="50%"
                        transform="translate(-50%, -50%)"
                        opacity={0}
                        as={IoCheckmarkCircleOutline}
                        boxSize={5}
                        stroke={color}
                      />
                    </>
                  )
                }
                mr={1}
              />
            </Tooltip>
            <Box
              flex="1 1 0px"
              display="flex"
              alignItems="center"
              py={1}
              minH="42px"
              sx={{
                '.resizeable-textarea': {
                  resize: 'none',
                  lineHeight: 'shorter',
                  textDecoration: step.completed ? 'line-through' : 'none',
                  border: 'none',
                  fontSize: 'sm',
                  width: '100%',
                  h: '100%',
                  opacity: 1,
                  color: step.completed ? 'gray.500' : textColor,
                  bg: 'transparent',
                  overflow: 'auto'
                }
              }}
              {...provide.dragHandleProps}
            >
              <TextareaAutosize
                value={stepTitle}
                maxLength={255}
                onChange={(e) => {
                  setStepTitle(e.target.value)
                }}
                onBlur={async () => {
                  if (stepTitle !== step.title) {
                    await onRename(step.id, stepTitle)
                  }
                }}
                className="resizeable-textarea"
                onKeyDown={handleKeyDown}
              />
            </Box>

            <Tooltip label="Delete step" hasArrow>
              <IconButton
                mr={2}
                color="gray.500"
                className="delete-step-button"
                display="flex"
                variant="ghost"
                size="sm"
                aria-label="Delete step"
                onClick={() => onDelete(step)}
                icon={<Icon as={IoCloseOutline} boxSize={5} />}
              />
            </Tooltip>
          </Flex>
        </ListItem>
      )}
    </Draggable>
  )
}

export default StepView
