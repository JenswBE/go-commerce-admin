<template>
  <v-dialog
    :value="value"
    @input="
      $event.target !== undefined
        ? $emit('input', $event.target.value)
        : $emit('close')
    "
    max-width="500px"
  >
    <v-card>
      <v-card-title class="headline">
        {{ $t('editItem', { item: $tc('photo', 2) }) | capitalize }}
      </v-card-title>

      <v-card-text>
        <v-list>
          <v-list-item v-for="img in images" :key="img.id">
            <v-list-item-avatar tile>
              <v-img :src="img.urls['100']"></v-img>
            </v-list-item-avatar>

            <v-spacer></v-spacer>

            <v-list-item-action>
              <v-btn icon :disabled="img.order == minOrder">
                <v-icon color="grey lighten-1">mdi-arrow-up</v-icon>
              </v-btn>
            </v-list-item-action>

            <v-list-item-action>
              <v-btn icon :disabled="img.order == maxOrder">
                <v-icon color="grey lighten-1">mdi-arrow-down</v-icon>
              </v-btn>
            </v-list-item-action>

            <v-list-item-action>
              <v-btn icon @click="$emit('deleteImage', img.id)">
                <v-icon color="grey lighten-1">mdi-delete</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <v-row align="center" justify="space-around">
          <v-btn fab small color="success" @click="selectImage">
            <v-icon> mdi-plus </v-icon>
          </v-btn>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="$emit('close')">
          {{ $tc('close') | capitalize }}
        </v-btn>
      </v-card-actions>
    </v-card>

    <input
      ref="imageUploader"
      class="d-none"
      type="file"
      accept="image/*"
      @change="uploadImage"
    />
  </v-dialog>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Image } from '../api/api'

export default Vue.extend({
  name: 'DialogImages',

  props: {
    value: {
      type: Object as PropType<boolean>,
      required: true,
    },

    images: {
      type: Object as PropType<Array<Image>>,
      required: true,
    },
  },

  computed: {
    minOrder(): number {
      return this.images.reduce(
        (min: number, img: Image) => (img.order < min ? img.order : min),
        0
      )
    },

    maxOrder(): number {
      return this.images.reduce(
        (max: number, img: Image) => (img.order > max ? img.order : max),
        0
      )
    },
  },

  methods: {
    selectImage() {
      ;(this.$refs.imageUploader as any).click()
    },

    async uploadImage(e: any) {
      const file = e.target.files[0]
      this.$emit('addImage', file)
    },
  },
})
</script>
