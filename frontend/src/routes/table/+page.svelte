<script lang="ts">
	import Table from '../../components/Table.svelte';
    export let data;
</script>

<svelte:head>
	<title>Articles</title>
</svelte:head>

<Table jobs={data.jobs}/>