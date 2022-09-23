import { writable } from 'svelte/store';
export const notification = writable();

const NOTIFICATION_TIMEOUT = 5000

const createNotificationStore = () => {
  const _notifications = writable([])

  let timers = []

  const send = (message, type = "default",timeout = NOTIFICATION_TIMEOUT) => {
      const newId = generateId();
    _notifications.update(state => {
      return [...state, { id: newId, type, message, timeout }]
    })
    timers.push({[newId]:setTimeout(() => {
        _notifications.update(state => {
            const index = timers.findIndex(function (o) { return o.hasOwnProperty(newId); })
            if(index>-1) {timers.splice(index, 1); }
            state.shift()
          return state
        })
      }, timeout)})
  }
  const remove = (id) => {
    const index = timers.findIndex(function (o) { return o.hasOwnProperty(id); })
    if(index>-1) {clearTimeout(timers[index][id]); timers.splice(index, 1); }

    _notifications.update(state => {
        const index = state.findIndex(function (o) { return o.id == id; })
        if(index>-1) {state.splice(index, 1); }
        return state;
      })
  }
  const { subscribe } = _notifications

  return {
    subscribe,
    send,
    remove: id => remove(id),
    warning: (msg,timeout) => send(msg, "warning",timeout),
    error: (msg,timeout) => send(msg, "error",timeout),
    info: (msg,timeout) => send(msg, "info",timeout),
    success: (msg,timeout) => send(msg, "success",timeout),
  }
}

function generateId() {
  return '_' + Math.random().toString(36).substr(2, 9);
};

export { createNotificationStore }