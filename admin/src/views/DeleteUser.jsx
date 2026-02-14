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
import { useDeleteUserEmailOtpMutation, useDeleteUserEmailVerifyOtpMutation } from '@features/user/hooks'

const DeleteUser = ({ mode }) => {
  const sendOtpMutation = useDeleteUserEmailOtpMutation()
  const verifyOtpMutation = useDeleteUserEmailVerifyOtpMutation()

  // Vars
  const darkImg = '/images/pages/auth-v1-mask-dark.png'
  const lightImg = '/images/pages/auth-v1-mask-light.png'

  // Hooks
  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [secretId, setSecretId] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSendOtp = async (values, { setSubmitting }) => {
    setLoading(true)
    try {
      const response = await sendOtpMutation.mutateAsync({ email: values.email })
      if (response.status) {
        toast.success(response.message || 'OTP sent!')
        setEmail(values.email)
        setSecretId(response.secretId)
        setStep(2)
      } else {
        toast.error(response.message || 'Failed to send OTP')
      }
    } catch (err) {
      toast.error(err?.message || 'Something went wrong!')
    } finally {
      setLoading(false)
      setSubmitting(false)
    }
  }

  const handleVerifyOtp = async (values, { setSubmitting }) => {
    setLoading(true)
    try {
      const response = await verifyOtpMutation.mutateAsync({ secretId, otp: values.otp })
      if (response.status) {
        toast.success(response.message || 'OTP verified! Account will be deleted.')
        setStep(1)
        setEmail('')
        setSecretId('')
        setOtp('')
      } else {
        toast.error(response.message || 'Invalid OTP')
      }
    } catch (err) {
      toast.error(err?.message || 'Something went wrong!')
    } finally {
      setLoading(false)
      setSubmitting(false)
    }
  }

  const emailSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required')
  })

  const otpSchema = Yup.object().shape({
    otp: Yup.string().required('OTP is required')
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
              <Typography variant='h4'>{`Delete account in ${themeConfig.templateName} ?`}</Typography>
              <Typography className='mbs-1'>{`Deleting your account is permanent and cannot be undone.`}</Typography>
            </div>
            {step === 1 && (
              <Formik initialValues={{ email: '' }} validationSchema={emailSchema} onSubmit={handleSendOtp}>
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
                    <Button type='submit' variant='contained' fullWidth disabled={isSubmitting || loading}>
                      {isSubmitting || loading ? 'Sending OTP...' : 'Send OTP'}
                    </Button>
                  </Form>
                )}
              </Formik>
            )}
            {step === 2 && (
              <Formik initialValues={{ otp: '' }} validationSchema={otpSchema} onSubmit={handleVerifyOtp}>
                {({ errors, touched, isSubmitting }) => (
                  <Form className='flex flex-col gap-5'>
                    <TextField value={email} label='Email' fullWidth disabled />
                    <Field
                      as={TextField}
                      name='otp'
                      type='text'
                      label='OTP'
                      fullWidth
                      error={touched.otp && !!errors.otp}
                      helperText={touched.otp && errors.otp}
                    />
                    <Button type='submit' variant='contained' fullWidth disabled={isSubmitting || loading}>
                      {isSubmitting || loading ? 'Verifying...' : 'Verify OTP & Delete'}
                    </Button>
                    <Button variant='text' fullWidth onClick={() => setStep(1)} disabled={isSubmitting || loading}>
                      Back
                    </Button>
                  </Form>
                )}
              </Formik>
            )}
            <div className='grid grid-cols-2 gap-4'>
              <Link href='/user/policies/privacy-policy' className='flex justify-center items-center'>
                Privacy Policy
              </Link>
              <Link href='/user/policies/about' className='flex justify-center items-center'>
                About
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
      <Illustrations maskImg={{ src: authBackground }} />
    </div>
  )
}

export default DeleteUser
