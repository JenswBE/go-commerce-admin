<template>
  <a
    :href="to"
    rel="noopener"
    class="text-decoration-none"
    :target="newTab ? '_blank' : '_self'"
  >
    <slot></slot>
  </a>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

export default Vue.extend({
  name: 'ExtLink',

  props: {
    to: {
      type: String as PropType<string>,
      required: true,
    },
    newTab: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
  },
})
</script>