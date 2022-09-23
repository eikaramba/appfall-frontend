<script>
    '@hmr:keep-all'
    import { t, locale } from '$lib/translations';
	import { slide,fade } from 'svelte/transition';
    import Fuzzy from "$lib/fuzzy/Fuzzy.svelte";
    import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { stringify } from 'query-string';

  let options = { keys: ["name"] };

    let state = {};
    let attributes = {};
    let query="";
    let currentSuggestions=[
    ]

    let question = {}
  let result = [];
  let loading=false;

  function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  onMount(async () => {
    await refreshData();
    });

    async function refreshData(){
        loading=true;
        await timeout(1000)
        const response = await fetch('http://localhost:8001/restriction?'+stringify(attributes), {
        method: 'GET',
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json',
            'Accept-Language': $locale
        }
        });
        const json = await response.json();
        question=json.question;
        console.log(question);
        currentSuggestions=json.possible_disposal_items;
        console.log(json.possible_disposal_items);
        if(json.possible_disposal_items.length==1 && json.possible_disposal_items[0].id){
            goto('/'+$locale+'/item/'+json.possible_disposal_items[0].id);
        }
        loading=false;
    }

    let assistentStarted=false;
    let searchStarted=false;
    function blurInput(){
        setTimeout(function(){
        console.log(Object.keys(attributes))
            if(!query && Object.keys(attributes).length==0){
            searchStarted=false;
        }
        }, 200);

    }
    function focusInput(){
        searchStarted=true;
        //load search results
    }

    function openItem(id){
        goto(`/${$locale}/item/${id}`);
    }

    function closeAssistant(){
        assistentStarted=false;
        searchStarted=false;
        query="";
        attributes={};
        refreshData();
    }

    function addAnswer(attribute,value){
        assistentStarted=true;
        attributes[attribute]=value
        refreshData();
    }




</script>
{#if !assistentStarted && !searchStarted}
    <h1 class="font-light text-2xl mb-4" transition:slide>Wo entsorge ich was?</h1>
{/if}


<Fuzzy {query} data={currentSuggestions} {options} bind:result />

<section>
    {#if assistentStarted}
    <button on:click={closeAssistant} class="relative bg-accent text-white mb-2 py-4 rounded-lg w-full ">Assistent beenden
    </button>
    {/if}

    <input bind:value={query} on:blur={blurInput} on:focus={focusInput} type="text" class="input w-full bg-white" placeholder="Datenbank durchsuchen">
    {#if !assistentStarted && !searchStarted}
    <div class="flex items-center justify-between my-6"><span class="w-1/3 border-b border-gray-300"></span> <span class="text-xs text-center text-gray-500 uppercase">oder</span> <span class="w-1/3 border-b  border-gray-300"></span></div>
    
    <button on:click={()=>assistentStarted=true} class="relative rounded-lg w-full h-64 overflow-hidden assistent hover:scale-105 transition-all">
        <span class="relative z-10 text-lg font-bold text-white pointer-events-none">{$t('index.startAssistent')}</span>
        <div class="bg-primary absolute inset-0 opacity-40 z-1 hover:opacity-0 transition-all"></div>
    </button>
    {:else}
    <div class:spinner={loading} class="spinner-overlay spinner-dark spinner-large">
        <ul class="mt-6 space-y-2 flex flex-col items-start" transition:slide>
            {#if query}
            {#each result as item}
            {#each item as line}
                <li on:click={()=>{!line[0].data.id?addAnswer(line[0].data.additional_attribute.key,line[0].data.additional_attribute.value):openItem(line[0].data.id)}} class="p-4 bg-white rounded-lg hover:bg-primary hover:text-white cursor-pointer {line[0].data.id?'bg-primary text-white':''}">
                    {#each line as { matches, text }}
                        {#if matches}
                        <mark>{text}</mark>
                        {:else}
                        {text}
                        {/if}
                    {/each}
                </li>
                {/each}
            {/each}
            {:else}
            {#each currentSuggestions as suggestion}
                <li on:click={()=>{!suggestion.id?addAnswer(suggestion.additional_attribute.key,suggestion.additional_attribute.value):openItem(suggestion.id)}}  class="p-4 bg-white rounded-lg hover:bg-primary hover:text-white cursor-pointer {suggestion.id?'bg-primary text-white':''}">
                    {suggestion.name}
                </li>
            {/each}
            {/if}
        </ul>
    </div>
    {/if}
</section>

<section>
    {#if assistentStarted && question && question.answers}
    <div class="fixed bottom-0 left-0 right-0 flex flex-col text-center items-stretch justify-center bg-neutral text-neutral-content">
        <h2 class="font-light text-2xl mt-4 mb-2" transition:slide>{question.question_text}</h2>
        <ul class="mt-6 space-y-2 px-4" transition:slide> 
            {#each question.answers as answer}
                <li on:click={()=>{addAnswer(question.attribute_key,answer.attribute_value)}} class="py-4 bg-gray-200 rounded-lg text-base-content hover:bg-primary hover:text-white cursor-pointer">{answer.answer_text}</li>
            {/each}
        </ul>
    </div>
    {/if}
</section>



<style>
    .assistent {
        background-image: url('/images/trash1.jpg');
        background-size: cover;
        background-position: center;
    }
</style>
