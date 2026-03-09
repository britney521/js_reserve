// 关键字
const keywords = [
  'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default',
  'delete', 'do', 'else', 'enum', 'export', 'extends', 'finally', 'for',
  'function', 'if', 'import', 'in', 'instanceof', 'let', 'new', 'return',
  'super', 'switch', 'this', 'throw', 'try', 'typeof', 'var', 'void',
  'while', 'with', 'yield'
];

// 严格模式未来保留字
const future = ['implements', 'interface', 'package', 'private', 'protected', 'public', 'static'];

// 字面量值（虽然不是关键字，但同样不能声明）
const literals = ['null', 'undefined', 'true', 'false'];

// 合并成 Set，O(1) 查询
const reserved = new Set([...keywords, ...future, ...literals]);
function* safeShortName() {
  const A = 'abcdefghijklmnopqrstuvwxyz';
  let len = 1, idx = 0;
  while (true) {
    let s = '', n = idx;
    for (let i = 0; i < len; i++) {
      s = A[n % 26] + s;
      n = Math.floor(n / 26);
    }
    if (!reserved.has(s)) yield s;   // 只在非保留时产出
    idx++;
    if (idx === Math.pow(26, len)) { idx = 0; len++; }
  }
}
const gen = safeShortName();

traverse(ast, {
  Scopable(path) {
    const scope = path.scope;
    const rename = new Map();
    Object.keys(scope.bindings).forEach(old => {
      if (!rename.has(old) && !reserved.has(old)) {
        let next;
        do { next = gen.next().value; }
        while (reserved.has(next));   // 双重保险
        rename.set(old, next);
      }
    });
    rename.forEach((n, o) => scope.rename(o, n));
  }
});