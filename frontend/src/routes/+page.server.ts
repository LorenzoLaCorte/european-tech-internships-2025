import type { Job } from '$lib/index';

export async function load(): Promise<{ jobs: Job[] }> {
    try {
        const res = await fetch('http://127.0.0.1:5000/api/jobs');
        if (!res.ok) {
            const errorText = await res.text();
            console.error('Fetch error details:', errorText);
            throw new Error('Failed to fetch jobs');
        }
        const jobs: Job[] = await res.json();
        return { jobs: jobs.slice(0, 100) };
    } catch (error) {
        console.error('Load function error:', error);
        throw error;
    }
}