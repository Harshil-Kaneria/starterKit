'use client'
import { withAuth } from '@/context/WithAuth'

// Next.js Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'

// Components Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

import AddForm from '@/views/dashboard/admin/AddForm'

const AddAdmin = () => {
  const router = useRouter()
  const sendRoutes = () => router.push('/admin')

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card className='bs-full'>
          <CardHeader
            title='Add admin'
            action={
              <Button
                variant='outlined'
                color='primary'
                onClick={sendRoutes}
                startIcon={<i className='ri-list-check-2'></i>}
              >
                Admins list
              </Button>
            }
          />
          <CardContent>
            <AddForm />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default withAuth(AddAdmin)
