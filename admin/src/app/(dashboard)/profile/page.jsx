'use client'

import { withAuth } from '@/context/WithAuth'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import ManageProfileForm from '@views/dashboard/profile/ManageProfileForm'

const ProfilePage = () => {
  return (
    <Grid container spacing={6} className='admin-page-shell'>
      <Grid item xs={12}>
        <Card className='bs-full' sx={{ borderRadius: 3, border: '1px solid var(--mui-palette-divider)' }}>
          <CardHeader
            title='Manage Profile'
            subheader='Review your account details and rotate your login password securely.'
            action={<Chip color='info' size='small' label='Account Security' sx={{ fontWeight: 700 }} />}
            sx={{
              '& .MuiCardHeader-title': { fontWeight: 800 },
              '& .MuiCardHeader-subheader': { maxWidth: 560 }
            }}
          />
          <CardContent>
            <ManageProfileForm />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default withAuth(ProfilePage)
