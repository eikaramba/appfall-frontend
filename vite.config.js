import { sveltekit } from '@sveltejs/kit/vite';
import Icons from 'unplugin-icons/vite'
import postcss from './postcss.config.js';

const config = {
	plugins: [sveltekit(),
	Icons({
	  compiler: 'svelte',
	})],
	css: {
		preprocessorOptions: {
			scss: {
			  additionalData: '@use "src/variables.scss" as *;',
			},
		  },
		postcss,
	  }
};

export default config;
