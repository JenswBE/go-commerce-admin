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
                label="Zoeken"
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
                    Product toevoegen
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
                            label="Naam"
                            placeholder="Bv. Deep care handcrème"
                            append-icon="mdi-close"
                            @click:append="activeProduct.name = ''"
                            @keydown.enter.prevent="saveProduct"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            v-model.number="activePrice"
                            label="Prijs"
                            placeholder="Bv. 15.00"
                            prefix="€"
                            type="number"
                            step="0.01"
                            min="0"
                            @keydown.enter.prevent="saveProduct"
                            :rules="[
                              () =>
                                !!activeProduct.price || 'Geen geldig bedrag',
                            ]"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-select
                            v-model="activeProduct.manufacturer_id"
                            :items="manufacturersList"
                            item-text="name"
                            item-value="id"
                            label="Fabrikant"
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
                            label="Categorieën"
                            chips
                            deletable-chips
                            hide-selected
                            multiple
                          ></v-select>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            v-model.number="activeProduct.stock_count"
                            label="In voorraad"
                            type="number"
                            min="0"
                            @keydown.enter.prevent="saveProduct"
                            :rules="[
                              () =>
                                !!activeProduct.stock_count ||
                                'Geen geldig getal',
                            ]"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeForm">
                      Annuleren
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="saveProduct">
                      Opslaan
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="editDescriptionsOpen" max-width="500px">
                <v-card>
                  <v-card-title>
                    <span class="headline">Beschrijvingen bewerken</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <v-textarea
                            v-model="activeProduct.description_short"
                            label="Korte beschrijving"
                            append-icon="mdi-close"
                            @click:append="activeProduct.description_short = ''"
                          />
                        </v-col>
                        <v-col cols="12">
                          <v-textarea
                            v-model="activeProduct.description_long"
                            label="Lange beschrijving"
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
                      Annuleren
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="saveProduct">
                      Opslaan
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="confirmDeleteOpen" max-width="500px">
                <v-card>
                  <v-card-title class="headline">Ben je zeker?</v-card-title>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="closeConfirmDelete"
                      >Annuleren</v-btn
                    >
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="confirmDeleteProduct"
                      >OK</v-btn
                    >
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:item.photo="{ item }">
            <img
              :src="`${backendURL}/images/${item.id}-100-100-fit.png?cache=${cacheKey}`"
              class="ma-1"
              style="cursor: pointer"
              @click="selectImage(item)"
            />
          </template>
          <template v-slot:item.price="{ item }">
            {{ item.price | formatPrice }}
          </template>
          <template v-slot:item.manufacturer_id="{ item }">
            {{
              manufacturers[item.manufacturer_id]
                ? manufacturers[item.manufacturer_id].name
                : ''
            }}
          </template>
          <template v-slot:item.actions="{ item }">
            <a :href="`${$config.frontendURL}/producten/p/${item.id}`">
              <v-icon small class="mx-1">mdi-link-variant</v-icon>
            </a>
            <v-icon small class="mx-1" @click="editProduct(item)">
              mdi-pencil
            </v-icon>
            <v-icon small class="mx-1" @click="editDescriptions(item)">
              mdi-format-font
            </v-icon>
            <v-icon small class="mx-1" @click="selectImage(item)">
              mdi-image-plus
            </v-icon>
            <v-icon small class="mx-1" @click="deleteProduct(item.id)">
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

<script>
import cloneDeep from 'lodash.clonedeep';
import { mapGetters, mapState } from 'vuex';

export default {
  head: { title: 'Producten' },

  data: () => ({
    search: '',
    cacheKey: '',
    formOpen: false,
    editDescriptionsOpen: false,
    confirmDeleteOpen: false,
    headers: [
      {
        text: 'Naam',
        sortable: true,
        value: 'name',
      },
      {
        text: 'Foto',
        sortable: false,
        value: 'photo',
      },
      {
        text: 'Prijs',
        sortable: false,
        value: 'price',
      },
      {
        text: 'Fabrikant',
        sortable: false,
        value: 'manufacturer_id',
      },
      {
        text: 'In voorraad',
        sortable: false,
        value: 'stock_count',
      },
      {
        text: 'Status',
        sortable: false,
        value: 'status',
      },
      { text: 'Acties', value: 'actions', sortable: false },
    ],
    activeID: '',
    activeProduct: {
      name: '',
      slug: '',
      description_short: '',
      description_long: '',
      price: 0,
      category_ids: [],
      manufacturer_id: '',
      status: '',
      stock_count: 0,
    },
    defaultProduct: {
      name: '',
      slug: '',
      description_short: '',
      description_long: '',
      price: 0,
      category_ids: [],
      manufacturer_id: '',
      status: '',
      stock_count: 0,
    },
  }),

  computed: {
    ...mapState('manufacturers', ['manufacturers']),
    ...mapState('products', ['products']),
    ...mapGetters('categories', ['categoriesList']),
    ...mapGetters('manufacturers', ['manufacturersList']),
    ...mapGetters('products', ['productsList']),

    backendURL() {
      return this.$axios.defaults.baseURL + '/..';
    },

    formTitle() {
      return this.activeID === '' ? 'Product toevoegen' : 'Product bewerken';
    },

    activePrice: {
      get: function () {
        return this.activeProduct.price / 100.0;
      },
      set: function (newValue) {
        this.activeProduct.price = Math.round(newValue * 100);
      },
    },
  },

  watch: {
    formOpen(val) {
      val || this.closeForm();
    },
    confirmDeleteOpen(val) {
      val || this.closeConfirmDelete();
    },
  },

  mounted() {
    this.bumpCacheKey();
    this.$store.dispatch('products/list');
    this.$store.dispatch('categories/list');
    this.$store.dispatch('manufacturers/list');
  },

  methods: {
    editProduct(product) {
      this.activeID = product.id;
      this.activeProduct = cloneDeep(product);
      this.formOpen = true;
    },

    editDescriptions(product) {
      this.activeID = product.id;
      this.activeProduct = cloneDeep(product);
      this.editDescriptionsOpen = true;
    },

    saveProduct() {
      if (this.activeID === '') {
        this.$store.dispatch('products/add', this.activeProduct);
      } else {
        this.$store.dispatch('products/update', this.activeProduct);
      }
      this.closeForm();
      this.closeEditDescriptionsForm();
    },

    closeForm() {
      this.formOpen = false;
      this.$nextTick(() => {
        this.activeID = '';
        this.activeProduct = cloneDeep(this.defaultProduct);
      });
    },

    closeEditDescriptionsForm() {
      this.editDescriptionsOpen = false;
      this.$nextTick(() => {
        this.activeID = '';
        this.activeProduct = cloneDeep(this.defaultProduct);
      });
    },

    selectImage(product) {
      this.activeID = product.id;
      this.$refs.imageUploader.click();
    },

    async uploadImage(e) {
      const file = e.target.files[0];
      await this.$store.dispatch('images/upload', { id: this.activeID, file });
      setTimeout(this.bumpCacheKey, 2000);
    },

    bumpCacheKey() {
      this.cacheKey = Date.now();
    },

    deleteProduct(product_id) {
      this.activeID = product_id;
      this.confirmDeleteOpen = true;
    },

    confirmDeleteProduct() {
      this.$store.dispatch('products/delete', this.activeID);
      this.closeConfirmDelete();
    },

    closeConfirmDelete() {
      this.confirmDeleteOpen = false;
      this.$nextTick(() => {
        this.activeID = '';
      });
    },
  },
};
</script>