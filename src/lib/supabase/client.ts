import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = PUBLIC_SUPABASE_URL;
const supabaseKey = PUBLIC_SUPABASE_ANON_KEY;

export class SupabaseClient {
	constructor() {}

	static lib = createClient(supabaseUrl, supabaseKey, {
		db: {
			schema: 'pod'
		}
	});
}
