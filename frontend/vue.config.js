

const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  pwa: {
    name: 'WWW',
    themeColor: '#4DBA87',
    msTileColor: '#000000',
    manifestOptions: {
      short_name: 'www',
      start_url: '.',
      display: 'standalone',
      background_color: '#ffffff',
    },
    iconPaths: {
      favicon32: 'img/icons/32www.jpg',
      favicon16: 'img/icons/16www.jpg',
      appleTouchIcon: 'img/icons/192.jpeg',
      maskIcon: 'img/icons/safari-pinned-tab.svg',
      msTileImage: 'img/icons/144www.jpg',
    },
  },
  devServer: {
    proxy: {
      // 기상청 API 프록시
      '/api/weather': {
        target: 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0',
        changeOrigin: true,
        pathRewrite: { '^/api/weather': '' },
        secure: false,
        timeout: 10000,
      },
      // Spring Boot API 프록시
      '/api': {
        target: 'http://localhost:8081', // Spring Boot 서버 주소
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
        secure: false,
      },
    },
  },
});

