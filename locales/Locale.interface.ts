// Interface Locale ensures every locale has the same tranlation keys
export interface Locale {
  action: string
  add: string
  addItem: string
  amount: string
  description: string
  cancel: string
  category: string
  count: string
  dashboard: string
  edit: string
  editItem: string
  exampleItem: string
  itemIsMandatory: string
  login: string
  logo: string
  longDescription: string
  manufacturer: string
  name: string
  notValidItem: string
  number: string
  ok: string
  password: string
  photo: string
  price: string
  product: string
  questions: {
    confirm: string
  }
  save: string
  search: string
  shortDescription: string
  status: string
  stockCount: string
  uploadImage: {
    notAnImage: string
    uploadFailed: string
  }
  username: string
  website: string
}
