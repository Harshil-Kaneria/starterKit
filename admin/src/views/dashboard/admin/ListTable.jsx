'use client'

import { useState } from 'react'
import { confirmAlert } from 'react-confirm-alert'
import { useRouter } from 'next/navigation'
import { Chip, IconButton, Stack, Tooltip } from '@mui/material'
import DataTableComponent from '@components/DataTableComponent'
import { toast } from 'react-toastify'
import { useAdminListLazyQuery, useDeleteAdminMutation } from '@features/admin/hooks'

const ListTable = () => {
  const [refreshKey, setRefreshKey] = useState(0)
  const router = useRouter()
  const deleteMutation = useDeleteAdminMutation()
  const { fetchData } = useAdminListLazyQuery()

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
            } finally {
              setRefreshKey(prev => prev + 1)
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
      name: 'Type',
      selector: row => row.adminType,
      cell: row => (
        <Chip
          size='small'
          label={row.adminType}
          color={row.adminType === 'superadmin' ? 'secondary' : 'primary'}
          variant={row.adminType === 'superadmin' ? 'filled' : 'outlined'}
          sx={{ fontWeight: 700, textTransform: 'capitalize' }}
        />
      ),
      sortable: true
    },
    {
      name: 'Actions',
      cell: row => (
        <Stack direction='row' spacing={1}>
          {row.adminType !== 'superadmin' ? (
            <>
              <Tooltip title='Edit Admin'>
                <IconButton color='primary' size='small' onClick={() => handleEdit(row)}>
                  <i className='ri-edit-line text-[18px]' />
                </IconButton>
              </Tooltip>
              <Tooltip title='Delete Admin'>
                <IconButton color='warning' size='small' onClick={() => handleDelete(row)}>
                  <i className='ri-delete-bin-2-line text-[18px]' />
                </IconButton>
              </Tooltip>
            </>
          ) : null}
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
