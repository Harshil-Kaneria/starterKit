'use client'
import { withAuth } from '@/context/WithAuth'

// MUI Imports
import Grid from '@mui/material/Grid'

// Components Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

import Table from '@/views/dashboard/policies/ListTable'

const AdminList = () => {
  return (
    <Grid container spacing={6} className='admin-page-shell'>
      <Grid item xs={12}>
        <Card className='bs-full' sx={{ borderRadius: 3, border: '1px solid var(--mui-palette-divider)' }}>
          <CardHeader
            title='Policy Center'
            subheader='Maintain platform trust documents and keep policy text up to date.'
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
