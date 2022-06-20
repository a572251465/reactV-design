const less = require('gulp-less')
const { src, dest, parallel } = require('gulp')
const path = require('path')

const resolvePath = (...args) => path.resolve(__dirname, ...args)

/**
 * @author lihh
 * @description less 编译css
 * @returns {Promise<*>}
 */
async function compileLessToCss() {
  return src(resolvePath('src/*.less'))
    .pipe(less({ javascriptEnabled: true }))
    .pipe(dest(resolvePath('esm')))
    .pipe(dest(resolvePath('cjs')))
}

exports.default = parallel(compileLessToCss)
