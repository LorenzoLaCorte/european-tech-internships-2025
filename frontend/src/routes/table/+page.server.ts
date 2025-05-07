import type { Job } from '$lib/index';

export async function load({ url }: { url: URL }): Promise<{ jobs: Job[], page: number, limit: number, search: string }> {
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const search = url.searchParams.get('search') || '';
    console.log('Page:', page);
    console.log('Limit:', limit);
    console.log('Search:', search);
    try {
        const res = await fetch(`http://127.0.0.1:5000/api/jobs?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
        if (!res.ok) {
            const errorText = await res.text();
            console.error('Fetch error details:', errorText);
            throw new Error('Failed to fetch jobs');
        }
        const jobs: Job[] = await res.json();
        return { jobs, page, limit, search };
    } catch (error) {
        console.error('Load function error:', error);
        throw error;
    }
}