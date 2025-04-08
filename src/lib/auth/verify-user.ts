export interface AuthVerifyUser {
	user: {
		id: number;
		tags: null | string[];
		email: null | string;
		tokens: null | string[];
		clerk_id: string;
		full_name: string;
		github_id: null | string;
		last_name: string;
		created_at: string;
		deleted_at: null | string;
		first_name: string;
		twitter_id: number | null;
		updated_at: string;
		respondent_id: null | number;
	};
	versions: Array<{
		id: number;
		name: string;
		v_number: string;
		is_active: boolean;
		is_locked: boolean;
		created_at: string;
		deleted_at: null | string;
		updated_at: string;
		released_at: string;
		domain: string;
		domain_dev: string;
		is_latest: boolean;
	}>;
}
