'use client'
import { withAuth } from '@/context/WithAuth'

// React Imports
import { useEffect } from 'react'

// Next.js Imports
import { useRouter, useParams } from 'next/navigation'

// MUI Imports
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'

// Components Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

import EditForm from '@/views/dashboard/policies/EditForm'

const EditAdmin = () => {
  const router = useRouter()
  const sendRoutes = () => router.push('/policies')
  const params = useParams()
  const { edit } = params

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card className='bs-full'>
          <CardHeader
            title='Update policy'
            action={
              <Button
                variant='outlined'
                color='primary'
                onClick={sendRoutes}
                startIcon={<i className='ri-list-check-2'></i>}
              >
                Policies list
              </Button>
            }
          />
          <CardContent>
            <EditForm type={edit} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default withAuth(EditAdmin)
