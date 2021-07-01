import cloneDeep from 'lodash.clonedeep';
import Vue from 'vue';

export const state = () => ({
  products: [],
});

export const getters = {
  productsList(state) {
    return Object.values(state.products);
  },
};

export const mutations = {
  SET_PRODUCTS(state, products) {
    state.products = products;
  },

  ADD_PRODUCT(state, product) {
    Vue.set(state.products, product.id, cloneDeep(product));
  },

  UPDATE_PRODUCT(state, product) {
    Vue.set(state.products, product.id, cloneDeep(product));
  },

  DELETE_PRODUCT(state, product_id) {
    Vue.delete(state.products, product_id);
  },
};

export const actions = {
  async list(context) {
    console.debug('Store products/list', 'Dispatched');
    this.$axios
      .get(`/products`)
      .then(({ data }) => {
        const products = data.reduce((result, item) => {
          result[item.id] = item;
          return result;
        }, {});
        context.commit('SET_PRODUCTS', products);
      })
      .catch((e) => {
        const msg = `Producten ophalen mislukt: ${e.message}`;
        context.commit(
          'general/SET_ALERT',
          { type: 'error', message: msg },
          { root: true }
        );
      });
  },

  async add(context, product) {
    console.debug('Store products/add', 'Dispatched', product);
    if (product.manufacturer_id === '') {
      delete product.manufacturer_id;
    }
    this.$axios
      .post(`/products`, product)
      .then(({ data }) => {
        context.commit('ADD_PRODUCT', data);
      })
      .catch((e) => {
        const msg = `Product toevoegen mislukt: ${e.message}`;
        context.commit(
          'general/SET_ALERT',
          { type: 'error', message: msg },
          { root: true }
        );
      });
  },

  async update(context, product) {
    console.debug('Store products/update', 'Dispatched', product);
    if (product.manufacturer_id === '') {
      delete product.manufacturer_id;
    }
    this.$axios
      .put(`/products/${product.id}`, product)
      .then(({ data }) => {
        context.commit('UPDATE_PRODUCT', data);
      })
      .catch((e) => {
        const msg = `Product bijwerken mislukt: ${e.message}`;
        context.commit(
          'general/SET_ALERT',
          { type: 'error', message: msg },
          { root: true }
        );
      });
  },

  async delete(context, product_id) {
    console.debug('Store products/delete', 'Dispatched', product_id);
    this.$axios
      .delete(`/products/${product_id}`)
      .then(({ data }) => {
        context.commit('DELETE_PRODUCT', product_id);
      })
      .catch((e) => {
        const msg = `Product verwijderen mislukt: ${e.message}`;
        context.commit(
          'general/SET_ALERT',
          { type: 'error', message: msg },
          { root: true }
        );
      });
  },
};
