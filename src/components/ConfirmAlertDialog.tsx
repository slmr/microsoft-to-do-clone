import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button
} from '@chakra-ui/react'
import React, { FC } from 'react'

const ConfirmAlertDialog: FC<{
  isOpen: boolean
  onClose: VoidFunction
  title: string
  description: string
  onConfirm: VoidFunction
  confirmText?: string
}> = ({ isOpen, onClose, title, description, onConfirm, confirmText = 'Delete task' }) => {
  return (
    <AlertDialog isOpen={isOpen} onClose={onClose} leastDestructiveRef={null} isCentered>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>{title}</AlertDialogHeader>

          <AlertDialogBody>{description}</AlertDialogBody>

          <AlertDialogFooter>
            <Button onClick={onClose}>Cancel</Button>
            <Button colorScheme="red" onClick={onConfirm} ml={3}>
              {confirmText}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}

export default ConfirmAlertDialog
