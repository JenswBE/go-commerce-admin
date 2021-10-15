<template>
  <v-container>
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="productsList"
          sort-by="name"
          class="elevation-1"
          :search="search"
          disable-pagination
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
                    {{ $t('addItem', { item: $tc('product') }) }}
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
                            v-model="activeProduct.name"
                            :label="$tc('name') | capitalize"
                            append-icon="mdi-close"
                            @click:append="activeProduct.name = ''"
                            @keydown.enter.prevent="saveProduct"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            v-model.number="activePrice"
                            :label="$tc('price') | capitalize"
                            prefix="€"
                            type="number"
                            step="0.01"
                            min="0"
                            @keydown.enter.prevent="saveProduct"
                            :rules="[
                              () =>
                                !!activeProduct.price ||
                                $capitalize(
                                  $t('notValidItem', { item: $tc('amount') })
                                ),
                            ]"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-select
                            v-model="activeProduct.manufacturer_id"
                            :items="manufacturersList"
                            item-text="name"
                            item-value="id"
                            :label="$tc('manufacturer') | capitalize"
                            append-icon="mdi-close"
                            @click:append="activeProduct.manufacturer_id = ''"
                          ></v-select>
                        </v-col>
                        <v-col cols="12">
                          <v-select
                            v-model="activeProduct.category_ids"
                            :items="categoriesList"
                            item-text="name"
                            item-value="id"
                            :label="$tc('category', 2) | capitalize"
                            chips
                            deletable-chips
                            hide-selected
                            multiple
                          ></v-select>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            v-model.number="activeProduct.stock_count"
                            :label="$tc('stockCount') | capitalize"
                            type="number"
                            min="0"
                            @keydown.enter.prevent="saveProduct"
                            :rules="[
                              () =>
                                !!activeProduct.stock_count ||
                                $capitalize(
                                  $t('notValidItem', { item: $tc('number') })
                                ),
                            ]"
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
                    <v-btn color="blue darken-1" text @click="saveProduct">
                      {{ $tc('save') | capitalize }}
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="editDescriptionsOpen" max-width="500px">
                <v-card>
                  <v-card-title>
                    <span class="headline">
                      {{
                        $t('editItem', { item: $tc('description', 2) })
                          | capitalize
                      }}
                    </span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <v-textarea
                            v-model="activeProduct.description_short"
                            :label="$tc('shortDescription') | capitalize"
                            append-icon="mdi-close"
                            @click:append="activeProduct.description_short = ''"
                          />
                        </v-col>
                        <v-col cols="12">
                          <v-textarea
                            v-model="activeProduct.description_long"
                            :label="$tc('longDescription') | capitalize"
                            append-icon="mdi-close"
                            @click:append="activeProduct.description_long = ''"
                          />
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="closeEditDescriptionsForm"
                    >
                      {{ $tc('cancel') | capitalize }}
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="saveProduct">
                      {{ $tc('save') | capitalize }}
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <DialogConfirm
                v-model="confirmDeleteOpen"
                @confirm="confirmDeleteProduct"
                @cancel="closeConfirmDelete"
              />
              <DialogImages
                v-model="editImagesOpen"
                :images="images"
                @close="closeEditImages"
                @addImage="addImage"
                @deleteImage="deleteImage"
              />
            </v-toolbar>
          </template>
          <template v-slot:[`item.photo`]="{ item }">
            <v-btn text @click="editImages(item)">
              {{ item.image_urls.length }}
            </v-btn>
          </template>
          <template v-slot:[`item.price`]="{ item }">
            {{ item.price | formatPrice }}
          </template>
          <template v-slot:[`item.manufacturer_id`]="{ item }">
            {{
              manufacturers[item.manufacturer_id]
                ? manufacturers[item.manufacturer_id].name
                : ''
            }}
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <a :href="`${$config.frontendURL}/producten/p/${item.id}`">
              <v-icon small class="mx-1">mdi-link-variant</v-icon>
            </a>
            <v-icon small class="mx-1" @click="editProduct(item)">
              mdi-pencil
            </v-icon>
            <v-icon small class="mx-1" @click="editImages(item)">
              mdi-image
            </v-icon>
            <v-icon small class="mx-1" @click="editDescriptions(item)">
              mdi-format-font
            </v-icon>
            <v-icon small class="mx-1" @click="deleteProduct(item.id)">
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { MetaInfo } from 'vue-meta'
import cloneDeep from 'lodash.clonedeep'
import { mapGetters, mapState } from 'vuex'
import { Header } from '../interfaces/DataTable.interface'
import { Image, ImageList, Product } from '../api/api'
import { AddImageReq, DeleteImageReq } from '../store/products'

