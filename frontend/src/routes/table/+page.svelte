<script lang="ts">
	
	import { 
		Table, 
		TableHead, TableHeadCell, 
		TableBody, TableBodyRow, TableBodyCell 
	} from 'flowbite-svelte';

	import type { Job } from '$lib/index';
	import { goto } from '$app/navigation';

	export let data: { jobs: Job[], page: number, limit: number, search: string };
	
	/**
	 * reactive assignments for the pagination objects
	 */

	$: jobs = data.jobs
	$: page = data.page
	$: limit = data.limit
	$: search = data.search;

	function nextPage() {
		goto(`/table?page=${page + 1}&limit=${limit}&search=${encodeURIComponent(search)}`);
	}
	function prevPage() {
		goto(`/table?page=${Math.max(1, page - 1)}&limit=${limit}&search=${encodeURIComponent(search)}`);
	}
	function updateLimit(event: Event) {
		const value = parseInt((event.target as HTMLInputElement).value);
		limit = value > 0 ? value : 1;
		goto(`/table?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
	}
	function doSearch(event: Event) {
		goto(`/table?search=${encodeURIComponent(search)}`);
	}
</script>

<div class="max-w-8xl mx-auto p-4 space-y-4">
	<!-- Search -->
	<form class="flex w-full gap-2 items-center" on:submit|preventDefault={doSearch}>
	  <input
		class="flex-1 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 px-3 py-2 text-gray-600 font-medium shadow-sm cursor-text"
		placeholder="Search..."
		bind:value={search}
	  />
	  <button
		type="submit"
		class="px-4 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition cursor-pointer"
	  >
		Search
	  </button>
	</form>
  

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
		<div class="flex gap-2">
		  <button on:click={prevPage} disabled={page === 1} class="px-4 py-2 w-16 rounded-md border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition"> &lt </button>
		  <button on:click={nextPage} class="px-4 py-2 w-16 rounded-md border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition"> &gt </button>
		  <input
			type="number"
			min="1"
			class="px-4 py-2 w-16 rounded-md border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
			on:input={updateLimit}
			bind:value={limit}
		  />
		</div>
	</div>
</div>