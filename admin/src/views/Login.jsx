'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import { toast } from 'react-toastify'

// Formik and Yup Imports
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'

// Component Imports
import Logo from '@components/layout/shared/Logo'
import Illustrations from '@components/Illustrations'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useAdminLoginMutation } from '@features/auth/hooks'
import { useAuthActions } from '@store/auth'

const Login = ({ mode }) => {
  const { login } = useAuthActions()
  const [isPasswordShown, setIsPasswordShown] = useState(false)

  // Vars
  const darkImg = '/images/pages/auth-v1-mask-dark.png'
  const lightImg = '/images/pages/auth-v1-mask-light.png'

  // Hooks
  const authBackground = useImageVariant(mode, lightImg, darkImg)
  const loginMutation = useAdminLoginMutation()

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const loginApiCall = async (values, { setSubmitting }) => {
    try {
      const response = await loginMutation.mutateAsync(values)
      if (response.status) {
        toast.success(response.message || 'Success !')
        let data = response.data
        login(data.user)
      }
    } catch (err) {
      toast.error(err?.message || 'Something went wrong !')
    } finally {
      setSubmitting(false)
    }
  }

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')
  })

  return (
    <div className='flex flex-col justify-center items-center min-bs-[100dvh] relative p-6'>
      <Card className='flex flex-col sm:is-[450px]'>
        <CardContent className='p-6 sm:!p-12'>
          <Link href='/' className='flex justify-center items-center mbe-6'>
            <Logo />
          </Link>
          <div className='flex flex-col gap-5'>
            <div>
              <Typography variant='h4'>{`Welcome to ${themeConfig.templateName}`}</Typography>
              <Typography className='mbs-1'>Admin panel</Typography>
            </div>
            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={validationSchema}
              onSubmit={loginApiCall}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className='flex flex-col gap-5'>
                  <Field
                    as={TextField}
                    name='email'
                    type='email'
                    label='Email'
                    fullWidth
                    error={touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                  />
                  <Field
                    as={TextField}
                    name='password'
                    type={isPasswordShown ? 'text' : 'password'}
                    label='Password'
                    fullWidth
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
                          >
                            <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                  <Button type='submit' variant='contained' fullWidth disabled={isSubmitting}>
                    {isSubmitting ? 'Logging in...' : 'Log In'}
                  </Button>
                </Form>
              )}
            </Formik>
          </div>
        </CardContent>
      </Card>
      <Illustrations maskImg={{ src: authBackground }} />
    </div>
  )
}

export default Login
