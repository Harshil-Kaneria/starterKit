'use client'

import { useState } from 'react'
import { confirmAlert } from 'react-confirm-alert'
import { useRouter } from 'next/navigation'
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
      sortable: true
    },
    {
      name: 'Actions',
      cell: row => (
        <div style={{ display: 'flex', gap: '8px' }}>
          {row.adminType !== 'superAdmin' ? (
            <>
              <i className='ri-edit-line text-[20px] text-primary' title='Edit' onClick={() => handleEdit(row)}></i>
              <i
                className='ri-delete-bin-2-line text-[20px] text-warning'
                title='Delete'
                onClick={() => handleDelete(row)}
              ></i>
            </>
          ) : (
            <></>
          )}
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true
    }
  ]

  return <DataTableComponent key={refreshKey} fetchData={fetchData} columns={columns} />
}

export default ListTable
