'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Card, CircularProgress, TextField } from '@mui/material'
import DataTable from 'react-data-table-component'
import { toast } from 'react-toastify'

const DataTableComponent = ({ fetchData, columns, searchable = true }) => {
  const [loading, setLoading] = useState(true)
  const [rowsData, setRowsData] = useState([])
  const [totalRows, setTotalRows] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [delayedSearch, setDelayedSearch] = useState('')
  const typingTimeoutRef = useRef(null)
  const [sortData, setSortData] = useState({ column: '', direction: 'asc' })

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const requestParams = {
        start: (page - 1) * perPage,
        length: perPage,
        search: delayedSearch
      }

      if (sortData.column) {
        requestParams.orderColumn = sortData.column
        requestParams.orderDirection = sortData.direction
      }

      const response = await fetchData(requestParams)
      setRowsData(response.data)
      setTotalRows(response.recordsTotal)
    } catch (err) {
      toast.error(err?.message || 'Something went wrong!')
    } finally {
      setLoading(false)
    }
  }, [fetchData, page, perPage, delayedSearch, sortData.column, sortData.direction])

  useEffect(() => {
    loadData()
  }, [loadData])

  useEffect(() => {
    if (columns.length > 0 && !sortData.column) {
      setSortData(prev => ({
        ...prev,
        column: columns[0].name || columns[0].selector // Pick first available column
      }))
    }
  }, [columns, sortData.column])

  const handleSearch = e => {
    const value = e.target.value
    setSearch(value)

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      setDelayedSearch(value)
      setPage(1)
    }, 800)
  }

  const handlePageChange = newPage => setPage(newPage)

  const handleSort = (column, sortDirection) => {
    const columnName = column.name || column.selector
    if (columnName) {
      setSortData(prev => ({
        column: columnName,
        direction: prev.column === columnName && prev.direction === 'asc' ? 'desc' : 'asc'
      }))
    }
  }

  return (
    <Card>
      <div style={{ height: '100%', width: '100%' }}>
        {searchable && (
          <div className='flex justify-end m-5'>
            <TextField label='Search' value={search} onChange={handleSearch} size='small' variant='outlined' />
          </div>
        )}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
            <CircularProgress />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={rowsData}
            progressPending={loading}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            onChangePage={handlePageChange}
            onSort={handleSort}
            sortServer={true}
            paginationDefaultPage={page}
            defaultSortFieldId={sortData.column}
            defaultSortAsc={sortData.direction === 'asc'}
            paginationComponentOptions={{ noRowsPerPage: true }}
          />
        )}
      </div>
    </Card>
  )
}

export default DataTableComponent
