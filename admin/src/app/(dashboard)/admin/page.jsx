'use client'
import { withAuth } from '@/context/WithAuth'

// Next.js Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'

// Components Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

import Table from '@/views/dashboard/admin/ListTable'

const AdminList = () => {
  const router = useRouter()
  const sendRoutes = () => router.push('/admin/add')

  return (
    <Grid container spacing={6} className='admin-page-shell'>
      <Grid item xs={12}>
        <Card className='bs-full' sx={{ borderRadius: 3, border: '1px solid var(--mui-palette-divider)' }}>
          <CardHeader
            title='Admin Management'
            subheader='Control privileged access, monitor admin roles, and enforce governance.'
            action={
              <Stack direction='row' spacing={2} alignItems='center'>
                <Chip color='info' label='Privileged Access' sx={{ fontWeight: 700 }} />
                <Button variant='contained' color='primary' onClick={sendRoutes} startIcon={<i className='ri-add-fill'></i>}>
                  Add New Admin
                </Button>
              </Stack>
            }
            sx={{ '& .MuiCardHeader-title': { fontWeight: 800 }, '& .MuiCardHeader-subheader': { maxWidth: 560 } }}
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
