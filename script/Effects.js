import * as THREE from 'https://cdn.skypack.dev/three@v0.122.0';

// Helper function to generate random integers
function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function to convert RGB values to THREE.Vector3
function rgb(r, g, b) {
    return new THREE.Vector3(r, g, b);
}

document.addEventListener("DOMContentLoaded", function() {
    // Only initialize the effect if we're on the hero section
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    
    // Add canvas to DOM
    heroSection.insertBefore(renderer.domElement, heroSection.firstChild);
    
    // Create scene and camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Initialize parameters
    let vCheck = false;
    const randomisePosition = new THREE.Vector2(1, 2);
    
    // Color functions
    const R = function(x, y, t) {
        return Math.floor(42 + 30 * Math.cos((x * x - y * y) / 300 + t));
    };
    
    const G = function(x, y, t) {
        return Math.floor(42 + 30 * Math.sin((x * x * Math.cos(t / 4) + y * y * Math.sin(t / 3)) / 300));
    };
    
    const B = function(x, y, t) {
        return Math.floor(60 + 40 * Math.sin(5 * Math.sin(t / 9) + ((x - 100) * (x - 100) + (y - 100) * (y - 100)) / 1100));
    };
    
    // Get the shader code
    const sNoise = document.querySelector('#snoise-function').textContent;
    
    // Create geometry
    const geometry = new THREE.PlaneGeometry(window.innerWidth / 2, 400, 100, 100);
    
    // Create material with custom shaders
    const material = new THREE.ShaderMaterial({
        uniforms: {
            u_bg: { type: 'v3', value: rgb(24, 24, 26) },
            u_bgMain: { type: 'v3', value: rgb(10, 10, 10) },
            u_color1: { type: 'v3', value: rgb(58, 134, 255) },
            u_color2: { type: 'v3', value: rgb(10, 33, 88) },
            u_time: { type: 'f', value: 0 },
            u_randomisePosition: { type: 'v2', value: randomisePosition }
        },
        fragmentShader: sNoise + document.querySelector('#fragment-shader').textContent,
        vertexShader: sNoise + document.querySelector('#vertex-shader').textContent,
    });
    
    // Create mesh
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 120, -280);
    mesh.scale.multiplyScalar(4);
    mesh.rotationX = -1.0;
    mesh.rotationY = 0.0;
    mesh.rotationZ = 0.1;
    scene.add(mesh);
    
    // Render initial frame
    renderer.render(scene, camera);
    
    // Animation variables
    let t = 0;
    let j = 0;
    let x = randomInteger(0, 32);
    let y = randomInteger(0, 32);
    
    // Animation loop
    const animate = function() {
        requestAnimationFrame(animate);
        
        // Update uniforms for animation
        mesh.material.uniforms.u_randomisePosition.value = new THREE.Vector2(j, j);
        mesh.material.uniforms.u_color1.value = new THREE.Vector3(R(x, y, t / 2), G(x, y, t / 2), B(x, y, t / 2));
        mesh.material.uniforms.u_time.value = t;
        
        // Update animation parameters
        if (t % 0.1 == 0) {
            if (vCheck == false) {
                x -= 1;
                if (x <= 0) {
                    vCheck = true;
                }
            } else {
                x += 1;
                if (x >= 32) {
                    vCheck = false;
                }
            }
        }
        
        // Increment time parameters
        j = j + 0.01;
        t = t + 0.05;
        
        // Render the frame
        renderer.render(scene, camera);
    };
    
    // Start animation
    animate();
    
    // Handle window resize
    window.addEventListener('resize', function() {
        // Update camera
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        
        // Update renderer
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
    });
});