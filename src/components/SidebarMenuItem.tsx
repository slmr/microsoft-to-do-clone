import { Box, ListIcon, ListItem, Text, useColorModeValue } from '@chakra-ui/react'
import React, { FC } from 'react'
import { IconType } from 'react-icons/lib'
import { Draggable } from 'react-beautiful-dnd'

const SidebarMenuItem: FC<{
  count: number
  onClick: VoidFunction
  isActive: boolean
  icon: IconType
  isDraggable?: boolean
  id?: string
  index?: number
}> = ({ count, onClick, isActive, icon, children, isDraggable = false, id, index }) => {
  const isSelectedBg = useColorModeValue('gray.200', `gray.700`)
  const hoverBgColorMode = useColorModeValue('gray.50', `gray.600`)
  const textColor = useColorModeValue('purple.500', 'purple.300')

  return isDraggable ? (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <ListItem
          ref={provided.innerRef}
          bg={isActive ? isSelectedBg : 'none'}
          _hover={{ bg: isActive ? isSelectedBg : hoverBgColorMode }}
          cursor="pointer"
          onClick={onClick}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Box display="flex" alignItems="center" py={2} px={4} whiteSpace="nowrap">
            <ListIcon as={icon} boxSize={4} mr={3} color={isActive ? textColor : 'gray.500'} />
            <Text
              overflow="hidden"
              whiteSpace="nowrap"
              display="inline-block"
              flex="1 1 0px"
              fontSize="sm"
              color={isActive ? textColor : 'inherit'}
              fontWeight={isActive ? '500' : '400'}
            >
              {children}
            </Text>
            <Text
              overflow="hidden"
              whiteSpace="nowrap"
              display="inline-block"
              fontSize="sm"
              color={isActive ? textColor : 'inherit'}
              fontWeight={isActive ? '500' : '400'}
            >
              {count > 0 ? count : null}
            </Text>
          </Box>
        </ListItem>
      )}
    </Draggable>
  ) : (
    <ListItem
      bg={isActive ? isSelectedBg : 'none'}
      _hover={{ bg: isActive ? isSelectedBg : hoverBgColorMode }}
      cursor="pointer"
      onClick={onClick}
    >
      <Box display="flex" alignItems="center" py={2} px={4} whiteSpace="nowrap">
        <ListIcon as={icon} boxSize={4} mr={3} color={isActive ? textColor : 'gray.500'} />
        <Text
          overflow="hidden"
          whiteSpace="nowrap"
          display="inline-block"
          flex="1 1 0px"
          fontSize="sm"
          color={isActive ? textColor : 'inherit'}
          fontWeight={isActive ? '500' : '400'}
        >
          {children}
        </Text>
        <Text
          overflow="hidden"
          whiteSpace="nowrap"
          display="inline-block"
          fontSize="sm"
          color={isActive ? textColor : 'inherit'}
          fontWeight={isActive ? '500' : '400'}
        >
          {count > 0 ? count : null}
        </Text>
      </Box>
    </ListItem>
  )
}

export default SidebarMenuItem
