<script>
    '@hmr:keep-all'
    import { t, locale } from '$lib/translations';
	import { slide,fade } from 'svelte/transition';


    let state = {};
    let query="";
    let currentSuggestions=[
        {
            "name":"Pizzakarton"
        },
        {
            "name":"Eierschalen"
        },
        {
            "name":"Buch"
        },
    ]

    let question = {
        "text": "Welche Kategorie?",
        "answers": [
            {
                "text": "Organisches",
                "value": "0"
            },
            {
                "text": "Metall",
                "value": "1"
            },
            {
                "text": "Papier",
                "value": "3"
            },
            {
                "text": "Glas",
                "value": "4"
            }
        ]
    }

    let assistentStarted=false;
    let searchStarted=false;
    function blurInput(){
        if(!query){
            searchStarted=false;
        }
    }
    function focusInput(){
        searchStarted=true;
        //load search results
    }




</script>
{#if !assistentStarted && !searchStarted}
    <h1 class="font-light text-2xl mb-4" transition:slide>Wo entsorge ich was?</h1>
{/if}

<section class="">
    {#if assistentStarted}
    <button on:click={()=>assistentStarted=false} class="relative bg-accent text-white mb-2 py-4 rounded-lg w-full ">Assistent beenden
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
    <ul class="mt-6 space-y-4 flex flex-col" transition:slide>
        {#each currentSuggestions as suggestion}
            <li class="p-4 bg-white rounded hover:bg-primary hover:text-white cursor-pointer">{suggestion.name}</li>
        {/each}
    </ul>
    {/if}
</section>

<section>
    {#if assistentStarted}
    <div class="fixed bottom-0 left-0 right-0 flex flex-col items-center justify-center bg-neutral text-neutral-content">
        <h2 class="font-light text-2xl mt-2 mb-2" transition:slide>{question.text}</h2>
        <ul class="mt-6" transition:slide>
            {#each question.answers as answer}
                <li class="py-4 hover:bg-primary hover:text-white cursor-pointer">{answer.text}</li>
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
