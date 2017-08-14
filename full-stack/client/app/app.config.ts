export const GlobalConfig = {
  host: window.location.host,
  fallBackUserImage: '/assets/images/userNotFound.jpg',
  getBaseUrl: function(): string {
    return '//' + this.host;
  },
  httpCallsTimeout: {
    get: 30000,
    default: 60000
  }
};
