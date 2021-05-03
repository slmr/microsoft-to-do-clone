import { List, ListItem, Skeleton } from '@chakra-ui/react'
import React from 'react'

const TaskListSkeleton = () => {
  return (
    <List>
      {Array.from({ length: 15 }).map((v, index) => (
        <ListItem
          key={`skeleton-task-${index + 1}`}
          minH="52px"
          display="flex"
          alignItems="center"
          px={4}
          sx={{
            ':not(:last-child)': {
              borderBottomWidth: '1px'
            }
          }}
        >
          <Skeleton h="18px" borderRadius="full" w="18px" mr={4} />
          <Skeleton h="18px" w="100%" />
        </ListItem>
      ))}
    </List>
  )
}

export default TaskListSkeleton
