var viewportWidth = window.innerWidth,
    viewportHeight = window.innerHeight,
    scene,
    camera,
    renderer,
    uniforms = {},
    shaderCode,
    material,
    geometry,
    mesh;

function init(){
  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera( viewportWidth / - 2, viewportWidth / 2, viewportHeight / 2, viewportHeight / - 2, 1, 1000 );
  camera.position.z = 1;

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( viewportWidth, viewportHeight );
  document.body.appendChild( renderer.domElement );

  uniforms.resolution = {type:'v2', value: new THREE.Vector2(viewportWidth, viewportHeight)};
  uniforms.mousePosition = {type:'v2', value: new THREE.Vector2(0, 0)};

  shaderCode = document.getElementById('fragmentShader').innerHTML;
  material = new THREE.ShaderMaterial({uniforms: uniforms, fragmentShader: shaderCode});
  geometry = new THREE.PlaneBufferGeometry(viewportWidth, viewportHeight);
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
  window.addEventListener('mousemove', onDocumentMouseMove, false);
  window.addEventListener('resize', onWindowResize, false);
}

function onDocumentMouseMove(event) {
  uniforms.mousePosition.value.set(event.clientX, window.innerHeight - event.clientY);
  console.log("Mouse position:", uniforms.mousePosition.value);
}

function onWindowResize() {
  viewportWidth = window.innerWidth;
  viewportHeight = window.innerHeight;

  uniforms.resolution.value.set(viewportWidth, viewportHeight);

  camera.left = viewportWidth / -2;
  camera.right = viewportWidth / 2;
  camera.top = viewportHeight / 2;
  camera.bottom = viewportHeight / -2;
  camera.updateProjectionMatrix();

  renderer.setSize(viewportWidth, viewportHeight);
  geometry = new THREE.PlaneBufferGeometry(viewportWidth, viewportHeight);
  mesh.geometry.dispose();
  mesh.geometry = geometry;
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  renderer.render(scene, camera);
  console.log("Rendering frame");
}

init();
animate();
