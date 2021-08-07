/*
 * Generated by orval v5.5.3 🍺
 * Do not edit manually.
 * GoCommerce
 * OpenAPI spec version: 1.0
 */
import axios,{
  AxiosRequestConfig,
  AxiosResponse
} from 'axios'
export type CategoryAllOf = {
  name: string;
  description?: string;
  parent_id?: ShortID;
  order: number;
  readonly product_ids?: string[];
  image_url?: ImageUrl;
};

export type Category = Header & CategoryAllOf;

export interface CategoryList {
  categories: Category[];
}

export interface Header {
  readonly id?: string;
}

export type HeaderTimestampedAllOf = {
  readonly created_at?: string;
  readonly updated_at?: string;
};

export type HeaderTimestamped = Header & HeaderTimestampedAllOf;

export interface Image {
  readonly id: string;
  readonly ext: string;
  url: ImageUrl;
  order: number;
}

export type ImageUrl = string;

export interface ImageList {
  images: Image[];
}

export type ManufacturerAllOf = {
  name?: string;
  website_url?: string;
  image_url?: ImageUrl;
};

export type Manufacturer = Header & ManufacturerAllOf;

export interface ManufacturerList {
  manufacturers: Manufacturer[];
}

export type ProductAllOf = {
  name: string;
  description_short?: string;
  description_long?: string;
  price: number;
  category_ids?: string[];
  manufacturer_id?: string;
  status?: ProductStatus;
  stock_count?: number;
  readonly image_urls?: ImageUrl[];
};

export type Product = HeaderTimestamped & ProductAllOf;

export type ProductStatus = 'AVAILABLE' | 'ARCHIVED';


export const ProductStatus = {
  AVAILABLE: 'AVAILABLE' as ProductStatus,
  ARCHIVED: 'ARCHIVED' as ProductStatus,
};

export type ProductWithManufacturerAllOf = {
  manufacturer?: Manufacturer;
};

export type ProductWithManufacturer = Product & ProductWithManufacturerAllOf;

export interface ProductList {
  products: Product[];
}

export type ShortID = string;

export type PublicListCategoriesParams = { img_h?: number; img_r?: PublicListCategoriesImgR; img_w?: number };

export type PublicListCategoriesImgR = 'FILL' | 'FIT';


export const PublicListCategoriesImgR = {
  FILL: 'FILL' as PublicListCategoriesImgR,
  FIT: 'FIT' as PublicListCategoriesImgR,
};

export type PublicGetCategoryParams = { img_h?: number; img_r?: PublicGetCategoryImgR; img_w?: number };

export type PublicGetCategoryImgR = 'FILL' | 'FIT';


export const PublicGetCategoryImgR = {
  FILL: 'FILL' as PublicGetCategoryImgR,
  FIT: 'FIT' as PublicGetCategoryImgR,
};

export type AdminListCategoriesParams = { img_h?: number; img_r?: AdminListCategoriesImgR; img_w?: number };

export type AdminListCategoriesImgR = 'FILL' | 'FIT';


export const AdminListCategoriesImgR = {
  FILL: 'FILL' as AdminListCategoriesImgR,
  FIT: 'FIT' as AdminListCategoriesImgR,
};

export type AdminGetCategoryParams = { img_h?: number; img_r?: AdminGetCategoryImgR; img_w?: number };

export type AdminGetCategoryImgR = 'FILL' | 'FIT';


export const AdminGetCategoryImgR = {
  FILL: 'FILL' as AdminGetCategoryImgR,
  FIT: 'FIT' as AdminGetCategoryImgR,
};

export type AdminUpsertCategoryImageParams = { img_h?: number; img_r?: AdminUpsertCategoryImageImgR; img_w?: number };

export type AdminUpsertCategoryImageImgR = 'FILL' | 'FIT';


export const AdminUpsertCategoryImageImgR = {
  FILL: 'FILL' as AdminUpsertCategoryImageImgR,
  FIT: 'FIT' as AdminUpsertCategoryImageImgR,
};

