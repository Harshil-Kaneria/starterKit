'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { toast } from 'react-toastify'
import Grow from '@mui/material/Grow'
import Fade from '@mui/material/Fade'
import Skeleton from '@mui/material/Skeleton'

// Components Imports
import CustomAvatar from '@core/components/mui/Avatar'

import { useAdminDashboardQuery } from '@features/admin/hooks'

const DashboardCount = () => {
  const [data, setData] = useState(null)
  const [checked, setChecked] = useState(false)
  const { data: response, isError, error } = useAdminDashboardQuery()

  useEffect(() => {
    if (response?.status) {
      const allowedCards = ['Users', 'Admins']
      const dashboardData = (response.data || []).filter(item => allowedCards.includes(item.title))
      setData(dashboardData)
      setChecked(true)
    }
  }, [response])

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || 'Something went wrong !')
    }
  }, [isError, error])

  if (!data) {
    return (
      <Card className='bs-full'>
        <CardHeader title='Welcome' />
        <CardContent className='!pbs-5'>
          <Grid container spacing={2}>
            {[1, 2, 3, 4].map(item => (
              <Grid item xs={6} md={3} key={item}>
                <div className='flex items-center gap-3'>
                  <Skeleton variant='circular' width={40} height={40} />
                  <div>
                    <Skeleton variant='text' width={60} height={40} />
                    <Skeleton variant='text' width={100} height={24} />
                  </div>
                </div>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='bs-full' sx={{ borderRadius: 3, border: '1px solid var(--mui-palette-divider)' }}>
      <CardHeader
        title='Operations Snapshot'
        subheader='Live view of key admin entities'
        sx={{
          '& .MuiCardHeader-title': { fontWeight: 800, fontSize: '1.1rem' },
          '& .MuiCardHeader-subheader': { fontWeight: 500 }
        }}
      />
      <Divider />
      <CardContent className='!pbs-5'>
        <Grid container spacing={2}>
          {data.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              {/* Grow animation with staggered delay */}
              <Grow in={checked} style={{ transformOrigin: '0 0 0' }} timeout={1000}>
                <div
                  className='flex items-center justify-between gap-3 p-4 rounded-xl'
                  style={{
                    border: '1px solid var(--mui-palette-divider)',
                    background:
                      'linear-gradient(135deg, rgba(22, 119, 255, 0.12) 0%, rgba(22, 119, 255, 0.02) 55%, rgba(22, 119, 255, 0) 100%)'
                  }}
                >
                  <Fade in={checked} timeout={1500}>
                    <CustomAvatar variant='rounded' color={item.color} className='shadow-xs !is-12 !bs-12'>
                      <i className={item.icon}></i>
                    </CustomAvatar>
                  </Fade>
                  <div>
                    <Typography variant='h5' sx={{ fontWeight: 800 }}>
                      {item.stats}
                    </Typography>
                    <Typography color='text.secondary'>{item.title}</Typography>
                  </div>
                  <i className='ri-arrow-right-up-line text-primary text-[20px]' />
                </div>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default DashboardCount
