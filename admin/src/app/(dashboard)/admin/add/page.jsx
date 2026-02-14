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

import AddForm from '@/views/dashboard/admin/AddForm'

const AddAdmin = () => {
  const router = useRouter()
  const sendRoutes = () => router.push('/admin')

  return (
    <Grid container spacing={6} className='admin-page-shell'>
      <Grid item xs={12}>
        <Card className='bs-full' sx={{ borderRadius: 3, border: '1px solid var(--mui-palette-divider)' }}>
          <CardHeader
            title='Create Admin'
            subheader='Add a privileged user with secure credentials and controlled access.'
            action={
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
                <Chip color='warning' size='small' label='Sensitive Action' sx={{ fontWeight: 700 }} />
                <Button variant='outlined' color='primary' onClick={sendRoutes} startIcon={<i className='ri-list-check-2' />}>
                  Admins List
                </Button>
              </Stack>
            }
            sx={{
              '& .MuiCardHeader-title': { fontWeight: 800 },
              '& .MuiCardHeader-subheader': { maxWidth: 560 },
              '& .MuiCardHeader-content': { minWidth: 0 },
              '& .MuiCardHeader-action': { m: 0, pl: 2, alignSelf: { xs: 'stretch', sm: 'flex-start' } }
            }}
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
