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
        :value="formattedValue"
        :label="label"
        prepend-icon="mdi-calendar"
        readonly
        v-bind="attrs"
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker v-model="currentValue" color="primary" :min="min" :max="max">
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="modelOpen = false"> Cancel </v-btn>
      <v-btn text color="primary" @click="saveValue"> OK </v-btn>
    </v-date-picker>
  </v-dialog>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { DateTime } from 'luxon'

export default Vue.extend({
  name: 'DateInputWithDialog',

  props: {
    value: {
      type: String,
    } as PropOptions<string>,
    min: {
      type: String,
    } as PropOptions<string>,
    max: {
      type: String,
    } as PropOptions<string>,
    label: {
      type: String,
      required: true,
    } as PropOptions<string>,
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
        return (
          this.internalValue || this.$props.value || DateTime.now().toISODate()
        )
      },
      set(newValue: string) {
        this.internalValue = newValue
      },
    },

    formattedValue(): string {
      if (!this.value) {
        return ''
      }
      return DateTime.fromISO(this.value).toLocaleString(DateTime.DATE_SHORT)
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