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

import Table from '@/views/dashboard/admin/ListTable'

const AdminList = () => {
  const router = useRouter()
  const sendRoutes = () => router.push('/admin/add')

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card className='bs-full'>
          <CardHeader
            title='Admins'
            action={
              <Button
                variant='outlined'
                color='primary'
                onClick={sendRoutes}
                startIcon={<i className='ri-add-fill'></i>}
              >
                Add new admin
              </Button>
            }
          />
          <CardContent>
            <Table />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default withAuth(AdminList)
