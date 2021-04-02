import { mat4 } from "gl-matrix";
import { useEffect } from "react";

function MyWebGL() {




    function initBuffers(gl: { createBuffer: () => any; bindBuffer: (arg0: any, arg1: any) => void; ARRAY_BUFFER: any; bufferData: (arg0: any, arg1: Float32Array, arg2: any) => void; STATIC_DRAW: any; }) {
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        var vertices = [
            1.0, 1.0, 0.0,
            -1.0, 1.0, 0.0,
            1.0, -1.0, 0.0,
            -1.0, -1.0, 0.0
        ];

        gl.bufferData(gl.ARRAY_BUFFER,
            new Float32Array(vertices),
            gl.STATIC_DRAW);

        return {
            position: positionBuffer,
        };
    }


    function loadShader(gl: { VERTEX_SHADER?: any; FRAGMENT_SHADER?: any; createProgram?: () => any; attachShader?: (arg0: any, arg1: any) => void; linkProgram?: (arg0: any) => void; getProgramParameter?: (arg0: any, arg1: any) => any; LINK_STATUS?: any; getProgramInfoLog?: (arg0: any) => string; createShader?: any; shaderSource?: any; compileShader?: any; getShaderParameter?: any; COMPILE_STATUS?: any; getShaderInfoLog?: any; deleteShader?: any; }, type: any, source: any) {
        const shader = gl.createShader(type);

        // Send the source to the shader object

        gl.shaderSource(shader, source);

        // Compile the shader program

        gl.compileShader(shader);

        // See if it compiled successfully

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    function initShaderProgram(gl: { VERTEX_SHADER: any; FRAGMENT_SHADER: any; createProgram: () => any; attachShader: (arg0: any, arg1: any) => void; linkProgram: (arg0: any) => void; getProgramParameter: (arg0: any, arg1: any) => any; LINK_STATUS: any; getProgramInfoLog: (arg0: any) => string; }, vsSource: any, fsSource: any) {
        const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
        const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

        // 创建着色器程序

        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        // 创建失败， alert
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
            return null;
        }

        return shaderProgram;
    }


    function drawScene(gl: { clearColor: (arg0: number, arg1: number, arg2: number, arg3: number) => void; clearDepth: (arg0: number) => void; enable: (arg0: any) => void; DEPTH_TEST: any; depthFunc: (arg0: any) => void; LEQUAL: any; clear: (arg0: number) => void; COLOR_BUFFER_BIT: number; DEPTH_BUFFER_BIT: number; canvas: { clientWidth: number; clientHeight: number; }; FLOAT: any; bindBuffer: (arg0: any, arg1: any) => void; ARRAY_BUFFER: any; vertexAttribPointer: (arg0: any, arg1: number, arg2: any, arg3: boolean, arg4: number, arg5: number) => void; enableVertexAttribArray: (arg0: any) => void; useProgram: (arg0: any) => void; uniformMatrix4fv: (arg0: any, arg1: boolean, arg2: any) => void; drawArrays: (arg0: any, arg1: number, arg2: number) => void; TRIANGLE_STRIP: any; }, programInfo: { attribLocations: { vertexPosition: any; }; program: any; uniformLocations: { projectionMatrix: any; modelViewMatrix: any; }; }, buffers: { position: any; }) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
        gl.clearDepth(1.0);                 // Clear everything
        gl.enable(gl.DEPTH_TEST);           // Enable depth testing
        gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

        // Clear the canvas before we start drawing on it.

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Create a perspective matrix, a special matrix that is
        // used to simulate the distortion of perspective in a camera.
        // Our field of view is 45 degrees, with a width/height
        // ratio that matches the display size of the canvas
        // and we only want to see objects between 0.1 units
        // and 100 units away from the camera.

        const fieldOfView = 45 * Math.PI / 180;   // in radians
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 100.0;
        const projectionMatrix = mat4.create();

        // note: glmatrix.js always has the first argument
        // as the destination to receive the result.
        mat4.perspective(projectionMatrix,
            fieldOfView,
            aspect,
            zNear,
            zFar);

        // Set the drawing position to the "identity" point, which is
        // the center of the scene.
        const modelViewMatrix = mat4.create();

        // Now move the drawing position a bit to where we want to
        // start drawing the square.

        mat4.translate(modelViewMatrix,     // destination matrix
            modelViewMatrix,     // matrix to translate
            [-0.0, 0.0, -6.0]);  // amount to translate

        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute.
        {
            const numComponents = 3;  // pull out 3 values per iteration
            const type = gl.FLOAT;    // the data in the buffer is 32bit floats
            const normalize = false;  // don't normalize
            const stride = 0;         // how many bytes to get from one set of values to the next
            // 0 = use type and numComponents above
            const offset = 0;         // how many bytes inside the buffer to start from
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexPosition);
        }

        // Tell WebGL to use our program when drawing

        gl.useProgram(programInfo.program);

        // Set the shader uniforms

        gl.uniformMatrix4fv(
            programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix);
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix);

        {
            const offset = 0;
            const vertexCount = 4;
            gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
        }
    }


    useEffect(() => {
        const canvas = document.querySelector("#glcanvas");
        // 初始化WebGL上下文
        const gl = (canvas as any).getContext("webgl");

        // 确认WebGL支持性
        if (!gl) {
            alert("无法初始化WebGL，你的浏览器、操作系统或硬件等可能不支持WebGL。");
            return;
        }

        // 使用完全不透明的黑色清除所有图像
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        // 用上面指定的颜色清除缓冲区
        gl.clear(gl.COLOR_BUFFER_BIT);
        const vsSource = `
    attribute vec4 aVertexPosition;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    }
    
  `;
        const fsSource = `
  void main() {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  }
`;

        const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

        const programInfo = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            },
            uniformLocations: {
                projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
                modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
            },
        };

        drawScene(gl, programInfo, initBuffers(gl))

    }, [])



    return (
        <canvas id="glcanvas" width="640" height="480">
            你的浏览器似乎不支持或者禁用了HTML5 <code>&lt;canvas&gt;</code> 元素.
        </canvas>
    )
}

export default MyWebGL;