export default Vue.extend({
  head(): MetaInfo {
    return { title: this.$capitalize(this.$tc('product', 2)) }
  },

  data: () => ({
    search: '',
    formOpen: false,
    editDescriptionsOpen: false,
    editImagesOpen: false,
    confirmDeleteOpen: false,
    activeID: '',
    images: [] as Array<Image>,
    activeProduct: {
      name: '',
      slug: '',
      description_short: '',
      description_long: '',
      price: 0,
      category_ids: [],
      manufacturer_id: '',
      status: 'AVAILABLE',
      stock_count: 0,
    } as Product,
    defaultProduct: {
      name: '',
      slug: '',
      description_short: '',
      description_long: '',
      price: 0,
      category_ids: [],
      manufacturer_id: '',
      status: 'AVAILABLE',
      stock_count: 0,
    } as Product,
  }),

  computed: {
    ...mapState('manufacturers', ['manufacturers']),
    ...mapState('products', ['products']),
    ...mapGetters('categories', ['categoriesList']),
    ...mapGetters('manufacturers', ['manufacturersList']),
    ...mapGetters('products', ['productsList']),

    activePrice: {
      get: function () {
        return (this.activeProduct.price as number) / 100.0
      },
      set: function (newValue: number) {
        this.activeProduct.price = Math.round(newValue * 100)
      },
    },

    backendURL(): string {
      return this.$axios.defaults.baseURL + '/..'
    },

    formTitle(): string {
      const key = this.activeID === '' ? 'addItem' : 'editItem'
      const title = this.$t(key, { item: this.$tc('product') }).toString()
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
          text: this.$capitalize(this.$tc('photo', 2)),
          value: 'photo',
          sortable: false,
        },
        {
          text: this.$capitalize(this.$tc('price')),
          value: 'price',
          sortable: false,
        },
        {
          text: this.$capitalize(this.$tc('manufacturer')),
          value: 'manufacturer_id',
          sortable: false,
        },
        {
          text: this.$capitalize(this.$tc('stockCount')),
          value: 'stock_count',
          sortable: false,
        },
        {
          text: this.$capitalize(this.$tc('status')),
          value: 'status',
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
    editImagesOpen(val) {
      val || this.closeEditImages()
    },
    confirmDeleteOpen(val) {
      val || this.closeConfirmDelete()
    },
  },

  mounted() {
    this.$store.dispatch('products/list')
    this.$store.dispatch('categories/list')
    this.$store.dispatch('manufacturers/list')
  },

  methods: {
    editProduct(product: Product) {
      this.activeID = product.id as string
      this.activeProduct = cloneDeep(product)
      this.formOpen = true
    },

    editDescriptions(product: Product) {
      this.activeID = product.id as string
      this.activeProduct = cloneDeep(product)
      this.editDescriptionsOpen = true
    },

    async editImages(product: Product) {
      this.activeID = product.id as string
      this.activeProduct = cloneDeep(product)
      this.$api.products
        .adminListProductImages(this.activeID, ['100'])
        .then(({ data }) => {
          this.images = (data as ImageList).images
          this.editImagesOpen = true
        })
    },

    saveProduct() {
      if (this.activeID === '') {
        this.$store.dispatch('products/add', this.activeProduct)
      } else {
        this.$store.dispatch('products/update', this.activeProduct)
      }
      this.closeForm()
      this.closeEditDescriptionsForm()
    },

    closeForm() {
      this.formOpen = false
      this.$nextTick(() => {
        this.activeID = ''
        this.activeProduct = cloneDeep(this.defaultProduct)
      })
    },

    closeEditDescriptionsForm() {
      this.editDescriptionsOpen = false
      this.$nextTick(() => {
        this.activeID = ''
        this.activeProduct = cloneDeep(this.defaultProduct)
      })
    },

    closeEditImages() {
      this.editImagesOpen = false
      this.$nextTick(() => {
        this.activeID = ''
        this.activeProduct = cloneDeep(this.defaultProduct)
      })
    },

    async addImage(e: any) {
      const req: AddImageReq = {
        product_id: this.activeID,
        image: e,
      }
      this.$store
        .dispatch('products/addImage', req)
        .then((images: Array<Image>) => {
          this.images = images
        })
    },

    async deleteImage(e: any) {
      const req: DeleteImageReq = {
        product_id: this.activeID,
        image_id: e,
      }
      await this.$store.dispatch('products/deleteImage', req)
      this.images = this.images.filter((img: Image) => img.id !== e)
    },

    deleteProduct(product_id: string) {
      this.activeID = product_id
      this.confirmDeleteOpen = true
    },

    confirmDeleteProduct() {
      this.$store.dispatch('products/delete', this.activeID)
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