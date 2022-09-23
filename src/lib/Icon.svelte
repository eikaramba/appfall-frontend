<svg
  bind:this={button}
  aria-hidden="true"
  class="{classes}"
  role="img"
  xmlns="http://www.w3.org/2000/svg"
  viewBox="{viewBox}"
  style="{rotate!=0?`transform: rotate(${rotate}deg)`:''}">
    <path fill="currentColor" d="{path}" />
</svg>
<script>
  export let icon;
  export let rotate = 0 % 360;

  let path = [];
  let classes = "";
  let viewBox = "";
  $: viewBox = "0 0 " + icon.icon[0] + " " + icon.icon[1];
  $: classes = "fa-svelte " + ($$props.class ? $$props.class : "");
  $: path = icon.icon[4];


  import {
    onMount,
    createEventDispatcher,
  } from 'svelte';


  let button;
  const dispatch = createEventDispatcher();

  onMount(() => {
    button.addEventListener('click', onClick);
    return () => {button.removeEventListener('click', onClick)}
  });

  function onClick(event) {
    dispatch('click', event);
  }
</script>

<style>
    .fa-svelte {
      vertical-align: -.125em;
      display: inline-block;
    }
  </style>