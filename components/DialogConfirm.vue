<template>
  <v-dialog
    :value="value"
    @input="$emit('input', $event.target.value)"
    max-width="500px"
  >
    <v-card>
      <v-card-title class="headline">
        {{ $tc('questions.confirm') }}
      </v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="$emit('cancel')">
          {{ $tc('cancel') | capitalize }}
        </v-btn>
        <v-btn color="blue darken-1" text @click="$emit('confirm')">
          {{ $tc('ok') }}
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

export default Vue.extend({
  name: 'DialogConfirm',

  props: {
    value: {
      type: Object as PropType<boolean>,
      required: true,
    },
  },
})
</script>
