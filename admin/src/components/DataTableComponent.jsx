'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { alpha, useTheme } from '@mui/material/styles'
import { Box, Card, Chip, CircularProgress, InputAdornment, TextField, Typography } from '@mui/material'
import DataTable from 'react-data-table-component'
import { toast } from 'react-toastify'

const DataTableComponent = ({ fetchData, columns, searchable = true }) => {
  const theme = useTheme()
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
      setRowsData(Array.isArray(response?.data) ? response.data : [])
      setTotalRows(Number(response?.recordsTotal) || 0)
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
      setSortData({
        column: columnName,
        direction: sortDirection
      })
    }
  }

  const customStyles = {
    table: {
      style: {
        backgroundColor: theme.palette.background.paper
      }
    },
    headCells: {
      style: {
        color: theme.palette.text.secondary,
        fontSize: '0.75rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.06em'
      }
    },
    cells: {
      style: {
        color: theme.palette.text.primary
      }
    },
    headRow: {
      style: {
        minHeight: '54px',
        borderTop: '1px solid var(--mui-palette-divider)',
        borderBottom: '1px solid var(--mui-palette-divider)',
        background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0)} 100%)`
      }
    },
    rows: {
      style: {
        minHeight: '56px',
        fontSize: '0.9rem',
        backgroundColor: theme.palette.background.paper,
        '&:not(:last-of-type)': {
          borderBottom: '1px solid var(--mui-palette-divider)'
        },
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.05)
        }
      }
    },
    pagination: {
      style: {
        borderTop: '1px solid var(--mui-palette-divider)',
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.secondary
      },
      pageButtonsStyle: {
        borderRadius: 8,
        color: theme.palette.text.secondary,
        fill: theme.palette.text.secondary,
        '&:disabled': {
          color: theme.palette.text.disabled,
          fill: theme.palette.text.disabled
        },
        '&:hover:not(:disabled)': {
          backgroundColor: alpha(theme.palette.primary.main, 0.14)
        },
        '&:focus': {
          outline: 'none',
          backgroundColor: alpha(theme.palette.primary.main, 0.2)
        }
      }
    },
    noData: {
      style: {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.secondary
      }
    }
  }

  return (
    <Card sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid var(--mui-palette-divider)' }}>
      <div style={{ height: '100%', width: '100%' }}>
        <Box
          sx={{
            px: 5,
            py: 4,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 3,
            background: 'linear-gradient(120deg, rgba(22, 119, 255, 0.08) 0%, rgba(22, 119, 255, 0.01) 75%)'
          }}
        >
          <div>
            <Typography variant='h6' sx={{ fontWeight: 700 }}>
              Records
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {loading ? 'Refreshing data...' : `${totalRows} total results`}
            </Typography>
          </div>
          <Chip
            size='small'
            color={loading ? 'warning' : 'success'}
            label={loading ? 'Syncing' : 'Live'}
            sx={{ fontWeight: 700 }}
          />
        </Box>
        {searchable && (
          <div className='flex justify-end mx-5 mt-4 mb-2'>
            <TextField
              label='Search records'
              value={search}
              onChange={handleSearch}
              size='small'
              variant='outlined'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <i className='ri-search-line text-[16px]' />
                  </InputAdornment>
                )
              }}
            />
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
            customStyles={customStyles}
            noDataComponent={
              <Box sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant='subtitle1' sx={{ fontWeight: 700 }}>
                  No records found
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Try adjusting your search query.
                </Typography>
              </Box>
            }
          />
        )}
      </div>
    </Card>
  )
}

export default DataTableComponent
