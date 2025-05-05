<script lang="ts">
	import { Table, TableHead, TableBody, TableBodyRow, TableBodyCell, TableHeadCell } from 'flowbite-svelte';
	import type { Job } from '$lib/index';

	export let data: { jobs: Job[] };
	let { jobs } = data;
</script>

<Table>
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
				<TableBodyCell><a href={job.link}>{job.link}</a></TableBodyCell>
				<TableBodyCell>{job.description}</TableBodyCell>
				<TableBodyCell>{job.employment_type}</TableBodyCell>
				<TableBodyCell>{job.seniority_level}</TableBodyCell>
				<TableBodyCell>{job.job_function}</TableBodyCell>
				<TableBodyCell>{job.industries}</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>
