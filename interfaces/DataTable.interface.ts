// Header of a data table.
// See https://vuetifyjs.com/en/components/data-tables/
export interface Header {
  // Name of the header
  text: string

  // Column should be sortable
  sortable: boolean

  // Attribute name to use the value of
  value: string
}
