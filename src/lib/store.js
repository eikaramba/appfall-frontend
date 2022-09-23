import { writable } from 'svelte/store';
import { createNotificationStore } from './store/notifications'

export const menuOpen = writable(false);
export const notifications = createNotificationStore()