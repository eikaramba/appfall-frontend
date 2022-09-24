<script>
  import "../../app.scss";
  import Icon from "$lib/Icon.svelte";
  import { menuOpen } from "$lib/store";
  import { onDestroy, onMount } from "svelte";
  import NotificationCenter from "$lib/NotificationCenter.svelte";
  import { page, navigating } from "$app/stores";
  import Fa6RegularClock from '~icons/fa6-regular/clock'
  import { scrollTo } from "$lib/utils/scroll";
  import { t, locales, locale } from '$lib/translations';
	import { fly } from 'svelte/transition';
  	import { goto } from '$app/navigation';

  
	let countryListVisible=false;
  $: ({ route } = $page.data); //Get this from svelte instead of layout data
  let scrollY = 0;
  $: scrolled = scrollY > 0;
  onDestroy(() => {
    unsubscribe();
  });
  const unsubscribe = navigating.subscribe(() => {
    $menuOpen = false;
  });

  function toggleMenu() {
    $menuOpen = !$menuOpen;
  }


</script>

<svelte:window bind:scrollY />
<NotificationCenter />
<nav class="w-full mt-2 z-20 fixed {['/'].some(white => $page.url.pathname == white)?'text-white':'text-dark'} transition-colors {scrolled ? 'scrolled bg-black/55' : ''}">

  <div class="max-w-screen-xl flex px-4 py-2 relative justify-center items-center md:py-4 lg:mx-auto md:px-12">
    <a class="block" href="/{$locale}">
      <img src="/logo.svg" alt="Logo" class="h-14">
    </a>
    <div class="ml-auto">
      <button
        type="button"
        class="bg-white rounded-md p-2 text-gray-400 inline-flex items-center justify-center md:hidden hover:bg-yellow hover:text-white focus:outline-none focus:ring-inset focus:ring-orange
		focus:ring-2"
        aria-expanded="false"
        on:click={toggleMenu}
      >
        <span class="sr-only">Open main menu</span>

        <svg class="h-6 w-6" class:opened={$menuOpen} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor">
          <path class="line line1" d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058" />
          <path class="line line2" d="M 20,50 H 80" />
          <path class="line line3" d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942" />
        </svg>
      </button>

      <ul class="text-xl  md:space-x-8 md:flex {$menuOpen ? 'flex justify-stretch items-stretch absolute z-4 top-16 left-0 bg-gray-200 text-base-content w-full flex-col pl-4 space-y-4 py-4' : 'hidden'}">
        <li>
          <a
            class="block w-full hover:text-primary"
            href="/{$locale}">Entsorgen</a
          >
        </li>
        <li><a class="block w-full hover:text-primary" href="/{$locale}/calendar">Kalendar</a></li>
        <li><a class="block w-full hover:text-primary" href="/{$locale}/map">Karte</a></li>
        <li><a class="block w-full hover:text-primary" href="/{$locale}/infos">Infos</a></li>
      </ul>
    </div>
  </div>
</nav>
<div class="flex-grow pt-32 max-w-screen-xl mx-auto px-4 md:px-12">
  <slot />
</div>
<div class="flex justify-end fixed bottom-0 right-0">
  <div class="mt-32 relative w-48">
  
    {#if countryListVisible}
    <ul transition:fly="{{duration: 150, x: 0, y: 20, opacity: 0}}" class="countryList transition-opacity absolute z-10 mt-1 bottom-full w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm" tabindex="-1" role="listbox" aria-labelledby="listbox-label" aria-activedescendant="listbox-option-3">
  
      {#each $locales as country}
      <li on:click="{()=>{goto(`/${country}${route}`)}}" class="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9  hover:(cursor-pointer bg-gray-100)" id="listbox-option-0" role="option">
      <div class="flex items-center">
        <span class="w-8"><img src="/images/flags/{country}.svg"></span>
        <span on:click="{()=>{goto(`/${country}${route}`)}}" class="{country === $locale?'font-semibold':'font-normal'} ml-3 block truncate">
        {$t(`lang.${country}`)}
        </span>
      </div>
  
      {#if country === $locale}
      <span class="text-indigo-600 absolute inset-y-0 right-0 flex items-center pr-4">
        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
      </span>
      {/if}
      </li>
      {/each}
  
    </ul>
    {/if}
  
    <button on:click="{()=>{countryListVisible=!countryListVisible}}" on:blur="{()=>{setTimeout(()=>countryListVisible=!countryListVisible,10)}}" type="button" class="w-full countryBtn relative bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm hover:(cursor-pointer bg-gray-100)">
      <span class="flex items-center">
        <span class="w-8 h-5 flex justify-center"><img alt="{$locale}" src="/images/flags/{$locale}.svg"></span>
        <span class="ml-3 block truncate">
        {$t(`lang.${$locale}`)}
        </span>
      </span>
      <span class="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </span>
      </button>
    </div>
</div>

<style lang="scss">
  nav {
    .topbar {
      transition: all 0.3s ease;
      position: relative;
      top: 0px;
      height:60px;
      @screen md {
        height:auto;
      }
    }
    &.scrolled {
      .topbar {
          margin-top: -60px;
        @screen md {
          margin-top: -22px;
        }
      }
    }
  }






  .line {
  fill: none;
  stroke: black;
  stroke-width: 6;
  transition: stroke-dasharray 600ms cubic-bezier(0.4, 0, 0.2, 1),
    stroke-dashoffset 600ms cubic-bezier(0.4, 0, 0.2, 1);
}
.line1 {
  stroke-dasharray: 60 207;
  stroke-width: 6;
}
.line2 {
  stroke-dasharray: 60 60;
  stroke-width: 6;
}
.line3 {
  stroke-dasharray: 60 207;
  stroke-width: 6;
}
.opened .line1 {
  stroke-dasharray: 90 207;
  stroke-dashoffset: -134;
  stroke-width: 6;
}
.opened .line2 {
  stroke-dasharray: 1 60;
  stroke-dashoffset: -30;
  stroke-width: 6;
}
.opened .line3 {
  stroke-dasharray: 90 207;
  stroke-dashoffset: -134;
  stroke-width: 6;
}
</style>
