const path = require('path');
console.log(path.sep); // 返回当前操作系统下的路径分隔符 win: \ mac&linux: /
console.log(path.posix.sep); //返回linux中的分隔符，永远都是 /，不随平台变化
console.log(path.win32.sep);// 返回 windows 中的分隔符