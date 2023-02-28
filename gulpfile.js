// main module
import gulp from 'gulp';
// import paths
import { path } from './gulp/config/path.js';

// Import plugins
import { plugins } from './gulp/config/plugins.js';

// Передаємо значення у глобальну змінну
global.app = {
  isBuild: process.argv.includes('--build'),
  isDev: !process.argv.includes('--build'),
  path: path,
  gulp: gulp,
  plugins: plugins,
};

// import tasks
import { copy } from './gulp/tasks/copy.js';
import { reset } from './gulp/tasks/reset.js';
import { html } from './gulp/tasks/html.js';
import { server } from './gulp/tasks/server.js';
import { scss } from './gulp/tasks/scss.js';
import { js } from './gulp/tasks/js.js';
import { images } from './gulp/tasks/images.js';
import { otfToTtf, ttfToWoff, fontsStyle } from './gulp/tasks/fonts.js';

// спостерігач за змінами в файлах
function watcher() {
  gulp.watch(path.watch.files, copy);
  gulp.watch(path.watch.html, html);
  gulp.watch(path.watch.scss, scss);
  gulp.watch(path.watch.js, js);
  gulp.watch(path.watch.images, images);
}

// Послідовне опрацювання шрифтів
const fonts = gulp.series(otfToTtf, ttfToWoff, fontsStyle);

// Головні завдання
const mainTasks = gulp.series(fonts, gulp.parallel(copy, html, scss, js, images));

// будова сценарієв виконування задач
const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, server));
const build = gulp.series(reset, mainTasks);

// Експорт сценарію
export { dev };
export { build };

// виконування сценарію за замовчуванням
gulp.task('default', dev);
