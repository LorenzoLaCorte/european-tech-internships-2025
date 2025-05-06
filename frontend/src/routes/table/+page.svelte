<script lang="ts">
	
	import { 
		Table, 
		TableHead, TableHeadCell, 
		TableBody, TableBodyRow, TableBodyCell 
	} from 'flowbite-svelte';

	import type { Job } from '$lib/index';
	import { goto } from '$app/navigation';

	export let data: { jobs: Job[], page: number, limit: number };
	
	/**
	 * reactive assignments for the pagination objects
	 */

	$: jobs = data.jobs
	$: page = data.page
	$: limit = data.limit

	function nextPage() {
		goto(`/table?page=${page + 1}&limit=${limit}`);
	}
	function prevPage() {
		goto(`/table?page=${Math.max(1, page - 1)}&limit=${limit}`);
	}
</script>

<div class="max-w-8xl mx-auto p-4">
	<Table striped={true} hoverable={true} border={false} shadow>
		<TableHead>
			<TableHeadCell>Company</TableHeadCell>
			<TableHeadCell>Title</TableHeadCell>
			<TableHeadCell>Location</TableHeadCell>
			<TableHeadCell>Link</TableHeadCell>
			<TableHeadCell>Description</TableHeadCell>
			<TableHeadCell>Employment</TableHeadCell>
			<TableHeadCell>Seniority</TableHeadCell>
			<TableHeadCell>Function</TableHeadCell>
			<TableHeadCell>Industries</TableHeadCell>
		</TableHead>
		<TableBody>
			{#each jobs as job}
				<TableBodyRow>
					<TableBodyCell>{job.company}</TableBodyCell>
					<TableBodyCell>{job.title}</TableBodyCell>
					<TableBodyCell>{job.location}</TableBodyCell>
					<TableBodyCell><a href={job.link} target="_blank" rel="noopener noreferrer">🔗</a></TableBodyCell>				
					<TableBodyCell>{job.description}</TableBodyCell>
					<TableBodyCell>{job.employment_type}</TableBodyCell>
					<TableBodyCell>{job.seniority_level}</TableBodyCell>
					<TableBodyCell>{job.job_function}</TableBodyCell>
					<TableBodyCell>{job.industries}</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
	
    <div class="flex justify-center gap-2 mt-4">
        <button on:click={prevPage} disabled={page === 1} class="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">Prev</button>
        <button on:click={nextPage} class="px-4 py-2 bg-gray-200 rounded">Next</button>
    </div>
</div>