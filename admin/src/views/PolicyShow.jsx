'use client'

import { useEffect, useMemo } from 'react'
import CardContent from '@mui/material/CardContent'
import { toast } from 'react-toastify'
import { usePolicyByTypeQuery } from '@features/policy/hooks'

const PolicyShow = ({ type }) => {
  const { data: response, isError, error } = usePolicyByTypeQuery(type)
  const content = useMemo(() => (response?.status ? response.data?.content || '' : ''), [response])

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || 'Something went wrong!')
    }
  }, [isError, error])

  return (
    <div className='flex flex-col justify-center items-center min-bs-[100dvh] relative p-6'>
      <CardContent className='p-6 sm:!p-12'>
        {content ? (
          <div dangerouslySetInnerHTML={{ __html: content }} style={{ lineHeight: 1.6 }} />
        ) : (
          <p>Loading policy content...</p>
        )}
      </CardContent>
    </div>
  )
}

export default PolicyShow
