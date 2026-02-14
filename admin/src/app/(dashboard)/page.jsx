'use client'
import { withAuth } from '@/context/WithAuth'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Link from 'next/link'

// Components Imports
import DashboardCount from '@views/dashboard/DashboardCount'

const DashboardAnalytics = () => {
  return (
    <Grid container spacing={6} className='admin-page-shell'>
      <Grid item xs={12}>
        <Card
          sx={{
            borderRadius: 4,
            border: '1px solid var(--mui-palette-divider)',
            background:
              'radial-gradient(circle at 15% 20%, rgba(22, 119, 255, 0.18) 0, rgba(22, 119, 255, 0.03) 38%, transparent 65%)'
          }}
        >
          <CardContent sx={{ p: { xs: 5, md: 8 } }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} justifyContent='space-between' alignItems='center'>
              <div>
                <Typography variant='h4' sx={{ fontWeight: 900, mb: 1 }}>
                  Admin Command Center
                </Typography>
                <Typography variant='body1' color='text.secondary'>
                  Monitor users, admins, and policies from one operating view.
                </Typography>
              </div>
              <Stack direction='row' spacing={2}>
                <Button component={Link} href='/admin' variant='contained' startIcon={<i className='ri-shield-user-line' />}>
                  Manage Admins
                </Button>
                <Chip color='success' label='System Healthy' sx={{ fontWeight: 700 }} />
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <DashboardCount />
      </Grid>
    </Grid>
  )
}

export default withAuth(DashboardAnalytics)
