
import { Scene, OrthographicCamera, ShaderMaterial, Mesh, PlaneGeometry, WebGLRenderTarget, REVISION } from "three";
import UPNG from 'upng-js';

var BuffertoPNG = function(buff, w, h){
    return UPNG.encode([buff.buffer], w, h, 0);
};

// Flip the buffer in y dimension
// Useful to get from WebGL to PNG image since convention or not the same.
var flipBufferY = function(buff, w, h){
    var data = new Uint8Array( w * h * 4 );
    for(var i=0; i<w; ++i){
        for(var j=0; j<h; ++j){
            var idx = (i+j*w)*4;
            var fidx = (i+(h-j-1)*w)*4;
            data[idx]   = buff[fidx];
            data[idx+1] = buff[fidx+1];
            data[idx+2] = buff[fidx+2];
            data[idx+3] = buff[fidx+3];
        }
    }
    return data;
}

var downloadImage = function(data, filename, ext){
    let a = document.createElement('a');
    if(window === undefined){
        throw "following download won't work, for some reason window is not defined.";
    }
    let blob = new Blob([data], { type: "application/octet-stream" });
    a.href = window.URL.createObjectURL(blob);
    a.download = filename + "." + ext;

    // simulate a click on the link
    if (document.createEvent) {
        let event = document.createEvent("MouseEvents");
        event.initEvent("click", true, true);
        a.dispatchEvent(event);
    } else {
        a.click();
    }
};


var DebugRenderTarget = {
    /**
     *  @param {WebGLRenderer} renderer The renderer used to render the renderTarget
     *  @param {WebGLRenderTarget} renderTarget The renderTarget to read.
     *  @param {string} filename The filename
     *  @param {boolean} alpha True if alpha must be stored, false otherwise. If false, resulting image alpha will be 255 for every pixel.
     */
    downloadAsImage: function(renderer, renderTarget, filename, alpha){
        let w = renderTarget.width;
        let h = renderTarget.height;
        let buffer = new Uint8Array( w * h * 4 );
        renderer.readRenderTargetPixels( renderTarget, 0, 0, w, h, buffer );
        if(!alpha){
            for(var i=3; i<buffer.length; i+=4){
                buffer[i] = 255;
            }
        }
        let data = BuffertoPNG(flipBufferY(buffer,w,h), w, h);

        downloadImage(data, filename, "png");
    },

    /**
     *  @param {WebGLRenderer} renderer The renderer used to render the renderTarget
     *  @param {Texture} texture The texture to read.
     *  @param {string} filename The filename
     *  @param {boolean} alpha True if alpha must be stored, false otherwise. If false, resulting image alpha will be 255 for every pixel.
     */
    downloadTextureAsImage: function ( renderer, texture, filename, alpha )
    {
        let ppScene = new Scene();
        let ppCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
        let ppMaterial = new ShaderMaterial({
            vertexShader: [
                "varying vec2 vUv;",
                "",
                "void main() {",
                "    vUv = uv;",
                "    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
                "}",
            ].join("\n"),
            fragmentShader: [
                "varying vec2 vUv;",
                "",
                "uniform sampler2D texture;",
                "",
                "void main() {",
                "    gl_FragColor = texture2D(texture, vUv).rgba;",
                "}",
            ].join('\n'),
            uniforms: {
                texture: { value: texture }
            }
        });
        ppScene.add(new Mesh(new PlaneGeometry(2, 2), ppMaterial));

        let renderTarget = new WebGLRenderTarget(texture.image.width, texture.image.height)
        if (parseInt(REVISION) > 101) {
            let previousRenderTarget = renderer.getRenderTarget()
            renderer.setRenderTarget(renderTarget)
            renderer.render(scene, camera)
            renderer.setRenderTarget(previousRenderTarget)
        } else
            renderer.render(ppScene, ppCamera, renderTarget)

        DebugRenderTarget.downloadAsImage(renderer, renderTarget, filename, alpha)
    }
};

export {DebugRenderTarget}



