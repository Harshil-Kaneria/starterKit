'use client'
import { withAuth } from '@/context/WithAuth'

// Next.js Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import Grid from '@mui/material/Grid'

// Components Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

import Table from '@/views/dashboard/user/ListTable'

const UserList = () => {
  const router = useRouter()

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card className='bs-full'>
          <CardHeader title='Users' />
          <CardContent>
            <Table />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default withAuth(UserList)
