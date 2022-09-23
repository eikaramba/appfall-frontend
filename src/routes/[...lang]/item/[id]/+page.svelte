<script>
  import { onMount } from "svelte";
  import { t, locale } from "$lib/translations";
  import { page } from '$app/stores';

  let data;
  onMount(async () => {
    const response = await fetch("http://localhost:8001/disposal_items/" + $page.params.id, {
      method: "GET",
      headers: {
        "Accept": "*/*",
        "Content-Type": "application/json",
        "Accept-Language": locale.get(),
      },
    });
    data = await response.json();
  });
</script>


{#if data}
<!-- {JSON.stringify(data)} -->

    <h1 class="font-light text-2xl mb-4">{data.name}</h1>

    {#each data.components as bin}
        <div class="flex items-center">
            <img src="/icons/{bin.bin}.svg" class="mr-8">{bin.name}
        </div>
    {/each}

{/if}