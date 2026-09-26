import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://giclojmgzcjigtdhxlyw.supabase.co';
const supabaseKey = 'sb_publishable_8IrU2-eHlb7D8LyS7we3nQ_rY0xdvmw';

export const supabase = createClient(supabaseUrl, supabaseKey);