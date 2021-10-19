<template>
  <v-container>
    <v-row class="pt-10">
      <v-col cols="10">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          :label="$tc('search') | capitalize"
          single-line
          hide-details
        ></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-dialog v-model="formOpen" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              {{ $t('addItem', { item: $tc('category') }) }}
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
                      :label="$tc('name') | capitalize"
                      append-icon="mdi-close"
                      @click:append="activeCategory.name = ''"
                      @keydown.enter.prevent="saveCategory"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      v-model="activeCategory.description"
                      :label="$tc('description') | capitalize"
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
              <v-btn color="blue darken-1" text @click="saveCategory">
                {{ $tc('save') | capitalize }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
      <v-col cols="12">
        <DialogConfirm
          v-model="confirmDeleteOpen"
          @confirm="confirmDeleteCategory"
          @cancel="closeConfirmDelete"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-treeview
          :items="sortedCategoriesList"
          item-key="name"
          :open-all="true"
          :search="search"
          activatable
          open-on-click
        >
          <template v-slot:prepend="{ item }">
            <!--
            <v-icon small @click="addChild(item)"> mdi-plus </v-icon>
            <v-icon
              small
              @click="increaseSortOrder(item)"
              :disabled="item.children === undefined"
            >
              mdi-arrow-left
            </v-icon>
            <v-icon small @click="decreaseSortOrder(item)">
              mdi-arrow-right
            </v-icon>
            -->
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
          </template>
          <template v-slot:label="{ item }">
            <v-container fluid>
              <v-row align="center" justify="center">
                <v-col>
                  <p v-text="item.name" />
                </v-col>
                <v-col>
                  <img
                    :src="
                      item.image_urls === undefined
                        ? ''
                        : item.image_urls['100']
                    "
                    class="ma-1"
                    style="cursor: pointer"
                    @click="selectImage(item)"
                  />
                </v-col>
              </v-row>
            </v-container>
          </template>
          <template v-slot:append="{ item }">
            <v-icon small class="mr-2" @click="editCategory(item)">
              mdi-pencil
            </v-icon>
            <v-icon small class="mr-2" @click="selectImage(item)">
              mdi-image-plus
            </v-icon>
            <v-icon small @click="deleteCategory(item.id)"> mdi-delete </v-icon>
          </template>
        </v-treeview>
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
import DialogConfirm from '../components/DialogConfirm.vue'
import { Category } from '../api/api'

export default Vue.extend({
  components: { DialogConfirm },

  head(): MetaInfo {
    return { title: this.$capitalize(this.$tc('category', 2)) }
  },

  data() {
    return {
      search: '',
      formOpen: false,
      confirmDeleteOpen: false,
      activeID: '',
      activeCategory: {
        name: '',
        description: '',
        order: 999,
        parent_id: '',
      } as Category,
      defaultCategory: {
        name: '',
        description: '',
        order: 0,
      } as Category,
    }
  },

  computed: {
    ...mapState('categories', ['categories']),
    ...mapGetters('categories', ['categoriesList', 'sortedCategoriesList']),

    backendURL(): string {
      return this.$axios.defaults.baseURL + '/..'
    },

    formTitle(): string {
      const key = this.activeID === '' ? 'addItem' : 'editItem'
      const title = this.$t(key, { item: this.$tc('category') }).toString()
      return this.$capitalize(title)
    },

    lastCategory(): Category {
      const index = this.sortedCategoriesList.length - 1
      return this.sortedCategoriesList[index]
    },
  },

  watch: {
    formOpen(val: boolean) {
      if (!val) {
        this.closeForm()
      }
    },

    confirmDeleteOpen(val: boolean) {
      if (!val) {
        this.closeConfirmDelete()
      }
    },
  },

  mounted() {
    this.$store.dispatch('categories/list')
  },

  methods: {
    addChild(category: Category) {
      this.activeCategory.parent_id = category.id
      this.formOpen = true
    },

    increaseSortOrder(category: Category) {
      // Fetch previous category
      const prevCat = this.sortedCategoriesList
        .filter((c: Category) => c.order < category.order)
        .pop()

      // Swap order
      this.swapSortOrder(prevCat, category)
    },

    decreaseSortOrder(category: Category) {
      // Fetch previous category
      const nextCat = this.sortedCategoriesList.filter(
        (c: Category) => c.order > category.order
      )[0]

      // Swap order
      this.swapSortOrder(category, nextCat)
    },

    swapSortOrder(a: Category, b: Category) {
      // Don't change original variables
      a = cloneDeep(a)
      b = cloneDeep(b)

      // Swap order
      ;[a.order, b.order] = [b.order, a.order]

      // Save swap
      this.$store.dispatch('categories/update', a)
      this.$store.dispatch('categories/update', b)
    },

    editCategory(category: Category) {
      this.activeID = category.id as string
      this.activeCategory = cloneDeep(category)
      this.formOpen = true
    },

    saveCategory() {
      if (this.activeID === '') {
        // Add category
        if (this.lastCategory !== undefined) {
          // Other categories exist
          this.activeCategory.order = this.lastCategory.order + 1
        } else {
          // First category
          this.activeCategory.order = 0
        }
        this.$store.dispatch('categories/add', this.activeCategory)
      } else {
        // Update category
        this.$store.dispatch('categories/update', this.activeCategory)
      }
      this.closeForm()
    },

    closeForm() {
      this.formOpen = false
      this.$nextTick(() => {
        this.activeID = ''
        this.activeCategory = cloneDeep(this.defaultCategory)
      })
    },

    selectImage(category: Category) {
      this.activeID = category.id as string
      this.$refs.imageUploader.click()
    },

    async uploadImage(e: any) {
      const file = e.target.files[0]
      await this.$store.dispatch('categories/upsertImage', {
        category_id: this.activeID,
        image: file,
      })
    },

    deleteCategory(category_id: string) {
      this.activeID = category_id
      this.confirmDeleteOpen = true
    },

    confirmDeleteCategory() {
      this.$store.dispatch('categories/delete', this.activeID)
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