module.exports = {
  css: {
    loaderOptions: {
      scss: {
        prependData: '@import "@/styles/setup/index.scss";',
      },
    },
  },
  devServer: {
    disableHostCheck: true,
  },
}
