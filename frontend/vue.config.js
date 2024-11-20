const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  pwa: {
    name: 'WWW', // 앱 이름
    themeColor: '#4DBA87', // 상단 바 색상
    msTileColor: '#000000', // Windows 타일 색상
    manifestOptions: {
      short_name: 'www', // 줄임 이름
      start_url: '.', // 시작 경로
      display: 'standalone', // 앱처럼 표시
      background_color: '#ffffff', // 시작 화면 배경색
    },
    iconPaths: {
      favicon32: 'img/icons/32www.jpg',
      favicon16: 'img/icons/16www.jpg',
      appleTouchIcon: 'img/icons/192.jpeg',
      maskIcon: 'img/icons/safari-pinned-tab.svg',
      msTileImage: 'img/icons/144www.jpg',
    },
  },
})
