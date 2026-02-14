'use client'

// React Imports
import { useState, useEffect } from 'react'

// Next.js Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import { toast } from 'react-toastify'

// Formik and Yup Imports
import { Formik, Field, Form } from 'formik'
import * as Yup from 'yup'

// API Function
import { useAdminDetailsQuery, useUpdateAdminMutation } from '@features/admin/hooks'

const EditForm = ({ secretId }) => {
  const router = useRouter()
  const sendRoutes = () => router.push('/admin')
  const updateMutation = useUpdateAdminMutation()

  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [initialValues, setInitialValues] = useState({
    name: '',
    email: '',
    password: ''
  })

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const { data: detailResponse, isError, error } = useAdminDetailsQuery(secretId)

  useEffect(() => {
    if (detailResponse?.status) {
      const { name, email } = detailResponse.data
      setInitialValues({ name, email, password: '' })
    }
  }, [detailResponse])

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || 'Something went wrong !')
    }
  }, [isError, error])

  const handleSave = async (values, { setSubmitting }) => {
    try {
      const { password, ...otherValues } = values
      const requestData = password ? { ...values } : { ...otherValues }
      requestData.secretId = secretId
      const response = await updateMutation.mutateAsync(requestData)
      if (response.status) toast.success(response.message || 'Success !')
    } catch (err) {
      toast.error(err?.message || 'Something went wrong !')
    } finally {
      setSubmitting(false)
      sendRoutes()
    }
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters')
  })

  return (
    <Formik enableReinitialize initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSave}>
      {({ errors, touched, isSubmitting }) => (
        <Form id='edit-form'>
          <Stack sx={{ width: '100%', minWidth: 0, rowGap: 5 }}>
            <Alert severity='info' icon={<i className='ri-shield-check-line' />}>
              Update identity details below. Leave password empty if no password change is needed.
            </Alert>
            <Grid container spacing={5}>
              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  name='name'
                  fullWidth
                  label='Full Name'
                  placeholder='John Doe'
                  error={touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  name='email'
                  type='email'
                  fullWidth
                  label='Work Email'
                  placeholder='john@company.com'
                  error={touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  name='password'
                  fullWidth
                  type={isPasswordShown ? 'text' : 'password'}
                  label='New Password (Optional)'
                  placeholder='********'
                  error={touched.password && !!errors.password}
                  helperText={touched.password && errors.password ? errors.password : 'Leave blank to keep existing password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          size='small'
                          edge='end'
                          onClick={handleClickShowPassword}
                          onMouseDown={e => e.preventDefault()}
                          aria-label='toggle password visibility'
                        >
                          <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
            </Grid>
            <Box
              sx={{
                px: 4,
                py: 3,
                borderRadius: 2,
                border: '1px dashed var(--mui-palette-divider)',
                backgroundColor: 'var(--mui-palette-action-hover)'
              }}
            >
              <Typography variant='body2' color='text.secondary'>
                Tip: Only rotate password when needed. This action impacts the admin account next login.
              </Typography>
            </Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent='flex-end'>
              <Button variant='outlined' color='secondary' onClick={sendRoutes} startIcon={<i className='ri-arrow-left-line' />}>
                Cancel
              </Button>
              <Button type='submit' variant='contained' color='primary' startIcon={<i className='ri-save-line' />} disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Admin'}
              </Button>
            </Stack>
          </Stack>
        </Form>
      )}
    </Formik>
  )
}

export default EditForm
