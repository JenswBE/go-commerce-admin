<template>
  <v-container>
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="eventsList"
          sort-by="name"
          class="elevation-1"
          :search="search"
          hide-default-footer
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                :label="$tc('search') | capitalize"
                single-line
                hide-details
              ></v-text-field>
              <v-spacer></v-spacer>
              <v-dialog v-model="formOpen" max-width="500px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                  >
                    {{ $t('addItem', { item: $tc('event') }) }}
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <v-text-field
                            v-model="activeEvent.name"
                            :label="$tc('name') | capitalize"
                            :placeholder="
                              $t('exampleItem', { item: 'Winter sale' })
                                | capitalize
                            "
                            append-icon="mdi-close"
                            @click:append="activeEvent.name = ''"
                            @keydown.enter.prevent="saveEvent"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-switch
                            v-model="activeEvent.wholeDay"
                            :label="$tc('wholeDays') | capitalize"
                          />
                        </v-col>
                        <v-col :cols="activeEvent.wholeDay ? 12 : 6">
                          <date-input-with-dialog
                            v-model="activeEvent.activeStartDate"
                            :label="$tc('start') | capitalize"
                          />
                        </v-col>
                        <v-col :cols="6" v-show="!activeEvent.wholeDay">
                          <time-input-with-dialog
                            v-model="activeEvent.activeStartTime"
                            :label="$tc('start') | capitalize"
                          />
                        </v-col>
                        <v-col :cols="activeEvent.wholeDay ? 12 : 6">
                          <date-input-with-dialog
                            v-model="activeEvent.activeEndDate"
                            :label="$tc('end') | capitalize"
                          />
                        </v-col>
                        <v-col :cols="6" v-show="!activeEvent.wholeDay">
                          <time-input-with-dialog
                            v-model="activeEvent.activeEndTime"
                            :label="$tc('end') | capitalize"
                          />
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeForm">
                      {{ $tc('cancel') | capitalize }}
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="saveEvent">
                      {{ $tc('save') | capitalize }}
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <DialogConfirm
                v-model="confirmDeleteOpen"
                @confirm="confirmDeleteEvent"
                @cancel="closeConfirmDelete"
              />
              <DialogConfirm
                v-model="confirmDeleteImageOpen"
                @confirm="confirmDeleteImage"
                @cancel="closeConfirmDeleteImage"
              />
            </v-toolbar>
          </template>
          <template v-slot:[`item.logo`]="{ item }">
            <img
              :src="item.image_urls === undefined ? '' : item.image_urls['100']"
              class="ma-1"
              style="cursor: pointer"
              @click="selectImage(item)"
            />
            <v-btn
              icon
              @click="selectImage(item)"
              v-show="item.image_urls === undefined"
            >
              <v-icon small> mdi-plus </v-icon>
            </v-btn>
            <v-btn
              icon
              @click="selectImage(item)"
              v-show="item.image_urls !== undefined"
            >
              <v-icon small> mdi-refresh </v-icon>
            </v-btn>
            <v-btn
              icon
              @click="deleteImage(item.id)"
              v-show="item.image_urls !== undefined"
            >
              <v-icon small> mdi-close </v-icon>
            </v-btn>
          </template>
          <template v-slot:[`item.website_url`]="{ item }">
            <p>
              <a :href="item.website_url" target="_blank">{{
                item.website_url
              }}</a>
            </p>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn icon @click="editEvent(item)">
              <v-icon small> mdi-pencil </v-icon>
            </v-btn>
            <v-btn icon @click="deleteEvent(item.id)">
              <v-icon small> mdi-delete </v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <input
      ref="imageUploader"
      class="d-none"
      type="file"
      accept="image/*"
      @change="uploadImage"
    />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { MetaInfo } from 'vue-meta'
import cloneDeep from 'lodash.clonedeep'
import { mapGetters, mapState } from 'vuex'
import { DateTime } from 'luxon'
import { Event } from '../api/api'
import { Header } from '../interfaces/DataTable.interface'
import DateInputWithDialog from '~/components/DateInputWithDialog.vue'

