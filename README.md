# three-js-debug-rendertarget
Some tools to debug WebGLRenderTarget and Texture, and especially download their content as images. 

```javascript
var renderer = <a THREE.WebGLRenderer>;
var rtt = <a THREE.WEBGLRenderTarget>;
var texture = <a THREE.Texture>;

// Launch a browser download of a png file containing current data in rtt.
// The renderer must be the one used to render in rtt.
THREE.DebugRenderTarget.downloadAsImage(renderer, rtt, "filename", alpha);

// Launch a browser download of a png file of the provided texture.
THREE.DebugRenderTarget.downloadTextureAsImage(renderer, texture, "filename", alpha);
```
