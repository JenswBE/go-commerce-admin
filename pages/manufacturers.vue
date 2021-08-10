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
            </v-toolbar>
          </template>
          <template v-slot:item.logo="{ item }">
            <img
              :src="`${backendURL}/images/${item.id}-100-100-fit.png?cache=${cacheKey}`"
              class="ma-1"
              style="cursor: pointer"
              @click="selectImage(item)"
            />
          </template>
          <template v-slot:item.website_url="{ item }">
            <p>
              <a :href="item.website_url" target="_blank">{{
                item.website_url
              }}</a>
            </p>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="editManufacturer(item)">
              mdi-pencil
            </v-icon>
            <v-icon small class="mr-2" @click="selectImage(item)">
              mdi-image-plus
            </v-icon>
            <v-icon small @click="deleteManufacturer(item.id)">
              mdi-delete
            </v-icon>
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
    cacheKey: 0,
    formOpen: false,
    confirmDeleteOpen: false,
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
  },

  mounted() {
    this.bumpCacheKey()
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
      await this.$store.dispatch('images/upload', { id: this.activeID, file })
      setTimeout(this.bumpCacheKey, 2000)
    },

    bumpCacheKey() {
      this.cacheKey = Date.now()
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
  },
})
</script>