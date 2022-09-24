<script>
  import { onMount } from "svelte";
  import { t, locale } from "$lib/translations";
  import { page } from '$app/stores';

  let data;

  let correctBinNames = {
    "black":"Restmüll",
    "blue":"Altpapier",
    "green":"Biotonne",
    "clothes_container":"Kleidercontainer",
    "clothing_collection":"Kleidersammlung",
    "clothing_container":"Kleidercontainer",
    "electro_container":"Elektrocontainer",
    "givebox":"GiveBox",
    "glas_container":"Glascontainer",
    "glass_container":"Glascontainer",
    "recycling_yard":"Recyclinghof",
    "repair_cafe":"RepairCafe",
    "yellow":"Werststofftonne",
  }
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
<h1 class="text-4xl ">{data.name}</h1>
        <div class="mb-12">
            <h2 class="mt-6 mb-2 font-semibold">So entsorgst du richtig</h2>
            <h3>Die einzelnen Komponenten werden nach Sorte getrennt</h3>
        </div>

    {#each data.components as bin}
      {#each bin.bins as finalBin}
          <div class="flex items-center">
              <img src="/icons/{finalBin}.svg" class="mr-8 mb-4">
              <div>
                <h3 class="text-xl">{correctBinNames[finalBin]}</h3>
                <span><strong>{bin.name}</strong> gehört hierein</span>
              </div>
          </div>
          {#if finalBin == "glas_container"}
          <div class="flexflex-col">
            <h3 class="font-bold">Altglascontainer in Deiner Nähe</h3>
              <div class="flex items-center">
                <img src="/map.svg" class="mr-8 mb-4">
                <span class="flex flex-col">
                  Nächste Altglascontainer in Deiner Nähe
                  <button class="btn btn-primary">Anzeigen</button>
                </span>
              </div>
            </div>
          {/if}
      {/each}
    {/each}

{/if}