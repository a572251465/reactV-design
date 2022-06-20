const { src, dest, parallel, series } = require('gulp')
const path = require('path')
const less = require('gulp-less')
const babel = require('gulp-babel')
const ts = require('gulp-typescript')
const fs = require('fs-extra')

const resolvePath = (...args) => path.resolve(__dirname, ...args)
const getBabelConfig = require('./scripts/getBabelConfig')
const esmTsProject = ts.createProject('tsconfig.json')
const cjsTsProject = ts.createProject('tsconfig.json')

/**
 * @author lihh
 * @description 将ts编译成为cjs
 */
async function compileToCJS() {
  return src('src/**/*.ts')
    .pipe(cjsTsProject())
    .js.pipe(babel(getBabelConfig(false)))
    .pipe(dest('cjs'))
}

/**
 * @author lihh
 * @description 将ts编译为module es
 */
async function compileToESM() {
  return src('src/**/*.ts')
    .pipe(esmTsProject())
    .js.pipe(babel(getBabelConfig(true)))
    .pipe(dest('esm'))
}

/**
 * @author lihh
 * @description 清空资源
 */
async function cleanAssets() {
  fs.removeSync(resolvePath('./esm'))
  fs.removeSync(resolvePath('./esm'))
}

/**
 * @author lihh
 * @description 赋值资源
 * @returns
 */
async function copyAssets() {
  return src(['src/**/*.less', 'src/**/*.js'])
    .pipe(dest('esm'))
    .pipe(dest('cjs'))
}

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

exports.default = series(
  cleanAssets,
  parallel(copyAssets, compileLessToCss, compileToCJS, compileToESM)
)
