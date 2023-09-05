const { library, dom, icon: getIcon, icon } = require('@fortawesome/fontawesome-svg-core');

function tryInstall(block) {
  try {
    var icons = block();
    library.add(...Object.values(icons));
    return true;
  } catch (ex) {
    console.warn('install icon fail:', ex);
    return false;
  }
}

tryInstall(function () { return require('@fortawesome/free-solid-svg-icons').fas; });
tryInstall(function () { return require('@fortawesome/free-regular-svg-icons').far; });
tryInstall(function () { return require('@fortawesome/free-brands-svg-icons').fab; });

function faCss() {
  return dom.css();
}

function faInline(iconName, opts) {
  var options = opts || { prefix: 'fas' };
  var prefix = options.prefix;

  var icon = getIcon({ prefix: prefix, iconName: iconName });
  if (!icon) {
    console.warn('Can not find icon "' + iconName + '" with prefix "' + prefix + '"');
    console.log(icon);
    return '';
    throw new Error(
      'Can not find icon "' + iconName + '" with prefix "' + prefix + '"' +
      'Make sure you have installed also a corresponding icons package:\n' +
      ' - @fortawesome/free-solid-svg-icons for fas prefix \n' +
      ' - @fortawesome/free-regular-svg-icons for far prefix\n' +
      ' - @fortawesome/free-brands-svg-icons for fab prefix\n'
    );
  }
  return icon.html;
}

hexo.extend.helper.register('fa_css', faCss);
hexo.extend.helper.register('fa_inline', faInline);

hexo.extend.tag.register('fa_css', function () {
  return '<style>' + faCss() + '</style>';
});

hexo.extend.tag.register('fa_inline', function (args) {
  var iconName = args[0];
  var prefix = args[1] || 'fas';
  return faInline(iconName, { prefix: prefix });
});