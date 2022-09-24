<script>
    '@hmr:keep-all'
    import { t, locale } from '$lib/translations';
	import { slide,fade } from 'svelte/transition';
    import Fuzzy from "$lib/fuzzy/Fuzzy.svelte";
    import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { stringify } from 'query-string';
  import Dropzone from "svelte-file-dropzone";
  import Fa6SolidCamera from '~icons/fa6-solid/camera'
  import "dropzone/dist/dropzone.css";



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
  async function handleFilesSelect(e) {
    const { acceptedFiles, fileRejections } = e.detail;

    //transform image from acceptedFiles Array into a multipart and send it to the server
    const form = new FormData()
    form.append("file", acceptedFiles[0])
    let response = await fetch('http://localhost:8001/search/image', {
        method: 'POST',
        body: form,
        headers: {
            'Accept': '*/*',
            'Accept-Language': $locale
        }
    });
    let data = await response.json();
    addAnswer(data.key,data.value);

  }

  onMount(async () => {
    // let myDropzone = new Dropzone("#dropzone");
    // myDropzone.on("addedfile", file => {
    //     console.log(`File added: ${file.name}`);
    // });
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
        currentSuggestions=json.possible_disposal_items;
        if(json.possible_disposal_items.length==1 && json.possible_disposal_items[0].id){
            goto('/'+$locale+'/item/'+json.possible_disposal_items[0].id);
        }
        loading=false;
    }

    let assistentStarted=false;
    let searchStarted=false;
    function blurInput(){
        setTimeout(function(){
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
    <h1 class="font-light text-2xl mb-4" transition:slide>{ $t('whereToDispose') }</h1>
{/if}


<Fuzzy {query} data={currentSuggestions} {options} bind:result />

<section>
    {#if assistentStarted}
    <button on:click={closeAssistant} class="relative bg-accent text-white mb-2 py-4 rounded-lg w-full ">{ $t('CloseAssistant') }
    </button>
    {/if}

    <input bind:value={query} on:blur={blurInput} on:focus={focusInput} type="text" class="input w-full bg-white" placeholder="{ $t('searchDB') }">
    {#if !assistentStarted && !searchStarted}
    <div class="flex items-center justify-between my-6"><span class="w-1/3 border-b border-gray-300"></span> <span class="text-xs text-center text-gray-500 uppercase">{ $t('or') }</span> <span class="w-1/3 border-b  border-gray-300"></span></div>
    
    <button on:click={()=>assistentStarted=true} class="relative rounded-lg w-full h-64 overflow-hidden assistent hover:scale-105 transition-all">
        <span class="relative z-10 text-lg font-bold text-white pointer-events-none">{$t('startAssistent')}</span>
        <div class="bg-primary absolute inset-0 opacity-40 z-1 hover:opacity-0 transition-all"></div>
    </button>
    
    <div class="flex items-center justify-between my-6"><span class="w-1/3 border-b border-gray-300"></span> <span class="text-xs text-center text-gray-500 uppercase">{ $t('or') }</span> <span class="w-1/3 border-b  border-gray-300"></span></div>
    
    <Dropzone on:drop={handleFilesSelect} accept="image/*">
        <Fa6SolidCamera class="w-16 h-16 text-current mb-4"/>
        <p class="text-current">{ $t('useImageAI') }</p>
    </Dropzone>
    {:else}
    <div class:spinner={loading} class="spinner-overlay spinner-dark spinner-large">
        <ul class="mt-6 space-y-2 flex flex-col items-start" transition:slide>
            {#if query}
            {#if result.length==0}
                <li class="text-gray-500">{ $t('noResults') }</li>
            {:else}
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
            {/if}
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
    <div class="fixed bottom-0 pb-16 left-0 right-0 flex flex-col text-center items-stretch justify-center bg-neutral text-neutral-content">
        <h2 class="font-light text-2xl mt-4 mb-2" transition:slide>{question.question_text}</h2>
        <ul class="mt-6 space-y-2 px-4" transition:slide> 
            {#each question.answers as answer}
                <li on:click={()=>{addAnswer(question.attribute_key,answer.attribute_value)}} class="py-4 bg-gray-200 rounded-lg text-base-content hover:bg-primary hover:text-white cursor-pointer">{answer.answer_text}</li>
            {/each}
        </ul>
    </div>
    {/if}
</section>



<style lang="scss" global>
    .assistent {
        background-image: url('/images/trash1.jpg');
        background-size: cover;
        background-position: center;
    }
    .dropzone {
        cursor: pointer;
        @apply text-primary;
        &:hover {
            @apply bg-primary;
            @apply text-white;
        }
    }
</style>
