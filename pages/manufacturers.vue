<template>
  <v-container>
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="manufacturersList"
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
                    {{ $t('addItem', { item: $tc('manufacturer') }) }}
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
                            v-model="activeManufacturer.name"
                            :label="$tc('name') | capitalize"
                            :placeholder="
                              $t('exampleItem', { item: 'JenswBE' })
                                | capitalize
                            "
                            append-icon="mdi-close"
                            @click:append="activeManufacturer.name = ''"
                            @keydown.enter.prevent="saveManufacturer"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            v-model="activeManufacturer.website_url"
                            :label="$tc('website') | capitalize"
                            :placeholder="
                              $t('exampleItem', { item: 'https://jensw.be' })
                                | capitalize
                            "
                            append-icon="mdi-close"
                            @click:append="activeManufacturer.website_url = ''"
                            @keydown.enter.prevent="saveManufacturer"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeForm">
                      {{ $tc('cancel') | capitalize }}
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="saveManufacturer">
                      {{ $tc('save') | capitalize }}
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <DialogConfirm
                v-model="confirmDeleteOpen"
                @confirm="confirmDeleteManufacturer"
                @cancel="closeConfirmDelete"
              />
              <DialogConfirm
                v-model="confirmDeleteImageOpen"
                @confirm="confirmDeleteImage"
                @cancel="closeConfirmDeleteImage"
              />
            </v-toolbar>
          </template>
          <template v-slot:item.logo="{ item }">
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
          <template v-slot:item.website_url="{ item }">
            <p>
              <a :href="item.website_url" target="_blank">{{
                item.website_url
              }}</a>
            </p>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn icon @click="editManufacturer(item)">
              <v-icon small> mdi-pencil </v-icon>
            </v-btn>
            <v-btn icon @click="deleteManufacturer(item.id)">
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
import cloneDeep from 'lodash.clonedeep'
import { mapGetters, mapState } from 'vuex'
import { Manufacturer } from '../api/api'
import { Header } from '../interfaces/DataTable.interface'

export default Vue.extend({
  head() {
    return { title: this.$capitalize(this.$tc('manufacturer', 2)) }
  },

  data: () => ({
    search: '',
    formOpen: false,
    confirmDeleteOpen: false,
    confirmDeleteImageOpen: false,
    activeID: '',
    activeManufacturer: {
      name: '',
      website_url: '',
    } as Manufacturer,
    defaultManufacturer: {
      name: '',
      website_url: '',
    } as Manufacturer,
  }),

  computed: {
    ...mapState('manufacturers', ['manufacturers']),
    ...mapGetters('manufacturers', ['manufacturersList']),

    backendURL(): string {
      return this.$axios.defaults.baseURL + '/..'
    },

    formTitle(): string {
      const key = this.activeID === '' ? 'addItem' : 'editItem'
      const title = this.$t(key, { item: this.$tc('manufacturer') }).toString()
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
          text: this.$capitalize(this.$tc('logo')),
          value: 'logo',
          sortable: false,
        },
        {
          text: this.$capitalize(this.$tc('website')),
          value: 'website_url',
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
    confirmDeleteOpen(val) {
      val || this.closeConfirmDelete()
    },
    confirmDeleteImageOpen(val) {
      val || this.closeConfirmDeleteImage()
    },
  },

  mounted() {
    this.$store.dispatch('manufacturers/list')
  },

  methods: {
    editManufacturer(manufacturer: Manufacturer) {
      this.activeID = manufacturer.id as string
      this.activeManufacturer = cloneDeep(manufacturer)
      this.formOpen = true
    },

    saveManufacturer() {
      const website_url = this.activeManufacturer.website_url
      if (
        website_url !== undefined &&
        website_url.length > 0 &&
        !website_url.startsWith('http')
      ) {
        this.activeManufacturer.website_url = 'https://' + website_url
      }

      if (this.activeID === '') {
        this.$store.dispatch('manufacturers/add', this.activeManufacturer)
      } else {
        this.$store.dispatch('manufacturers/update', this.activeManufacturer)
      }
      this.closeForm()
    },

    closeForm() {
      this.formOpen = false
      this.$nextTick(() => {
        this.activeID = ''
        this.activeManufacturer = cloneDeep(this.defaultManufacturer)
      })
    },

    selectImage(manufacturer: Manufacturer) {
      this.activeID = manufacturer.id as string
      ;(this.$refs.imageUploader as any).click()
    },

    async uploadImage(e: any) {
      const file = e.target.files[0]
      await this.$store.dispatch('manufacturers/upsertImage', {
        manufacturer_id: this.activeID,
        image: file,
      })
    },

    deleteManufacturer(manufacturer_id: string) {
      this.activeID = manufacturer_id
      this.confirmDeleteOpen = true
    },

    confirmDeleteManufacturer() {
      this.$store.dispatch('manufacturers/delete', this.activeID)
      this.closeConfirmDelete()
    },

    closeConfirmDelete() {
      this.confirmDeleteOpen = false
      this.$nextTick(() => {
        this.activeID = ''
      })
    },

    deleteImage(manufacturer_id: string) {
      this.activeID = manufacturer_id
      this.confirmDeleteImageOpen = true
    },

    confirmDeleteImage() {
      this.$store.dispatch('manufacturers/deleteImage', this.activeID)
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