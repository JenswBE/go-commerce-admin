import { GetterTree, ActionTree, MutationTree } from 'vuex'
import cloneDeep from 'lodash.clonedeep'
import Vue from 'vue'
import { Alert, AlertType } from './general'
import { Event } from '../api/api'
import { DateTime } from 'luxon'

export type EventsMap = { [id: string]: Event }

export const state = () => ({
  events: {} as EventsMap,
})

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
  // Returns all events
  eventsList(state) {
    return Object.values(state.events)
  },
  // Returns only current/future events
  eventsListCurrent(state) {
    return Object.values(state.events).filter((e) => {
      let end = DateTime.fromISO(e.end)
      if (e.whole_day) {
        end = end.plus({ days: 1 })
      }
      return end > DateTime.now()
    })
  },
}

export const mutations: MutationTree<RootState> = {
  SET_EVENTS(state, events: EventsMap) {
    state.events = events
  },

  ADD_EVENT(state, event: Event) {
    Vue.set(state.events, event.id as string, cloneDeep(event))
  },

  UPDATE_EVENT(state, event: Event) {
    Vue.set(state.events, event.id as string, cloneDeep(event))
  },

  DELETE_EVENT(state, event_id: string) {
    Vue.delete(state.events, event_id)
  },
}

export const actions: ActionTree<RootState, RootState> = {
  async list(context) {
    console.debug('Store events/list', 'Dispatched')
    return this.$api.events
      .listEvents(true)
      .then(({ data }) => {
        const events = data.events.reduce((result, item) => {
          result[item.id as string] = item
          return result
        }, {} as EventsMap)
        context.commit('SET_EVENTS', events)
      })
      .catch((e) => {
        const alert: Alert = {
          type: AlertType.Error,
          message:
            this.$i18n
              .t('fetchItemFailed', { item: this.$i18n.tc('event', 2) })
              .toString() + `: ${e.message}`,
        }
        context.commit('general/SET_ALERT', alert, { root: true })
      })
  },

  async add(context, event: Event) {
    console.debug('Store events/add', 'Dispatched', event)
    return this.$api.events
      .addEvent(event)
      .then(({ data }) => {
        context.commit('ADD_EVENT', data)
      })
      .catch((e) => {
        const alert: Alert = {
          type: AlertType.Error,
          message:
            this.$i18n
              .t('addItemFailed', { item: this.$i18n.tc('event', 1) })
              .toString() + `: ${e.message}`,
        }
        context.commit('general/SET_ALERT', alert, { root: true })
      })
  },

  async update(context, event: Event) {
    console.debug('Store events/update', 'Dispatched', event)
    return this.$api.events
      .updateEvent(event.id as string, event)
      .then(({ data }) => {
        context.commit('UPDATE_EVENT', data)
      })
      .catch((e) => {
        const alert: Alert = {
          type: AlertType.Error,
          message:
            this.$i18n
              .t('updateItemFailed', { item: this.$i18n.tc('event', 1) })
              .toString() + `: ${e.message}`,
        }
        context.commit('general/SET_ALERT', alert, { root: true })
      })
  },

  async delete(context, event_id: string) {
    console.debug('Store events/delete', 'Dispatched', event_id)
    return this.$api.events
      .deleteEvent(event_id)
      .then(() => {
        context.commit('DELETE_EVENT', event_id)
      })
      .catch((e) => {
        const alert: Alert = {
          type: AlertType.Error,
          message:
            this.$i18n
              .t('deleteItemFailed', { item: this.$i18n.tc('event', 1) })
              .toString() + `: ${e.message}`,
        }
        context.commit('general/SET_ALERT', alert, { root: true })
      })
  },
}
