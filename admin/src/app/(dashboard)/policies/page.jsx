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
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card className='bs-full'>
          <CardHeader title='Policies' />
          <CardContent>
            <Table />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default withAuth(AdminList)
