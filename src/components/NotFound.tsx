import { Center, Heading, Text, Icon, Box, useColorModeValue } from '@chakra-ui/react'
import React, { FC } from 'react'

const NotFound: FC<{ type: 'task' | 'searchValue' | 'list' | string }> = ({ type }) => {
  const bg = useColorModeValue('white', 'gray.800')
  return (
    <Box position="absolute" top={0} left={0} right={0} bottom={0} bg={bg}>
      <Center h="100%" m="auto" maxW="2xl" flexDirection="column">
        {type === 'task' || type === 'list' ? (
          <>
            <Heading textAlign="center" color="purple.500" size="md">
              {type === 'task' ? 'Task' : 'List'} not found
            </Heading>
            <Text textAlign="center" fontSize="lg" color="gray.500">
              {type === 'task'
                ? "We can't find the task you're looking for. Try searching for it instead."
                : "We can't find the list you're looking for. Select one of your lists from the sidebar or create a new list."}
            </Text>
          </>
        ) : null}
        {type === 'searchValue' ? (
          <>
            <Icon viewBox="0 0 647.63626 632.17383" boxSize="3xs" mb={4}>
              <path
                d="M411.14603 142.17382H236.63626a15.01828 15.01828 0 00-15 15v387.85l-2 .61005-42.81006 13.11a8.00676 8.00676 0 01-9.98974-5.31L39.49613 137.48382a8.00313 8.00313 0 015.31006-9.99l65.97022-20.2 191.25-58.54 65.96972-20.2a7.98927 7.98927 0 019.99024 5.3l32.5498 106.32z"
                fill="#f2f2f2"
              />
              <path
                d="M449.22613 140.17382l-39.23-128.14a16.99368 16.99368 0 00-21.23-11.28l-92.75 28.39L104.7764 87.69384l-92.75 28.4a17.0152 17.0152 0 00-11.28028 21.23l134.08008 437.93a17.02661 17.02661 0 0016.26026 12.03 16.78926 16.78926 0 004.96972-.75l63.58008-19.46 2-.62v-2.09l-2 .61-64.16992 19.65a15.01489 15.01489 0 01-18.73-9.95l-134.06983-437.94a14.97935 14.97935 0 019.94971-18.73l92.75-28.4 191.24024-58.54 92.75-28.4a15.15551 15.15551 0 014.40966-.66 15.01461 15.01461 0 0114.32032 10.61l39.0498 127.56.62012 2h2.08008z"
                fill="#3f3d56"
              />
              <path
                d="M122.68092 127.8208a9.0157 9.0157 0 01-8.61133-6.3667l-12.88037-42.07178a8.99884 8.99884 0 015.9712-11.24023l175.939-53.86377a9.00867 9.00867 0 0111.24072 5.9707l12.88037 42.07227a9.01029 9.01029 0 01-5.9707 11.24072l-175.93949 53.86377a8.976 8.976 0 01-2.6294.39502z"
                fill="#805ad5"
              />
              <circle cx="190.15351" cy="24.95465" r="20" fill="#805ad5" />
              <circle cx="190.15351" cy="24.95465" r="12.66462" fill="#fff" />
              <path
                d="M602.63649 582.17382h-338a8.50981 8.50981 0 01-8.5-8.5v-405a8.50951 8.50951 0 018.5-8.5h338a8.50982 8.50982 0 018.5 8.5v405a8.51013 8.51013 0 01-8.5 8.5z"
                fill="#e6e6e6"
              />
              <path
                d="M447.13626 140.17382h-210.5a17.02411 17.02411 0 00-17 17v407.8l2-.61v-407.19a15.01828 15.01828 0 0115-15h211.12012zm183.5 0h-394a17.02411 17.02411 0 00-17 17v458a17.0241 17.0241 0 0017 17h394a17.0241 17.0241 0 0017-17v-458a17.02411 17.02411 0 00-17-17zm15 475a15.01828 15.01828 0 01-15 15h-394a15.01828 15.01828 0 01-15-15v-458a15.01828 15.01828 0 0115-15h394a15.01828 15.01828 0 0115 15z"
                fill="#3f3d56"
              />
              <path
                d="M525.63649 184.17382h-184a9.01015 9.01015 0 01-9-9v-44a9.01016 9.01016 0 019-9h184a9.01016 9.01016 0 019 9v44a9.01015 9.01015 0 01-9 9z"
                fill="#805ad5"
              />
              <circle cx="433.63626" cy="105.17383" r="20" fill="#805ad5" />
              <circle cx="433.63626" cy="105.17383" r="12.18187" fill="#fff" />
            </Icon>
            <Text fontSize="xl" color="gray.500" fontWeight="600" textAlign="center">
              We searched high and low but couldn’t find what you’re looking for.
            </Text>
          </>
        ) : null}
      </Center>
    </Box>
  )
}

export default NotFound
