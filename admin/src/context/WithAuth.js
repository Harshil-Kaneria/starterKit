'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import { useAuthState } from '@store/auth'

export const withAuth = (Component) => {
  return props => {
    const { user, loading } = useAuthState()
    const router = useRouter()

    useEffect(() => {
      if (!loading && !user) {
        router.push('/login')
      }
    }, [user, loading, router])

    if (loading || !user) {
      return (
        <Box
          display='flex'
          justifyContent='center'
          alignItems='center'
          width='100vw'
          height='100vh'
          position='fixed'
          top={0}
          left={0}
          zIndex={9999}
          bgcolor='white'
        >
          <CircularProgress />
        </Box>
      )
    }

    return <Component {...props} />
  }
}
