import type { Job } from '$lib/index';
import { API_BASE } from '$lib/api';

export async function load({ url }: { url: URL }): Promise<{ jobs: Job[], page: number, limit: number, search: string, error?: string }> {
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const search = url.searchParams.get('search') || '';
    console.log('Page:', page);
    console.log('Limit:', limit);
    console.log('Search:', search);
    try {
        const res = await fetch(`${API_BASE}/api/jobs?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
        if (!res.ok) {
            const errorText = await res.text();
            console.error('Fetch error details:', errorText);
            throw new Error('Failed to fetch jobs');
        }
        const jobs: Job[] = await res.json();
        return { jobs, page, limit, search };
    } catch (error) {
        console.error("Error in +page.server.ts load function:", error);
        return { jobs: [], page, limit, search, error: "Failed to load jobs." };
    }
}