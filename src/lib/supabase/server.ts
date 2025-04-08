import { SUPABASE_SERVICE_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = PUBLIC_SUPABASE_URL;
const supabaseServiceKey = SUPABASE_SERVICE_KEY;

export class SupabaseServer {
    constructor() {}

    static lib = createClient(supabaseUrl, supabaseServiceKey, {
        db: {
            schema: 'pod'
        }
    });
}
