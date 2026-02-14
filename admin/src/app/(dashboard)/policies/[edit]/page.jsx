'use client'
import { withAuth } from '@/context/WithAuth'

// Next.js Imports
import { useRouter, useParams } from 'next/navigation'

// MUI Imports
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'

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
    <Grid container spacing={6} className='admin-page-shell'>
      <Grid item xs={12}>
        <Card className='bs-full' sx={{ borderRadius: 3, border: '1px solid var(--mui-palette-divider)' }}>
          <CardHeader
            title='Edit Policy'
            subheader='Update trust and compliance documents shown to users.'
            action={
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
                <Chip color='info' size='small' label='Content Governance' sx={{ fontWeight: 700 }} />
                <Button variant='outlined' color='primary' onClick={sendRoutes} startIcon={<i className='ri-list-check-2' />}>
                  Policies List
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
            <EditForm type={edit} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default withAuth(EditAdmin)
