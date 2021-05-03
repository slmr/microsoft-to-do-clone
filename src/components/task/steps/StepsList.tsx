import deleteTaskStep from '@/lib/tasks/delete-task-step'
import reorderSteps from '@/lib/tasks/reorder-steps'
import updateTaskStep from '@/lib/tasks/update-task-step'
import { Step } from '@/type/task'
import { List, useDisclosure, Box } from '@chakra-ui/react'
import arrayMove from 'array-move'
import dynamic from 'next/dynamic'
import React, { FC, useEffect, useState } from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import AddStep from './StepAddInput'

import StepView from './StepView'

const AlertDialog = dynamic(() => import('@/components/ConfirmAlertDialog'))

const TaskSteps: FC<{ steps: Step[]; taskId: string; userId: string }> = ({ steps, userId, taskId }) => {
  const [sortableSteps, setSortableSteps] = useState<Step[]>([])
  const alertDialog = useDisclosure()
  const [selectedStep, setSelectedStep] = useState<Step>(null)

  async function handleDeleteStep() {
    await deleteTaskStep(userId, taskId, selectedStep)
    setSelectedStep(null)
    alertDialog.onClose()
  }
  async function handleToggleTaskStepCompleted(stepId: string, completed: boolean) {
    await updateTaskStep(
      userId,
      taskId,
      steps.map((step) => {
        if (step.id === stepId) {
          return { ...step, completed }
        }
        return step
      })
    )
  }
  async function handleRenameStep(stepId: string, newTitle: string) {
    await updateTaskStep(
      userId,
      taskId,
      steps.map((step) => {
        if (step.id === stepId) {
          return { ...step, title: newTitle }
        }
        return step
      })
    )
  }
  function handleOnDelete(step: Step) {
    setSelectedStep(step)
    alertDialog.onOpen()
  }
  async function handleDragEnd(result) {
    if (!result.destination) {
      return
    }
    const newOrderTasks = arrayMove(steps, result.source.index, result.destination.index)
    try {
      setSortableSteps(newOrderTasks)
      await reorderSteps(userId, taskId, newOrderTasks)
    } catch (error) {
      setSortableSteps((prev) => prev)
    }
  }

  useEffect(() => {
    setSortableSteps(steps)
  }, [steps])
  return (
    <>
      {steps && steps.length > 0 && (
        <>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="droppable-task-steps">
              {(provided) => (
                <List ref={provided.innerRef} {...provided.droppableProps}>
                  {sortableSteps.map((step, index) => (
                    <StepView
                      index={index}
                      key={step.id}
                      step={step}
                      onToggleCompleted={handleToggleTaskStepCompleted}
                      onDelete={handleOnDelete}
                      onRename={handleRenameStep}
                    />
                  ))}
                  {provided.placeholder}
                </List>
              )}
            </Droppable>
          </DragDropContext>
          <AlertDialog
            isOpen={alertDialog.isOpen}
            title={`"${selectedStep?.title}"  will be permanently deleted.`}
            description="You won't be able to undo this action."
            onClose={alertDialog.onClose}
            onConfirm={handleDeleteStep}
            confirmText="Delete step"
          />
        </>
      )}
      <Box px={3} pb={3} pt={2}>
        <AddStep taskId={taskId} userId={userId} />
      </Box>
    </>
  )
}

export default TaskSteps
