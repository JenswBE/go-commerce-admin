<template>
  <v-dialog
    ref="dialog"
    v-model="modelOpen"
    :return-value.sync="currentValue"
    persistent
    width="290px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        :value="value"
        :label="label"
        prepend-icon="mdi-clock-time-four-outline"
        readonly
        v-bind="attrs"
        v-on="on"
      ></v-text-field>
    </template>
    <v-time-picker
      v-if="modelOpen"
      v-model="currentValue"
      full-width
      format="24hr"
      :min="min"
      :max="max"
      :allowed-minutes="(m) => m % 5 === 0"
    >
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="modelOpen = false"> Cancel </v-btn>
      <v-btn text color="primary" @click="saveValue"> OK </v-btn>
    </v-time-picker>
  </v-dialog>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

export default Vue.extend({
  name: 'TimeInputWithDialog',

  props: {
    value: {
      type: Object as PropType<string>,
    },
    min: {
      type: Object as PropType<string>,
    },
    max: {
      type: Object as PropType<string>,
    },
    label: {
      type: Object as PropType<string>,
      required: true,
    },
  },

  data: () => ({
    modelOpen: false,
    internalValue: '',
  }),

  watch: {
    value() {
      this.internalValue = ''
    },
  },

  computed: {
    currentValue: {
      get(): string {
        return this.internalValue || this.$props.value || '08:00'
      },
      set(newValue: string) {
        this.internalValue = newValue
      },
    },
  },

  methods: {
    saveValue() {
      this.$emit('input', this.currentValue)
      ;(this.$refs as any).dialog.save(this.currentValue)
    },
  },
})
</script>