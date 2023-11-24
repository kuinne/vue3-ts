function valid(str, alias) {
  try {
    let transformedStr = str;
    alias.forEach((alias) => {
      transformedStr = transformedStr.replaceAll(alias, 1);
    });

    console.log("transformedStr", transformedStr);

    const f = new Function(`return ${transformedStr}`);
    const res = f();
    return !isNaN(res);
  } catch (error) {
    return false;
  }
}

valid("1+a", ["a"]);
valid("1+(a+1", ["a"]);
valid("1++a", ["a"]);
valid("a/0.131331+b", ["a", "b"]);
valid("AD*EF/(1-n-u)*0.001*GWP", ["AD", "EF", "n", "u", "GWP"]);

// 模块文件 module.js
export function myFunction() {
  // 在模块内部定义变量a

  "use strict";

  // 在模块内部创建函数
  let innerFunction = new Function("return AD*EF/(1-n-u)*0.001*GWP");

  // 调用函数
  console.log(innerFunction());
}
