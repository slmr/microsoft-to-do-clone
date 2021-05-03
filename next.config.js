module.exports = {
  future: {
    webpack5: true
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/tasks/inbox',
        permanent: true
      },
      {
        source: '/',
        destination: '/tasks',
        permanent: true
      }
    ]
  }
}
