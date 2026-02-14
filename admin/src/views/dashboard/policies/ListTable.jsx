'use client'

// React Imports
import { useEffect, useMemo } from 'react'

// Next.js Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import { DataGrid } from '@mui/x-data-grid'
import CircularProgress from '@mui/material/CircularProgress'
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
        <div style={{ display: 'flex', gap: '8px' }}>
          <i className='ri-edit-line text-[20px] text-primary' title='Edit' onClick={() => handleEdit(params.row)}></i>
        </div>
      )
    }
  ]

  return (
    <>
      <Card>
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
            />
          )}
        </div>
      </Card>
    </>
  )
}

export default ListTable
