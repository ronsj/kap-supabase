const fs = require('fs')
const { createClient } = require('@supabase/supabase-js')

const contentTypes = new Map([
  ['.gif', 'image/gif'],
  ['.mp4', 'video/mp4'],
  ['.webm', 'video/webm'],
  ['.apng', 'image/apng'],
])

// Kap docs: https://github.com/wulkano/Kap/blob/main/docs/plugins.md#action
const action = async (context) => {
  context.setProgress('Uploading...')
  // Connect to Supabase
  const supabase = createClient(
    context.config.get('url'),
    context.config.get('apiKey')
  )

  const filePath = await context.filePath()
  const fileName = context.defaultFileName
  const fileBody = fs.createReadStream(filePath)
  const contentType =
    contentTypes.get('.' + context.format) || 'application/octet-stream'

  try {
    let { error: uploadError, data } = await supabase.storage
      .from(context.config.get('bucketName'))
      .upload(fileName, fileBody, {
        contentType,
      })

    if (uploadError) {
      throw uploadError
    }

    const fileUrl = `${context.config.get('url')}/storage/v1/object/public/${
      data.Key
    }`
      .replace('.co/', '.in/')
      .trim()

    context.copyToClipboard(fileUrl)
    context.notify(
      `URL to the ${context.prettyFormat} has been copied to the clipboard`
    )
  } catch (error) {
    context.notify(error.message)
  }
}

// Kap docs: https://github.com/wulkano/Kap/blob/main/docs/plugins.md#config
const config = {
  url: {
    title: 'Supabase URL',
    type: 'string',
    default: '',
    required: true,
  },
  apiKey: {
    title: 'Supabase API Key',
    type: 'string',
    default: '',
    required: true,
  },
  bucketName: {
    title: 'Supabase Storage Bucket Name',
    type: 'string',
    default: '',
    required: true,
  },
}

const supabase = {
  title: 'Share to Supabase',
  formats: ['gif', 'mp4', 'webm', 'apng'],
  action,
  config,
}

exports.shareServices = [supabase]
