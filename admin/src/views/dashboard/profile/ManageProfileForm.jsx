'use client'

import { useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { toast } from 'react-toastify'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

import { useAdminProfileQuery, useAdminUpdatePasswordMutation, useAdminUpdateProfileMutation } from '@features/auth/hooks'
import { useAuthState } from '@store/auth'
import { setAuthSession } from '@store/slices/authSlice'

const profileSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required')
})

const passwordSchema = Yup.object().shape({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string().min(6, 'Password must be at least 6 characters').required('New password is required'),
  confirmPassword: Yup.string().oneOf([Yup.ref('newPassword')], 'Passwords must match').required('Confirm your new password')
})

const ManageProfileForm = () => {
  const dispatch = useDispatch()
  const { user } = useAuthState()
  const { data: profileResponse } = useAdminProfileQuery(true)
  const updatePasswordMutation = useAdminUpdatePasswordMutation()
  const updateProfileMutation = useAdminUpdateProfileMutation()

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const profile = useMemo(() => profileResponse?.user || user || {}, [profileResponse, user])

  const handleProfileSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await updateProfileMutation.mutateAsync({
        name: values.name,
        email: values.email
      })

      if (response?.status) {
        const updatedUser = response?.user || response?.data?.user

        dispatch(
          setAuthSession({
            user: {
              secretId: updatedUser?.secretId || user?.secretId,
              adminType: updatedUser?.adminType || user?.adminType,
              name: updatedUser?.name || values.name,
              email: updatedUser?.email || values.email
            }
          })
        )

        toast.success(response.message || 'Profile updated successfully!')
      }
    } catch (error) {
      toast.error(error?.message || 'Unable to update profile')
    } finally {
      setSubmitting(false)
    }
  }

  const handlePasswordSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      const response = await updatePasswordMutation.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      })

      if (response?.status) {
        toast.success(response.message || 'Password updated successfully!')
        resetForm()
      }
    } catch (error) {
      toast.error(error?.message || 'Unable to update password')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Stack spacing={5}>
      <Formik
        enableReinitialize
        initialValues={{
          name: profile?.name || '',
          email: profile?.email || ''
        }}
        validationSchema={profileSchema}
        onSubmit={handleProfileSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <Stack spacing={4}>
              <Alert severity='info' icon={<i className='ri-user-settings-line' />}>
                Update your display details. These are used across admin dashboard identity labels.
              </Alert>

              <Grid container spacing={5}>
                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    name='name'
                    fullWidth
                    label='Name'
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
                    label='Email'
                    error={touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                  />
                </Grid>
              </Grid>

              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent='flex-end' spacing={2}>
                <Button type='submit' variant='contained' disabled={isSubmitting} startIcon={<i className='ri-save-line' />}>
                  {isSubmitting ? 'Saving...' : 'Save Profile'}
                </Button>
              </Stack>
            </Stack>
          </Form>
        )}
      </Formik>

      <Divider />

      <Formik
        initialValues={{
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }}
        validationSchema={passwordSchema}
        onSubmit={handlePasswordSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <Stack spacing={4}>
              <Alert severity='warning' icon={<i className='ri-lock-password-line' />}>
                Change password using your current password.
              </Alert>

              <Grid container spacing={5}>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name='currentPassword'
                    fullWidth
                    type={showCurrentPassword ? 'text' : 'password'}
                    label='Current Password'
                    error={touched.currentPassword && !!errors.currentPassword}
                    helperText={touched.currentPassword && errors.currentPassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            size='small'
                            edge='end'
                            onClick={() => setShowCurrentPassword(value => !value)}
                            onMouseDown={event => event.preventDefault()}
                          >
                            <i className={showCurrentPassword ? 'ri-eye-off-line' : 'ri-eye-line'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    name='newPassword'
                    fullWidth
                    type={showNewPassword ? 'text' : 'password'}
                    label='New Password'
                    error={touched.newPassword && !!errors.newPassword}
                    helperText={touched.newPassword && errors.newPassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            size='small'
                            edge='end'
                            onClick={() => setShowNewPassword(value => !value)}
                            onMouseDown={event => event.preventDefault()}
                          >
                            <i className={showNewPassword ? 'ri-eye-off-line' : 'ri-eye-line'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    name='confirmPassword'
                    fullWidth
                    type={showConfirmPassword ? 'text' : 'password'}
                    label='Confirm New Password'
                    error={touched.confirmPassword && !!errors.confirmPassword}
                    helperText={touched.confirmPassword && errors.confirmPassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            size='small'
                            edge='end'
                            onClick={() => setShowConfirmPassword(value => !value)}
                            onMouseDown={event => event.preventDefault()}
                          >
                            <i className={showConfirmPassword ? 'ri-eye-off-line' : 'ri-eye-line'} />
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
                  After password update, use the new credentials for your next login.
                </Typography>
              </Box>

              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent='flex-end' spacing={2}>
                <Button type='submit' variant='contained' disabled={isSubmitting} startIcon={<i className='ri-shield-keyhole-line' />}>
                  {isSubmitting ? 'Updating...' : 'Update Password'}
                </Button>
              </Stack>
            </Stack>
          </Form>
        )}
      </Formik>
    </Stack>
  )
}

export default ManageProfileForm