export type AdminUpsertCategoryImageBody = {
  file?: Blob;
};

export type PublicListManufacturersParams = { img_h?: number; img_r?: PublicListManufacturersImgR; img_w?: number };

export type PublicListManufacturersImgR = 'FILL' | 'FIT';


export const PublicListManufacturersImgR = {
  FILL: 'FILL' as PublicListManufacturersImgR,
  FIT: 'FIT' as PublicListManufacturersImgR,
};

export type PublicGetManufacturerParams = { img_h?: number; img_r?: PublicGetManufacturerImgR; img_w?: number };

export type PublicGetManufacturerImgR = 'FILL' | 'FIT';


export const PublicGetManufacturerImgR = {
  FILL: 'FILL' as PublicGetManufacturerImgR,
  FIT: 'FIT' as PublicGetManufacturerImgR,
};

export type AdminListManufacturersParams = { img_h?: number; img_r?: AdminListManufacturersImgR; img_w?: number };

export type AdminListManufacturersImgR = 'FILL' | 'FIT';


export const AdminListManufacturersImgR = {
  FILL: 'FILL' as AdminListManufacturersImgR,
  FIT: 'FIT' as AdminListManufacturersImgR,
};

export type AdminGetManufacturerParams = { img_h?: number; img_r?: AdminGetManufacturerImgR; img_w?: number };

export type AdminGetManufacturerImgR = 'FILL' | 'FIT';


export const AdminGetManufacturerImgR = {
  FILL: 'FILL' as AdminGetManufacturerImgR,
  FIT: 'FIT' as AdminGetManufacturerImgR,
};

export type AdminUpsertManufacturerImageParams = { img_h?: number; img_r?: AdminUpsertManufacturerImageImgR; img_w?: number };

export type AdminUpsertManufacturerImageImgR = 'FILL' | 'FIT';


export const AdminUpsertManufacturerImageImgR = {
  FILL: 'FILL' as AdminUpsertManufacturerImageImgR,
  FIT: 'FIT' as AdminUpsertManufacturerImageImgR,
};

export type AdminUpsertManufacturerImageBody = {
  file?: Blob;
};

export type PublicListProductsParams = { img_h?: number; img_r?: PublicListProductsImgR; img_w?: number };

export type PublicListProductsImgR = 'FILL' | 'FIT';


export const PublicListProductsImgR = {
  FILL: 'FILL' as PublicListProductsImgR,
  FIT: 'FIT' as PublicListProductsImgR,
};

export type PublicGetProductParams = { img_h?: number; img_r?: PublicGetProductImgR; img_w?: number };

export type PublicGetProductImgR = 'FILL' | 'FIT';


export const PublicGetProductImgR = {
  FILL: 'FILL' as PublicGetProductImgR,
  FIT: 'FIT' as PublicGetProductImgR,
};

export type AdminListProductsParams = { img_h?: number; img_r?: AdminListProductsImgR; img_w?: number };

export type AdminListProductsImgR = 'FILL' | 'FIT';


export const AdminListProductsImgR = {
  FILL: 'FILL' as AdminListProductsImgR,
  FIT: 'FIT' as AdminListProductsImgR,
};

export type AdminGetProductParams = { img_h?: number; img_r?: AdminGetProductImgR; img_w?: number };

export type AdminGetProductImgR = 'FILL' | 'FIT';


export const AdminGetProductImgR = {
  FILL: 'FILL' as AdminGetProductImgR,
  FIT: 'FIT' as AdminGetProductImgR,
};

export type AdminListProductImagesParams = { img_h?: number; img_r?: AdminListProductImagesImgR; img_w?: number };

export type AdminListProductImagesImgR = 'FILL' | 'FIT';


export const AdminListProductImagesImgR = {
  FILL: 'FILL' as AdminListProductImagesImgR,
  FIT: 'FIT' as AdminListProductImagesImgR,
};

export type AdminAddProductImagesParams = { img_h?: number; img_r?: AdminAddProductImagesImgR; img_w?: number };

export type AdminAddProductImagesImgR = 'FILL' | 'FIT';


