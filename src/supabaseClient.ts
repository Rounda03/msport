// src/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'
import { SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl: string = 'https://stiprxwqwiutwssxfzvk.supabase.co'
const supabaseKey: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0aXByeHdxd2l1dHdzc3hmenZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEyODM0NjgsImV4cCI6MjA0Njg1OTQ2OH0.v4SD7ROM0kFruQZ1pWW5_aauFG9qBbiRarnJr8bMTGs'
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey)

export default supabase
