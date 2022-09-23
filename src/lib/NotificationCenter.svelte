<script>
    import { flip } from 'svelte/animate';
    import { fly } from "svelte/transition"
    import { notifications } from '$lib/store.js' 
  
    export let themes = {
		error: 'bg-red',
		success: 'bg-green',
		warning: 'bg-orange',
		info: 'bg-blue',
		default: 'bg-white'
    }

  </script>
  
  <div class="notifications relative">
    {#each $notifications as notification (notification.id)}
      <div 
        animate:flip
        class="toast relative {themes[notification.type]}"
        transition:fly={{ y: 30 }}>
        <button on:click="{notifications.remove(notification.id)}" class="absolute top-1 right-1  opacity-50 font-bold text-white">x</button>
        <div class="content">{@html notification.message}</div>
        <!-- {#if notification.icon}<i class={notification.icon} />{/if} -->
        <div class="progressBar" 
            style="animation-duration: {notification.timeout}ms;">
        </div>
      </div>
    {/each}
  </div>
  
  <style>
    .notifications {
      position: fixed;
      bottom: 5%;
      right: 0;
      left: 0;
      max-width:640px;
      margin: 0 auto;
      padding: 0;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
    }
  
    .toast {
      flex: 0 0 auto;
      margin-bottom: 10px;
    }
    .progressBar {
		position: absolute;
		bottom: 0;
		background-color: rgb(0, 0, 0, 0.2);
		height: 6px;
        left: 0;
        width: 100%;
	    animation-name: shrink;
	    animation-timing-function: linear;
	    animation-fill-mode: forwards;
	}
    @keyframes shrink { 
		0% { 
			width: 100%; 
		}
		100% { 
			width: 0; 
		}
	}
  
    .content {
        @apply p-5 text-white shadow-lg;
    }
  </style>