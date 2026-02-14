'use client'

// React Imports
import { useEffect, useMemo } from 'react'

// Next.js Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import { DataGrid } from '@mui/x-data-grid'
import CircularProgress from '@mui/material/CircularProgress'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { toast } from 'react-toastify'

// API Function
import { usePoliciesListQuery } from '@features/policy/hooks'

const ListTable = () => {
  const router = useRouter()
  const { data: response, isLoading, isError, error } = usePoliciesListQuery()

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || 'Something went wrong !')
    }
  }, [isError, error])

  const rowsData = useMemo(() => (response?.status ? response.data : []), [response])

  const handleEdit = row => {
    router.push(`/policies/${row.type}`)
  }

  const columns = [
    {
      field: 'type',
      headerName: 'Type',
      flex: 1,
      sortable: false,
      renderCell: params => (params.row.type == 'privacy_policy' ? 'Privacy Policy' : 'About')
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      renderCell: params => (
        <Tooltip title='Edit Policy'>
          <IconButton color='primary' size='small' onClick={() => handleEdit(params.row)}>
            <i className='ri-edit-line text-[18px]' />
          </IconButton>
        </Tooltip>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      sortable: false,
      renderCell: () => <Chip size='small' color='success' label='Active' sx={{ fontWeight: 700 }} />
    }
  ]

  return (
    <>
      <Card sx={{ borderRadius: 2, border: '1px solid var(--mui-palette-divider)' }}>
        <div style={{ height: '100%', width: '100%' }}>
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
              <CircularProgress />
            </div>
          ) : (
            <DataGrid
              rows={rowsData}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              disableSelectionOnClick
              autoHeight
              sx={{
                border: 0,
                backgroundColor: 'var(--mui-palette-background-paper)',
                '& .MuiDataGrid-columnHeaders': {
                  background: 'linear-gradient(90deg, rgba(22, 119, 255, 0.08) 0%, rgba(22, 119, 255, 0) 100%)'
                },
                '& .MuiDataGrid-row': {
                  backgroundColor: 'var(--mui-palette-background-paper)'
                },
                '& .MuiDataGrid-cell': {
                  borderColor: 'var(--mui-palette-divider)'
                },
                '& .MuiDataGrid-virtualScroller': {
                  backgroundColor: 'var(--mui-palette-background-paper)'
                }
              }}
            />
          )}
        </div>
      </Card>
    </>
  )
}

export default ListTable
