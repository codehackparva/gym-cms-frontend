import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://agwrfmjigkpepvdrmset.supabase.co',
  'sb_publishable_v9bFYm1l1qs0puIEmR6ZQg_xzt7eI5t'
)

export default supabase