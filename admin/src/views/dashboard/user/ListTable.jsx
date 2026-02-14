'use client'

import { useState } from 'react'
import { confirmAlert } from 'react-confirm-alert'
import { IconButton, Stack, Tooltip } from '@mui/material'
import DataTableComponent from '@components/DataTableComponent'
import { useDeleteUserMutation, useUserListLazyQuery } from '@features/user/hooks'
import { toast } from 'react-toastify'

const ListTable = () => {
  const [refreshKey, setRefreshKey] = useState(0)
  const deleteMutation = useDeleteUserMutation()
  const { fetchData } = useUserListLazyQuery()

  const deleteUser = async data => {
    try {
      const response = await deleteMutation.mutateAsync(data)
      if (response.status) toast.success(response.message || 'Success!')
    } catch (err) {
      toast.error(err?.message || 'Something went wrong!')
    } finally {
      setRefreshKey(prev => prev + 1)
    }
  }

  const handleDelete = row => {
    confirmAlert({
      title: 'Confirm Delete',
      message: `Are you sure to delete ${row.name}?`,
      buttons: [
        { label: 'Yes', onClick: () => deleteUser({ secretId: row.secretId }) },
        { label: 'No', onClick: () => {} }
      ]
    })
  }

  const columns = [
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true
    },
    {
      name: 'Actions',
      cell: row => (
        <Stack direction='row' spacing={1}>
          <Tooltip title='Delete User'>
            <IconButton color='warning' size='small' onClick={() => handleDelete(row)}>
              <i className='ri-delete-bin-2-line text-[18px]' />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true
    }
  ]

  return <DataTableComponent key={refreshKey} fetchData={fetchData} columns={columns} />
}

export default ListTable
