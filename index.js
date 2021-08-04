const action = async (context) => {
  // Do something

  context.notify('Notify about something')
}

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
}

const supabase = {
  title: 'Share to Supabase',
  formats: ['gif', 'mp4', 'webm', 'apng'],
  action,
  config,
}

exports.shareServices = [supabase]
