'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { toast } from 'react-toastify'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CKEditor } from 'ckeditor4-react'
import { usePolicyByTypeQuery, usePolicyUpdateMutation } from '@features/policy/hooks'

const EditForm = ({ type }) => {
  const router = useRouter()
  const updateMutation = usePolicyUpdateMutation()
  const editorRef = useRef(null)
  const [initialValues, setInitialValues] = useState({
    id: null,
    type: type || '',
    content: ''
  })

  const { data: policyResponse, isLoading, isError, error } = usePolicyByTypeQuery(type)

  const applyEditorTheme = useCallback(editor => {
    if (!editor) return

    const isDark = document.documentElement.getAttribute('data-mui-color-scheme') === 'dark'
    const contentBg = isDark ? '#2f2a4d' : '#ffffff'
    const contentText = isDark ? '#ddd8f8' : '#28243d'

    const body = editor.document?.getBody()

    if (body) {
      body.setStyle('background-color', contentBg)
      body.setStyle('color', contentText)
      body.setStyle('padding', '14px')
      body.setStyle('font-family', 'inherit')
      body.setStyle('font-size', '14px')
      body.setStyle('line-height', '1.65')
    }

    const container = editor.container?.$

    if (container) {
      container.style.borderRadius = '10px'
      container.style.overflow = 'hidden'
      container.style.border = isDark ? '1px solid rgba(218, 209, 255, 0.22)' : '1px solid rgba(82, 74, 118, 0.24)'
      container.style.background = isDark ? '#383260' : '#ffffff'

      const toolbar = container.querySelector('.cke_top')
      const chrome = container.querySelector('.cke_chrome')
      const bottom = container.querySelector('.cke_bottom')

      if (toolbar) {
        toolbar.style.background = isDark ? '#433c6e' : '#f6f4ff'
        toolbar.style.borderBottom = isDark ? '1px solid rgba(218, 209, 255, 0.18)' : '1px solid rgba(82, 74, 118, 0.14)'
      }

      if (chrome) {
        chrome.style.background = isDark ? '#383260' : '#ffffff'
      }

      if (bottom) {
        bottom.style.background = isDark ? '#383260' : '#ffffff'
        bottom.style.borderTop = isDark ? '1px solid rgba(218, 209, 255, 0.12)' : '1px solid rgba(82, 74, 118, 0.12)'
      }

      if (isDark) {
        container.querySelectorAll('.cke_button').forEach(button => {
          button.style.opacity = '1'
          button.style.filter = 'none'
        })

        container.querySelectorAll('.cke_button_icon').forEach(icon => {
          icon.style.opacity = '1'
          icon.style.filter = 'invert(0.86) saturate(0.7) brightness(1.08)'
        })

        container.querySelectorAll('.cke_label').forEach(label => {
          label.style.color = '#d8d1ff'
        })

        container.querySelectorAll('.cke_combo_text').forEach(text => {
          text.style.color = '#d8d1ff'
        })

        container.querySelectorAll('.cke_toolbar_separator').forEach(separator => {
          separator.style.background = 'rgba(218, 209, 255, 0.25)'
        })
      }
    }
  }, [])

  useEffect(() => {
    if (policyResponse?.status) {
      const { id, type: responseType, content } = policyResponse.data
      setInitialValues({
        id: id || null,
        type: responseType || type || '',
        content: content || ''
      })
    }
  }, [policyResponse, type])

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || 'Something went wrong !')
    }
  }, [isError, error])

  useEffect(() => {
    const observer = new MutationObserver(() => {
      applyEditorTheme(editorRef.current)
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-mui-color-scheme']
    })

    return () => observer.disconnect()
  }, [applyEditorTheme])

  const handleSave = async (values, { setSubmitting }) => {
    try {
      const requestData = { ...values, type: values.type || type }
      const response = await updateMutation.mutateAsync(requestData)
      if (response.status) toast.success(response.message || 'Success !')
    } catch (err) {
      toast.error(err?.message || 'Something went wrong !')
    } finally {
      setSubmitting(false)
      router.push('/policies')
    }
  }

  const validationSchema = Yup.object().shape({
    id: Yup.number().required('Policy id is required'),
    content: Yup.string().required('Content is required')
  })

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Formik enableReinitialize initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSave}>
      {({ errors, touched, setFieldValue, isSubmitting }) => (
        <Form id='edit-policy-form'>
          <Stack sx={{ width: '100%', minWidth: 0, rowGap: 4 }}>
            <Alert severity='info' icon={<i className='ri-file-edit-line' />}>
              Keep policy language clear and legally reviewed before publishing updates.
            </Alert>

            <Box sx={{ width: '100%', minWidth: 0 }}>
              <CKEditor
                initData={initialValues.content || ''}
                onInstanceReady={evt => {
                  editorRef.current = evt.editor
                  applyEditorTheme(evt.editor)
                }}
                onChange={evt => setFieldValue('content', evt.editor.getData())}
                config={{
                  height: 380,
                  width: '100%',
                  versionCheck: false
                }}
              />
              {touched.content && errors.content && (
                <Typography color='error' variant='body2' sx={{ mt: 2 }}>
                  {errors.content}
                </Typography>
              )}
            </Box>

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
                Tip: Save only final reviewed text. This content appears directly in user-facing policy pages.
              </Typography>
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent='flex-end'>
              <Button variant='outlined' color='secondary' onClick={() => router.push('/policies')} startIcon={<i className='ri-arrow-left-line' />}>
                Cancel
              </Button>
              <Button type='submit' variant='contained' color='primary' startIcon={<i className='ri-save-line' />} disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Policy'}
              </Button>
            </Stack>
          </Stack>
        </Form>
      )}
    </Formik>
  )
}

export default EditForm
