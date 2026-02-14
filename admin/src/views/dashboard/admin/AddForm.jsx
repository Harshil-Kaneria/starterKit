'use client'

// React Imports
import { useState } from 'react'

// Next.js Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import { toast } from 'react-toastify'

// Formik and Yup Imports
import { Formik, Field, Form } from 'formik'
import * as Yup from 'yup'

// API Function
import { useRegisterAdminMutation } from '@features/admin/hooks'

const AddForm = () => {
  const router = useRouter()
  const sendRoutes = () => router.push('/admin')
  const registerMutation = useRegisterAdminMutation()

  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const handleSave = async (values, { setSubmitting }) => {
    try {
      const response = await registerMutation.mutateAsync(values)
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
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')
  })

  return (
    <Card>
      <Formik
        initialValues={{ name: '', email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSave}
      >
        {({ errors, touched, isSubmitting }) => (
          <>
            <CardHeader
              action={
                <Button
                  type='submit'
                  form='add-form'
                  variant='outlined'
                  color='primary'
                  startIcon={<i className='ri-save-line'></i>}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
              }
            />
            <CardContent>
              <Form id='add-form'>
                <Grid container spacing={5}>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name='name'
                      fullWidth
                      label='Name'
                      placeholder='John Doe'
                      error={touched.name && !!errors.name}
                      helperText={touched.name && errors.name}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name='email'
                      type='email'
                      fullWidth
                      label='Email'
                      placeholder='johndoe@gmail.com'
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
                      label='Password'
                      placeholder='············'
                      error={touched.password && !!errors.password}
                      helperText={touched.password && errors.password}
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
              </Form>
            </CardContent>
          </>
        )}
      </Formik>
    </Card>
  )
}

export default AddForm
