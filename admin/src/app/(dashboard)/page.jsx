'use client'
import { withAuth } from '@/context/WithAuth'

// MUI Imports
import Grid from '@mui/material/Grid'

// Components Imports
import DashboardCount from '@views/dashboard/DashboardCount'

const DashboardAnalytics = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <DashboardCount />
      </Grid>
    </Grid>
  )
}

export default withAuth(DashboardAnalytics)
