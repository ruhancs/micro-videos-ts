export default {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ...require('../../jest.config').default,
  rootDir: './',
  testRegex: '.*\\.spec\\.ts$',
  maxWorkers: 1, //executa os testes de forma sequencial --runInBand
  moduleNameMapper: {
    '@rc/micro\\-videos/(.*)$':
      '<rootDir>/../../../node_modules/@rc/micro-videos/dist/$1',
    //"#seedwork/domain": "<rootDir>/../../../node_modules/@rc/micro-videos/dist/@seedwork/domain/index.js",
    '#seedwork/(.*)$':
      '<rootDir>/../../../node_modules/@rc/micro-videos/dist/@seedwork/$1',
    //"#catgeory/domain": "<rootDir>/../../../node_modules/@rc/micro-videos/dist/category/domain/index.js",
    '#category/(.*)$':
      '<rootDir>/../../../node_modules/@rc/micro-videos/dist/category/$1',
  },
};
