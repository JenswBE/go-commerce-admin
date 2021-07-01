<template>
  <v-container>
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="categoriesList"
          sort-by="sort_order"
          class="elevation-1"
          :search="search"
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
                    Categorie toevoegen
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
                            v-model="activeCategory.name"
                            label="Naam"
                            placeholder="Bv. Gelaatsverzorging"
                            append-icon="mdi-close"
                            @click:append="activeCategory.name = ''"
                            @keydown.enter.prevent="saveCategory"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-textarea
                            v-model="activeCategory.description"
                            label="Beschrijving"
                          ></v-textarea>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeForm">
                      Annuleren
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="saveCategory">
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
                      @click="confirmDeleteCategory"
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
          <template v-slot:item.actions="{ item }">
            <v-icon
              small
              @click="increaseSortOrder(item)"
              :disabled="sortedCategoriesList[0].id === item.id"
            >
              mdi-arrow-up
            </v-icon>
            <v-icon
              small
              @click="decreaseSortOrder(item)"
              :disabled="lastCategory.id === item.id"
            >
              mdi-arrow-down
            </v-icon>
            <v-icon small class="mr-2" @click="editCategory(item)">
              mdi-pencil
            </v-icon>
            <v-icon small class="mr-2" @click="selectImage(item)">
              mdi-image-plus
            </v-icon>
            <v-icon small @click="deleteCategory(item.id)"> mdi-delete </v-icon>
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
  head: { title: 'Categorieën' },

  data: () => ({
    search: '',
    cacheKey: '',
    formOpen: false,
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
      { text: 'Acties', value: 'actions', sortable: false },
    ],
    activeID: '',
    activeCategory: {
      name: '',
      description: '',
      sort_order: 999,
    },
    defaultCategory: {
      name: '',
      description: '',
      sort_order: 0,
    },
  }),

  computed: {
    ...mapState('categories', ['categories']),
    ...mapGetters('categories', ['categoriesList', 'sortedCategoriesList']),

    backendURL() {
      return this.$axios.defaults.baseURL + '/..';
    },

    formTitle() {
      return this.activeID === ''
        ? 'Categorie toevoegen'
        : 'Categorie bewerken';
    },

    lastCategory() {
      const index = this.sortedCategoriesList.length - 1;
      return this.sortedCategoriesList[index];
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
    this.bumpCacheKey;
    this.$store.dispatch('categories/list');
  },

  methods: {
    increaseSortOrder(category) {
      // Fetch previous category
      const prevCat = this.sortedCategoriesList
        .filter((c) => c.sort_order < category.sort_order)
        .pop();

      // Swap sort_order
      this.swapSortOrder(prevCat, category);
    },

    decreaseSortOrder(category) {
      // Fetch previous category
      const nextCat = this.sortedCategoriesList.filter(
        (c) => c.sort_order > category.sort_order
      )[0];

      // Swap sort_order
      this.swapSortOrder(category, nextCat);
    },

    swapSortOrder(a, b) {
      // Don't change original variables
      a = cloneDeep(a);
      b = cloneDeep(b);

      // Swap sort_order
      [a.sort_order, b.sort_order] = [b.sort_order, a.sort_order];

      // Save swap
      this.$store.dispatch('categories/update', a);
      this.$store.dispatch('categories/update', b);
    },

    editCategory(category) {
      this.activeID = category.id;
      this.activeCategory = cloneDeep(category);
      this.formOpen = true;
    },

    saveCategory() {
      if (this.activeID === '') {
        // Add category
        if (this.lastCategory !== undefined) {
          // Other categories exist
          this.activeCategory.sort_order = this.lastCategory.sort_order + 1;
        } else {
          // First category
          this.activeCategory.sort_order = 0;
        }
        this.$store.dispatch('categories/add', this.activeCategory);
      } else {
        // Update category
        this.$store.dispatch('categories/update', this.activeCategory);
      }
      this.closeForm();
    },

    closeForm() {
      this.formOpen = false;
      this.$nextTick(() => {
        this.activeID = '';
        this.activeCategory = cloneDeep(this.defaultCategory);
      });
    },

    selectImage(manufacturer) {
      this.activeID = manufacturer.id;
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

    deleteCategory(category_id) {
      this.activeID = category_id;
      this.confirmDeleteOpen = true;
    },

    confirmDeleteCategory() {
      this.$store.dispatch('categories/delete', this.activeID);
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