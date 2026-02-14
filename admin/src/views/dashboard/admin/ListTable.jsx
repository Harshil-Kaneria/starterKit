'use client'

import { useEffect, useMemo } from 'react'
import { confirmAlert } from 'react-confirm-alert'
import { useRouter } from 'next/navigation'
import Card from '@mui/material/Card'
import { DataGrid } from '@mui/x-data-grid'
import CircularProgress from '@mui/material/CircularProgress'
import { toast } from 'react-toastify'
import { useAdminListQuery, useDeleteAdminMutation } from '@features/admin/hooks'

const ListTable = () => {
  const router = useRouter()
  const { data: response, isLoading, isError, error } = useAdminListQuery()
  const deleteMutation = useDeleteAdminMutation()

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || 'Something went wrong !')
    }
  }, [isError, error])

  const rowsData = useMemo(() => (response?.status ? response.data : []), [response])

  const handleEdit = row => {
    router.push(`/admin/${row.secretId}`)
  }

  const handleDelete = row => {
    confirmAlert({
      title: 'Confirm to submit',
      message: `Are you sure to delete ${row.name}`,
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              const result = await deleteMutation.mutateAsync({ secretId: row.secretId })
              if (result.status) toast.success(result.message || 'Success !')
            } catch (err) {
              toast.error(err?.message || 'Something went wrong !')
            }
          }
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    })
  }

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      renderCell: params => (
        <div style={{ display: 'flex', gap: '8px' }}>
          {params.row.adminType != 'superAdmin' ? (
            <>
              <i className='ri-edit-line text-[20px] text-primary' title='Edit' onClick={() => handleEdit(params.row)}></i>
              <i
                className='ri-delete-bin-2-line text-[20px] text-warning'
                title='Delete'
                onClick={() => handleDelete(params.row)}
              ></i>
            </>
          ) : (
            <></>
          )}
        </div>
      )
    }
  ]

  return (
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
  )
}

export default ListTable
