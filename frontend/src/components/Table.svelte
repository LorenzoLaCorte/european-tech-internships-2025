<script lang="ts">
    export let jobs: { company: string; title: string; location: string; link: string }[] = [];
    $: console.log('Jobs in Table:', jobs.length);
</script>

<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
  <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th scope="col" class="px-6 py-3">Company</th>
        <th scope="col" class="px-6 py-3">Title</th>
        <th scope="col" class="px-6 py-3">Location</th>
        <th scope="col" class="px-6 py-3">Link</th>
      </tr>
    </thead>
    <tbody>
      {#each jobs as job}
        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
          <td class="px-6 py-4">{job.company}</td>
          <td class="px-6 py-4">{job.title}</td>
          <td class="px-6 py-4">{job.location}</td>
          <td class="px-6 py-4">
            <a href={job.link} target="_blank" class="text-blue-500 hover:underline">View</a>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
