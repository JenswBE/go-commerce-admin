// Interface Locale ensures every locale has the same tranlation keys
export interface Locale {
  action: string
  add: string
  addItem: string
  addItemFailed: string
  amount: string
  body: string
  cancel: string
  category: string
  close: string
  config: string
  content: string
  count: string
  dashboard: string
  deleteItemFailed: string
  description: string
  edit: string
  editItem: string
  end: string
  event: string
  exampleItem: string
  fetchItemFailed: string
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
  start: string
  status: string
  stockCount: string
  updateItemFailed: string
  uploadImage: {
    deleteFailed: string
    notAnImage: string
    uploadFailed: string
  }
  username: string
  website: string
  wholeDays: string
}
