/**
 * 
 * Compiler(编译时)和 Compilation(编译运行时)
在插件开发中最重要的两个资源就是 compiler 和 compilation 对象。理解它们的角色是扩展 webpack 引擎重要的第一步。

compiler 对象代表了完整的 webpack 环境配置。这个对象在启动 webpack 时被一次性建立，并配置好所有可操作的设置，包括 options，loader 和 plugin。当在 webpack 环境中应用一个插件时，插件将收到此 compiler 对象的引用。可以使用它来访问 webpack 的主环境。

compilation 对象代表了一次资源版本构建。当运行 webpack 开发环境中间件时，每当检测到一个文件变化，就会创建一个新的 compilation，从而生成一组新的编译资源。一个 compilation 对象表现了当前的模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息。compilation 对象也提供了很多关键时机的回调，以供插件做自定义处理时选择使用。

这两个组件是任何 webpack 插件不可或缺的部分（特别是 compilation），因此，开发者在阅读源码，并熟悉它们之后，会感到获益匪浅：

Compiler Source
Compilation Source
基本插件架构

插件的不同类型
webpack 插件可以按照它所注册的事件分成不同的类型。每一个事件钩子决定了它该如何应用插件的注册。

同步(synchronous) Tapable 实例应用插件时会使用：
applyPlugins(name: string, args: any...)

applyPluginsBailResult(name: string, args: any...)

这意味着每个插件回调，都会被特定的 args 一个接一个地调用。 这是插件的最基本形式。许多有用的事件（例如 "compile", "this-compilation"），预期插件会同步执行。

瀑布流(waterfall) 插件应用时会使用：
applyPluginsWaterfall(name: string, init: any, args: any...)

这种类型，每个插件都在其他插件依次调用之后调用，前一个插件调用的返回值，作为参数传入后一个插件。这类插件必须考虑其执行顺序。 必须等前一个插件执行后，才能接收参数。第一个插件的值是初始值(init)。这个模式用在与 webpack 模板相关的 Tapable 实例中（例如 ModuleTemplate, ChunkTemplate 等）。

异步(asynchronous) When all the plugins are applied asynchronously using
applyPluginsAsync(name: string, args: any..., callback: (err?: Error) -> void)

这种类型，插件处理函数在调用时，会传入所有的参数和一个签名为 (err?: Error) -> void 的回调函数。处理函数按注册时的顺序调用。在调用完所有处理程序后，才会调用 callback。 这也是 "emit", "run" 等事件的常用模式。

异步瀑布流(async waterfall) 插件将以瀑布方式异步应用。
applyPluginsAsyncWaterfall(name: string, init: any, callback: (err: Error, result: any) -> void)

这种类型，插件处理函数在调用时，会传入当前值(current value)和一个带有签名为 (err: Error, nextValue: any) -> void. 的回调函数。当调用的 nextValue 是下一个处理函数的当前值(current value)时，第一个处理程序的当前值是 init。在调用完所有处理函数之后，才会调用 callback，并将最后一个值传入。如果其中任何一个处理函数传入一个 err 值，则会调用此 callback 并将此 error 对象传入，并且不再调用其他处理函数。 这种插件模式适用于像 "before-resolve" 和 "after-resolve" 这样的事件。

异步串联(async series) 它与异步(asynchronous)相同，但如果任何插件注册失败，则不再调用其他插件。
applyPluginsAsyncSeries(name: string, args: any..., callback: (err: Error, result: any) -> void)

-并行(parallel) -

applyPluginsParallel(name: string, args: any..., callback: (err?: Error) -> void)

applyPluginsParallelBailResult(name: string, args: any..., callback: (err: Error, result: any) -> void)
*/

const path=require('path');
function MyHtml() {

}

// 在插件函数的 prototype 上定义一个 `apply` 方法。
MyHtml.prototype.apply = function(compiler) {
  // 指定一个挂载到 webpack 自身的事件钩子。
  compiler.plugin('MyHtml', function(compilation /* 处理 webpack 内部实例的特定数据。*/, callback) {
    console.log("This is an example plugin!!!");
    compilation.afterOptimizeModuleIds.tap('custhtml',function(modules){
            console.log('44444');
    });
    compilation.assetPath.tap('createHtml',(filename,data)=>{
        console.log('333');

    })
    console.log('2222222222');
    // 功能完成后调用 webpack 提供的回调。
    callback();
  });


  function createCompilerTemplate(compilation,context)
  {
     let outputOptions={
            filename:'pppp.html',
            publicPath: compilation.outputOptions.publicPath
      };
    const childCompiler = compilation.createChildCompiler('myhmtl for filename', outputOptions);
    childCompiler.context = context;

    return new Promise((resolve,reject)=>{
        childCompiler.runAsChild((err, entries, childCompilation) => {

            if (childCompilation && childCompilation.errors && childCompilation.errors.length) {
                const errorDetails = childCompilation.errors.map(error => error.message + (error.error ? ':\n' + error.error : '')).join('\n');
                reject(new Error('Child compilation failed:\n' + errorDetails));
              } else if (err) {
                reject(err);
              } else {

              }
        })
    })
  }
  function beforeRun()
  {

  }
  function make(compilation, callback)
  {
    let entry=compilation.compiler.options.entry;
    console.log('make');
    let keys=[];
    if(typeof entry=='object')
    {
         keys=Object.keys(entry);
    }else{
         keys=[path.basename(entry)]
    }
    for (var index = 0; index < keys.length; index++) {
        var element = keys[index];
        
    }
    callback();
  }
  function emitAsset(compilation,callback)
  {
    // console.log('moduleAsset');
    // var templte=createCompilerTemplate(compilation,compiler.context);
    // templte.catch(()=>{
    //     return {};
    // }).then(()=>{
    //     callback();
    // });
  }
  function compilation(compilation, params)
  {

    if(compilation.modules.length>0)
    {
    console.log('compilation');
    }
  }
  // 4.0 以上
  if(compiler.hooks)
  {

  }
  // 3.0插件处理
  else{
 //"make", "compile", "emit", "after-emit", "invalid", "done", "this-compilation",compilation
    compiler.plugin('compilation',compilation);
    compiler.plugin('make',make);
    compiler.plugin('emit',emitAsset);
  }

//    compiler.hooks.compilation.tap('myhtml',compilation=>{
//          console.log('1111111');
//          //compilation
//     });
 
};
module.exports=MyHtml