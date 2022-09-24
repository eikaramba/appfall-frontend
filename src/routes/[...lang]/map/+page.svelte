<script>
    "@hmr:keep-all";
        import {page} from "$app/stores"
        import { t } from '$lib/translations';
        import Map from '$lib/components/map.svelte';
        import Fa6SolidMagnifyingGlass from '~icons/fa6-solid/magnifying-glass'
    
        let address ="";
        let mapInstance;
        let minimumDistance;
        let fetchingPosition=false;
        async function updateMap(){
            fetchingPosition=true;
            let position = await fetch(`map/geoForward?address=${address}`,{},$page);
            if(position.status!=200) return alert("error"); 
            position = await position.json();

            await mapInstance.updatePosition({lat:position.data[0].latitude, lon:position.data[0].longitude,markCenter:true});
            fetchingPosition=false;
        }
    
    </script>
    
    
    <section class="flex-1 navPadding container mx-auto text-bluck px-4 md:px-6 lg:max-w-screen-xl">
        <h1 class="text-4xl md:(-ml-1 text-6xl) ">Wichtige Standorte in Deiner Nähe</h1>
        <div class="mb-6 md:mr-16 lg:(w-2/3)">
            <h2 class="mt-6 mb-2 font-semibold">Finde Altglass-Container, Repairshops und weiteres im Umkreis.</h2>
            <h3>Adresse eingeben und auf Karte anzeigen lassen</h3>
        </div>
        <div class="flex flex-col flex-wrap mb-12">
            
            <form class="relative" on:submit|preventDefault={updateMap}>
                <input id="address" name="address" placeholder="Hafenplatz 1, Münster" class="px-4 w-full lg:w-max-130 py-4 pr-24 text-gray-700 xl:text-xl bg-white border  transition border-gray-300 rounded-2xl  focus:ring-green focus:border-green focus:outline-none focus:ring" type="text" bind:value={address}>
                <div class="absolute right-0 bottom-0 h-full w-28 ">
                    <button disabled={fetchingPosition||address.length==0} class:spinner={fetchingPosition}
                    class="spinner-white cursor-pointer h-full flex justify-center items-center w-full px-3 border-0 bg-gray-700 text-white border
                    rounded-r-2xl transition border-gray-300 hover:bg-gray-500" type="submit">
                        Anzeigen <Fa6SolidMagnifyingGlass class="ml-2 h-12 w-12" />
                    </button>
                </div>
            </form>
        </div>
    </section>
    
    <section id="mapsection" class="flex flex-col items-center">
        <Map bind:this={mapInstance} bind:minimumDistance />
    </section>
    
    
    <style lang="scss">
    </style>