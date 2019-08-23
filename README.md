# three-js-debug-rendertarget
Some tools to debug WebGLRenderTarget, and especially download their content as images. 

```javascript
var renderer = <a THREE.WebGLRenderer>;
var rtt = <a THREE.WEBGLRenderTarget>;

// Launch a browser download of a png file containing current data in rtt.
// The renderer must be the one used to render in rtt.
THREE.DebugRenderTarget(renderer, rtt, "filename");
```
