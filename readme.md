# cUrl使用说明

## 常规使用
1. `npm i ctrl-url --save`
2. 该模块提供了4个方法供调用，各个方法传入必要参数就可以运行，目的是简化基本的url参数读写

## 方法说明

### get
```javascript
/**
 * 获取 url 对象
 * @param {String || null} str  传入 String,则获取的是 str的对象， 不传str, 获取的是当前url的对象
 * @return {Object} 
 * return {
 *     search: { key1: value1, key2: value2 },
 *     hash: { key1: value1 } || '/home/user',
 *     query: { key1: value1 }
 * }
 */
cUrl.get();
cUrl.get('http://127.0.0.1:7777?a=1#b=2&c=3?d=4');
```

### set
```javascript
/**
 * 设置新url    str 为字符串时 改变的是str ,str是对象时改变的是当前 url
 * 对象格式： value 为空则删除当前 key 
 * paramObj = {
 *     search: { key1: value1, key2: value2 },
 *     hash: { key1: value1 } || '/home/user',
 *     query: { key1: value1 }
 * }
 * typeObj 格式： {type: 'replace', reload: false}
 * @param {String || Object} str 
 * @param {Object || null} paramObj 
 * @return {String}
 */
cUrl.set(paramObj);
cUrl.set('http://127.0.0.1:7777?a=1#b=2&c=3?d=4', paramObj);
cUrl.set('http://127.0.0.1:7777?a=1#b=2&c=3?d=4', paramObj, {type: 'replace'});
```
第三个参数的说明：  
如果存在第三个参数，则页面会自动跳转，不需要在业务里写 `window.locaiton xxx `。
1. `typeObj`对象 `type`属性的说明:
	- 值为 `replace` 或者 `push`;
	- 为 `replace` 就是 替换 url 记录的意思；
	- 为 `push` 就是 添加 url 记录的意思  

2. `typeObj`对象 `reload`属性的说明：
   -  为 `true` 将会使用 `window.location` 的形式跳转，原本如果是添加参数，则js脚本会重新执行一边；  
   -  为 `false` 将会使用 `window.history` 的形式改变url, 脚本不会重新执行，只是改变url;
   - `history` 形式做了兼容处理， 如果不兼容则使用 `location` 的形式， 调用者不需要关心这里。

### get_url_params
```javascript
/**
 * 提供获取参数的轻便方法
 * 获取当前url 的 name 的参数
 * @param {String} name 
 */
cUrl.get_url_params('key')
```

### set_url_params
```javascript
/**
 * 提供设置参数的轻便方法
 * 设置当前url 为新 url
 * obj 格式 ： { key1: value1, key2:value2 }  当value为''||false 时 删除当前key 
 * typeObj 格式： {type: 'replace', reload: false}
 * @param {Object} obj
 * @param {String} typeObj  replace push 
 */
cUrl.set_url_params(obj, typeObj)
cUrl.set_url_params(obj, {type: 'replace', reload: true})
```

