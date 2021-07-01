export const actions = {
  async upload(context, image) {
    console.debug('Store images/upload', 'Dispatched');

    // Check if valid image
    if (!image.file.type.includes('image/')) {
      context.commit(
        'general/SET_ALERT',
        {
          type: 'error',
          message: 'Gekozen bestand is geen foto',
        },
        { root: true }
      );
      return;
    }

    // Build form data
    let formData = new FormData();
    formData.append('image', image.file);

    this.$axios
      .put(`/images/${image.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(({ data }) => {
        return data;
      })
      .catch((e) => {
        const msg = `Foto uploaden mislukt: ${e.response.data}`;
        context.commit(
          'general/SET_ALERT',
          { type: 'error', message: msg },
          { root: true }
        );
      });
  },
};
