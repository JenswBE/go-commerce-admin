export type PageItem = {
  title: PageItemTitle
  icon: string
  to: string
  enabled: boolean
}

export type PageItemTitle = {
  key: string
  plural: boolean
}