export const AdminAddProductImagesImgR = {
  FILL: 'FILL' as AdminAddProductImagesImgR,
  FIT: 'FIT' as AdminAddProductImagesImgR,
};

export type AdminAddProductImagesBody = {
  file?: Blob[];
};




  export const getGoCommerce = () => {
const publicListCategories = <TData = AxiosResponse<CategoryList>>(
    params?: PublicListCategoriesParams, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.get(
      `/public/categories`,
      {
        params,
    ...options },
    );
  }
const publicGetCategory = <TData = AxiosResponse<Category>>(
    id: ShortID,
    params?: PublicGetCategoryParams, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.get(
      `/public/categories/${id}`,
      {
        params,
    ...options },
    );
  }
const adminListCategories = <TData = AxiosResponse<CategoryList>>(
    params?: AdminListCategoriesParams, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.get(
      `/admin/categories`,
      {
        params,
    ...options },
    );
  }
const adminAddCategory = <TData = AxiosResponse<Category>>(
    category: Category, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.post(
      `/admin/categories`,
      category,options
    );
  }
const adminGetCategory = <TData = AxiosResponse<Category>>(
    id: ShortID,
    params?: AdminGetCategoryParams, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.get(
      `/admin/categories/${id}`,
      {
        params,
    ...options },
    );
  }
const adminUpdateCategory = <TData = AxiosResponse<Category>>(
    id: ShortID,
    category: Category, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.put(
      `/admin/categories/${id}`,
      category,options
    );
  }
const adminDeleteCategory = <TData = AxiosResponse<unknown>>(
    id: ShortID, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.delete(
      `/admin/categories/${id}`,options
    );
  }
const adminUpsertCategoryImage = <TData = AxiosResponse<Image>>(
    id: ShortID,
    adminUpsertCategoryImageBody: AdminUpsertCategoryImageBody,
    params?: AdminUpsertCategoryImageParams, options?: AxiosRequestConfig
 ): Promise<TData> => {const formData = new FormData();
if(adminUpsertCategoryImageBody.file) {
 formData.append('file', adminUpsertCategoryImageBody.file)
 }

    return axios.put(
      `/admin/categories/${id}/image`,
      formData,
      {
        params,
    ...options },
    );
  }
const adminDeleteCategoryImage = <TData = AxiosResponse<unknown>>(
    id: ShortID, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.delete(
      `/admin/categories/${id}/image`,options
    );
  }
const publicListManufacturers = <TData = AxiosResponse<ManufacturerList>>(
    params?: PublicListManufacturersParams, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.get(
      `/public/manufacturers`,
      {
        params,
    ...options },
    );
  }
const publicGetManufacturer = <TData = AxiosResponse<Manufacturer>>(
    id: ShortID,
    params?: PublicGetManufacturerParams, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.get(
      `/public/manufacturers/${id}`,
      {
        params,
    ...options },
    );
  }
const adminListManufacturers = <TData = AxiosResponse<ManufacturerList>>(
    params?: AdminListManufacturersParams, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.get(
      `/admin/manufacturers`,
      {
        params,
    ...options },
    );
  }
const adminAddManufacturer = <TData = AxiosResponse<Manufacturer>>(
    manufacturer: Manufacturer, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.post(
      `/admin/manufacturers`,
      manufacturer,options
    );
  }
const adminGetManufacturer = <TData = AxiosResponse<Manufacturer>>(
    id: ShortID,
    params?: AdminGetManufacturerParams, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.get(
      `/admin/manufacturers/${id}`,
      {
        params,
    ...options },
    );
  }
const adminUpdateManufacturer = <TData = AxiosResponse<Manufacturer>>(
    id: ShortID,
    manufacturer: Manufacturer, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.put(
      `/admin/manufacturers/${id}`,
      manufacturer,options
    );
  }
const adminDeleteManufacturer = <TData = AxiosResponse<unknown>>(
    id: ShortID, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.delete(
      `/admin/manufacturers/${id}`,options
    );
  }
const adminUpsertManufacturerImage = <TData = AxiosResponse<Image>>(
    id: ShortID,
    adminUpsertManufacturerImageBody: AdminUpsertManufacturerImageBody,
    params?: AdminUpsertManufacturerImageParams, options?: AxiosRequestConfig
 ): Promise<TData> => {const formData = new FormData();
if(adminUpsertManufacturerImageBody.file) {
 formData.append('file', adminUpsertManufacturerImageBody.file)
 }

    return axios.put(
      `/admin/manufacturers/${id}/image`,
      formData,
      {
        params,
    ...options },
    );
  }
const adminDeleteManufacturerImage = <TData = AxiosResponse<unknown>>(
    id: ShortID, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.delete(
      `/admin/manufacturers/${id}/image`,options
    );
  }
const publicListProducts = <TData = AxiosResponse<ProductList>>(
    params?: PublicListProductsParams, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.get(
      `/public/products`,
      {
        params,
    ...options },
    );
  }
const publicGetProduct = <TData = AxiosResponse<ProductWithManufacturer>>(
    id: ShortID,
    params?: PublicGetProductParams, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.get(
      `/public/products/${id}`,
      {
        params,
    ...options },
    );
  }
const adminListProducts = <TData = AxiosResponse<ProductList>>(
    params?: AdminListProductsParams, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.get(
      `/admin/products`,
      {
        params,
    ...options },
    );
  }
const adminAddProduct = <TData = AxiosResponse<Product>>(
    product: Product, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.post(
      `/admin/products`,
      product,options
    );
  }
const adminGetProduct = <TData = AxiosResponse<ProductWithManufacturer>>(
    id: ShortID,
    params?: AdminGetProductParams, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.get(
      `/admin/products/${id}`,
      {
        params,
    ...options },
    );
  }
const adminUpdateProduct = <TData = AxiosResponse<Product>>(
    id: ShortID,
    product: Product, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.put(
      `/admin/products/${id}`,
      product,options
    );
  }
const adminDeleteProduct = <TData = AxiosResponse<unknown>>(
    id: ShortID, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.delete(
      `/admin/products/${id}`,options
    );
  }
const adminListProductImages = <TData = AxiosResponse<ImageList>>(
    id: ShortID,
    params?: AdminListProductImagesParams, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.get(
      `/admin/products/${id}/images`,
      {
        params,
    ...options },
    );
  }
const adminAddProductImages = <TData = AxiosResponse<ImageList>>(
    id: ShortID,
    adminAddProductImagesBody: AdminAddProductImagesBody,
    params?: AdminAddProductImagesParams, options?: AxiosRequestConfig
 ): Promise<TData> => {const formData = new FormData();
formData.append('data', adminAddProductImagesBody)

    return axios.post(
      `/admin/products/${id}/images`,
      formData,
      {
        params,
    ...options },
    );
  }
const adminUpdateProductImage = <TData = AxiosResponse<ImageList>>(
    id: ShortID,
    imageid: ShortID,
    image: Image, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.put(
      `/admin/products/${id}/images/${imageid}`,
      image,options
    );
  }
const adminDeleteProductImage = <TData = AxiosResponse<unknown>>(
    id: ShortID,
    imageid: ShortID, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.delete(
      `/admin/products/${id}/images/${imageid}`,options
    );
  }
return {publicListCategories,publicGetCategory,adminListCategories,adminAddCategory,adminGetCategory,adminUpdateCategory,adminDeleteCategory,adminUpsertCategoryImage,adminDeleteCategoryImage,publicListManufacturers,publicGetManufacturer,adminListManufacturers,adminAddManufacturer,adminGetManufacturer,adminUpdateManufacturer,adminDeleteManufacturer,adminUpsertManufacturerImage,adminDeleteManufacturerImage,publicListProducts,publicGetProduct,adminListProducts,adminAddProduct,adminGetProduct,adminUpdateProduct,adminDeleteProduct,adminListProductImages,adminAddProductImages,adminUpdateProductImage,adminDeleteProductImage}};