export default Vue.extend({
  components: { DateInputWithDialog },

  head(): MetaInfo {
    return { title: this.$capitalize(this.$tc('event', 2)) }
  },

  data: () => ({
    search: '',
    formOpen: false,
    confirmDeleteOpen: false,
    confirmDeleteImageOpen: false,
    activeID: '',
    activeEvent: {
      name: '',
      event_type: '',
      start: '',
    } as Event,
    activeStartDate: '',
    activeStartTime: '',
    activeEndDate: '',
    activeEndTime: '',
    defaultEvent: {
      name: '',
      event_type: '',
      start: '',
    } as Event,
  }),

  computed: {
    ...mapState('events', ['events']),
    ...mapGetters('events', ['eventsList']),

    formTitle(): string {
      const key = this.activeID === '' ? 'addItem' : 'editItem'
      const title = this.$t(key, { item: this.$tc('event') }).toString()
      return this.$capitalize(title)
    },

    headers(): Header[] {
      return [
        {
          text: this.$capitalize(this.$tc('start')),
          value: 'start',
          sortable: true,
        },
        {
          text: this.$capitalize(this.$tc('end')),
          value: 'end',
          sortable: true,
        },
        {
          text: this.$capitalize(this.$tc('name')),
          value: 'name',
          sortable: true,
        },
        {
          text: this.$capitalize(this.$tc('action', 2)),
          value: 'actions',
          sortable: false,
        },
      ]
    },
  },

  watch: {
    formOpen(val) {
      val || this.closeForm()
    },
    confirmDeleteOpen(val) {
      val || this.closeConfirmDelete()
    },
    confirmDeleteImageOpen(val) {
      val || this.closeConfirmDeleteImage()
    },
  },

  mounted() {
    this.$store.dispatch('events/list')
  },

  methods: {
    parseAndSplitDateTime(input: string): string[] {
      const parsed = DateTime.fromISO(input)
      if (parsed == undefined) {
        return ['', '']
      }
      return [
        parsed.toISODate(),
        parsed.toISOTime({
          suppressSeconds: true,
          includeOffset: false,
        }),
      ]
    },

    editEvent(event: Event) {
      this.activeID = event.id as string
      this.activeEvent = cloneDeep(event)
      ;[this.activeStartDate, this.activeStartTime] =
        this.parseAndSplitDateTime(event.start)
      ;[this.activeEndDate, this.activeEndTime] = this.parseAndSplitDateTime(
        event.end || ''
      )
      this.formOpen = true
    },

    saveEvent() {
      if (this.activeID === '') {
        this.$store.dispatch('events/add', this.activeEvent)
      } else {
        this.$store.dispatch('events/update', this.activeEvent)
      }
      this.closeForm()
    },

    closeForm() {
      this.formOpen = false
      this.$nextTick(() => {
        this.activeID = ''
        this.activeEvent = cloneDeep(this.defaultEvent)
        this.activeStartDate = ''
        this.activeStartTime = ''
        this.activeEndDate = ''
        this.activeEndTime = ''
      })
    },

    selectImage(event: Event) {
      this.activeID = event.id as string
      ;(this.$refs.imageUploader as any).click()
    },

    async uploadImage(e: any) {
      const file = e.target.files[0]
      await this.$store.dispatch('events/upsertImage', {
        event_id: this.activeID,
        image: file,
      })
    },

    deleteEvent(event_id: string) {
      this.activeID = event_id
      this.confirmDeleteOpen = true
    },

    confirmDeleteEvent() {
      this.$store.dispatch('events/delete', this.activeID)
      this.closeConfirmDelete()
    },

    closeConfirmDelete() {
      this.confirmDeleteOpen = false
      this.$nextTick(() => {
        this.activeID = ''
      })
    },

    deleteImage(event_id: string) {
      this.activeID = event_id
      this.confirmDeleteImageOpen = true
    },

    confirmDeleteImage() {
      this.$store.dispatch('events/deleteImage', this.activeID)
      this.closeConfirmDeleteImage()
    },

    closeConfirmDeleteImage() {
      this.confirmDeleteImageOpen = false
      this.$nextTick(() => {
        this.activeID = ''
      })
    },
  },
})
</script>