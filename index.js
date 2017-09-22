import twgl from './node_modules/twgl.js/dist/3.x/twgl-full.js'

const m4 = twgl.m4;
const v3 = twgl.v3;
/*
const gl = twgl.getWebGLContext(document.getElementById("c"));
const programInfo = twgl.createProgramInfo(gl, ["vs", "fs"]);

const textures = twgl.createTextures(gl, {

    color : { 
        mag: gl.NEAREST,
        min: gl.LINEAR,
        src: "textures/sand_color.jpg" 
    },  
    normal : { 
        mag: gl.NEAREST,
        min: gl.LINEAR,
        src: "textures/sand_normal.jpg" 
    } 
})

const arrays = {
  position: [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, -1, 1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1],
  normal:   [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1],
  texcoord: [1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
  indices:  [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23],
};

const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);

const tex = twgl.createTexture(gl, {
  min: gl.NEAREST,
  mag: gl.NEAREST,
  src: [
    255, 255, 255, 255,
    192, 192, 192, 255,
    192, 192, 192, 255,
    255, 255, 255, 255,
  ],
});

const uniforms = {
  u_lightWorldPos: [1, 8, -10],
  u_lightColor: [1, 0.8, 0.8, 1],
  u_ambient: [0, 0, 0, 1],
  u_specular: [1, 1, 1, 1],
  u_shininess: 50,
  u_specularFactor: 1,
  u_diffuse: textures.color,
  u_normal: textures.normal
};
*/
var time = 0;

function render() {

  time += 0.1;

  const element = document.getElementById('c');
  var context = element.getContext('2d');

  var spherePos = v3.create( Math.sin(time) * 10,0,-10)
  var sphereRad = 2

  var lightPos = v3.create(50 * Math.sin(time * .5), 15, 0)

  var eye = v3.create(0,0,0)
  var dir = v3.create(0,0,-1)
  
  var right = v3.normalize(v3.cross(dir, v3.create(0,1,0)));
  var up = v3.normalize(v3.cross(right, dir));

  var w = 160; var h = 120;
  var r = w / h;
 
  for(var x = 0; x < w; x++) {
    
    for(var y = 0; y < h; y++) {

      var sx = parseFloat((x / w) - 0.5) * 2 * r;
      var sy = parseFloat((y / h) - 0.5) * 2;

      var vx = v3.mulScalar(right, sx);
      var vy = v3.mulScalar(up, sy);

      var pixelDir = v3.add(dir, v3.add(vx, vy))

      var eyeToSphere = v3.subtract(spherePos, eye)
      
      var normPixelDir = v3.normalize(pixelDir)
      var scalPixelDir = v3.dot(eyeToSphere, normPixelDir)
      var projPixelDir = v3.mulScalar(normPixelDir, scalPixelDir)

      var d = v3.length(v3.subtract(v3.add(eye, projPixelDir), spherePos))
      var lighting = 0
      var color = v3.create(0,0,0)

      if(d < sphereRad) {

        const base = Math.sqrt( (sphereRad*sphereRad) - (d * d))

        const intersectionPoint = v3.add(eye, v3.mulScalar(normPixelDir, (scalPixelDir - base)))
        const normal = v3.normalize( v3.subtract( intersectionPoint, spherePos ) )
        const toLight = v3.normalize( v3.subtract(lightPos, intersectionPoint) )
        lighting =  Math.max(0, v3.dot(toLight, normal)) *.75 + .25

        color = v3.create(
          parseInt((normal[0] * 0.5 + 0.5) * 255 * lighting),
          parseInt((normal[1] * 0.5 + 0.5) * 255 * lighting),
          parseInt((normal[2] * 0.5 + 0.5) * 255 * lighting))
          color = v3.create(
            parseInt((normal[0] * toLight[0]) * 255 * lighting),
            parseInt((normal[1] * toLight[1]) * 255 * lighting),
            parseInt((normal[2] * toLight[2]) * 255 * lighting))

          // color = v3.create(
          //   0*parseInt((toLight[0]) * 255 ) + 0*parseInt((toLight[0] * 0.5 + 0.5) * 255 ),
          //   0*parseInt((toLight[1]) * 255 ) + 0*parseInt((toLight[1] * 0.5 + 0.5) * 255 ),
          //   1*parseInt((toLight[2]) * 255 ) + 0*parseInt((toLight[2] * 0.5 + 0.5) * 255 ))

          
          color = v3.mulScalar( v3.create(255, 0,0), lighting)
          

       // color = v3.create(lighting, lighting, lighting)

        color[0] = parseInt(color[0])
        color[1] = parseInt(color[1])
        color[2] = parseInt(color[2])
      }

            
      context.fillStyle = `rgba(${ color[0] }, ${ color[1] } , ${ color[2] },1)`
      context.fillRect(x, y, 1, 1 );
    } 
  }
  
setTimeout(function() {

  requestAnimationFrame(render);
},10)
}

requestAnimationFrame(render);
