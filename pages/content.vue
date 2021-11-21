<template>
  <v-container>
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="contentList"
          sort-by="name"
          class="elevation-1"
          :search="search"
          hide-default-footer
        >
          <template v-slot:top>
            <v-dialog v-model="formOpen" max-width="500px">
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-textarea
                          v-model="activeBody"
                          append-icon="mdi-close"
                          @click:append="activeBody = ''"
                          @keydown.enter.ctrl.prevent="updateContent"
                        ></v-textarea>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeForm">
                    {{ $tc('cancel') | capitalize }}
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="updateContent">
                    {{ $tc('save') | capitalize }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn icon @click="editContent(item)">
              <v-icon small> mdi-pencil </v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { MetaInfo } from 'vue-meta'
import { mapGetters, mapState } from 'vuex'
import { Content } from '../api/api'
import { Header } from '../interfaces/DataTable.interface'
import DateInputWithDialog from '~/components/DateInputWithDialog.vue'
import { cloneDeep } from 'lodash'

export default Vue.extend({
  components: { DateInputWithDialog },

  head(): MetaInfo {
    return { title: this.$capitalize(this.$tc('content', 2)) }
  },

  data: () => ({
    search: '',
    formOpen: false,
    activeName: '',
    activeBody: '',
  }),

  computed: {
    ...mapState('content', ['content']),
    ...mapGetters('content', ['contentList']),

    formTitle(): string {
      const key = this.activeName === '' ? 'addItem' : 'editItem'
      const title = this.$t(key, { item: this.$tc('content') }).toString()
      return this.$capitalize(title)
    },

    headers(): Header[] {
      return [
        {
          text: this.$capitalize(this.$tc('name')),
          value: 'name',
          sortable: true,
        },
        {
          text: this.$capitalize(this.$tc('body')),
          value: 'body',
          sortable: false,
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
  },

  mounted() {
    this.$store.dispatch('content/list')
  },

  methods: {
    editContent(content: Content) {
      this.activeName = content.name
      this.activeBody = content.body
      this.formOpen = true
    },

    updateContent() {
      let currentContent = cloneDeep(this.content[this.activeName] as Content)
      currentContent.body = this.activeBody
      this.$store.dispatch('content/update', currentContent)
      this.closeForm()
    },

    closeForm() {
      this.formOpen = false
      this.$nextTick(() => {
        this.activeName = ''
      })
    },
  },
})
</script>