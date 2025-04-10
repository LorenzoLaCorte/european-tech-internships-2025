import type { PageServerLoad } from './$types';
import { apiGetJobs } from '../../api';

export const load: PageServerLoad = async ({ params, url }) => {
    return {
        jobs: await apiGetJobs()
    };
}