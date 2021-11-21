<template>
  <v-container>
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="contentList"
          sort-by="name"
          class="elevation-1"
          hide-default-footer
        >
          <template v-slot:top>
            <v-dialog v-model="formOpen" width="80vw">
              <v-card>
                <v-card-title>
                  <span class="headline">
                    {{ $t('editItem', { item: $tc('content') }) | capitalize }}
                  </span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-textarea
                          v-if="contentType === contentTypes.Simple"
                          v-model="activeContent.body"
                          append-icon="mdi-close"
                          @click:append="activeContent.body = ''"
                          @keydown.enter.ctrl.prevent="updateContent"
                        ></v-textarea>
                        <client-only>
                          <VueEditor
                            v-if="contentType === contentTypes.Html"
                            v-model="activeContent.body"
                            :editor-toolbar="customQuillToolbar"
                          />
                        </client-only>
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
          <template v-slot:[`item.body`]="{ item }">
            <p>{{ formatBody(item.body) }}</p>
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
import { Content, ContentType } from '../api/api'
import { Header } from '../interfaces/DataTable.interface'
import { cloneDeep } from 'lodash'

export default Vue.extend({
  head(): MetaInfo {
    return { title: this.$capitalize(this.$tc('content', 2)) }
  },

  data: () => ({
    formOpen: false,
    activeContent: {} as Content,
    contentTypes: ContentType,
    customQuillToolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['clean'],
    ],
  }),

  computed: {
    ...mapState('content', ['content']),
    ...mapGetters('content', ['contentList']),

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

    contentType(): ContentType {
      return this.activeContent !== undefined
        ? this.activeContent.content_type
        : ContentType.Simple
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
    formatBody(input: string): string {
      // Strip HTML
      // Based on https://stackoverflow.com/a/31516115
      let tmp = document.createElement('div')
      tmp.innerHTML = input
      const bodyText = tmp.textContent || tmp.innerText

      // Trim if too long
      if (bodyText.length > 100) {
        return bodyText.substr(0, 97) + '...'
      }
      return bodyText
    },

    editContent(content: Content) {
      this.activeContent = cloneDeep(content)
      this.formOpen = true
    },

    updateContent() {
      this.$store.dispatch('content/update', this.activeContent)
      this.closeForm()
    },

    closeForm() {
      this.formOpen = false
    },
  },
})
</script>