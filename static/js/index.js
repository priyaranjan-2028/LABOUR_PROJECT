
        // 3D Scene with Three.js - NETWORK VISUALIZATION
        let scene, camera, renderer, controls;
        let nodes = [];
        let connections = [];
        let nodeMeshes = [];
        let connectionLines = [];
        
        function init3DScene() {
            // Create scene
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0xf5f7fb);
            
            // Create camera
            camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
            camera.position.set(10, 8, 10);
            
            // Create renderer
            const canvas = document.getElementById('labour3d');
            renderer = new THREE.WebGLRenderer({ 
                canvas, 
                antialias: true, 
                alpha: true,
                powerPreference: "high-performance"
            });
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            
            // Add lighting
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(ambientLight);
            
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(10, 20, 15);
            scene.add(directionalLight);
            
            // Create a grid helper for ground reference
            const gridHelper = new THREE.GridHelper(20, 20, 0xcccccc, 0xcccccc);
            gridHelper.position.y = -2;
            scene.add(gridHelper);
            
            // Initialize nodes and connections
            createNetwork();
            
            // Add orbit controls for interactivity
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.minDistance = 5;
            controls.maxDistance = 30;
            
            // Handle window resize
            window.addEventListener('resize', onWindowResize);
            
            // Start animation
            animate();
        }
        
        function createNetwork() {
            // Clear existing objects
            nodes = [];
            connections = [];
            nodeMeshes.forEach(mesh => scene.remove(mesh));
            connectionLines.forEach(line => scene.remove(line));
            nodeMeshes = [];
            connectionLines = [];
            
            // Create nodes representing workers and job sites
            const nodeCount = 15;
            
            // Create two types of nodes: Workers (blue) and Job Sites (orange)
            for (let i = 0; i < nodeCount; i++) {
                const isWorker = i % 3 !== 0; // More workers than job sites
                const node = {
                    id: i,
                    type: isWorker ? 'worker' : 'job',
                    x: (Math.random() - 0.5) * 16,
                    y: (Math.random() - 0.5) * 8,
                    z: (Math.random() - 0.5) * 16,
                    radius: isWorker ? 0.4 : 0.6,
                    color: isWorker ? 0x4a6fa5 : 0xff9f1c,
                    connections: []
                };
                nodes.push(node);
                
                // Create 3D sphere for node
                const geometry = new THREE.SphereGeometry(node.radius, 16, 16);
                const material = new THREE.MeshPhongMaterial({ 
                    color: node.color,
                    emissive: isWorker ? 0x1a3a6a : 0xcc7e16,
                    emissiveIntensity: 0.2
                });
                const sphere = new THREE.Mesh(geometry, material);
                sphere.position.set(node.x, node.y, node.z);
                sphere.userData = { node: node };
                scene.add(sphere);
                nodeMeshes.push(sphere);
                
                // Add label above node
                if (i % 4 === 0) {
                    const labelGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 8);
                    const labelMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
                    const label = new THREE.Mesh(labelGeometry, labelMaterial);
                    label.position.set(node.x, node.y + node.radius + 0.6, node.z);
                    scene.add(label);
                    nodeMeshes.push(label);
                }
            }
            
            // Create connections between nodes
            // Workers connect to nearby job sites
            nodes.forEach((node, i) => {
                if (node.type === 'worker') {
                    // Find nearby job sites
                    nodes.forEach((otherNode, j) => {
                        if (i !== j && otherNode.type === 'job') {
                            const distance = Math.sqrt(
                                Math.pow(node.x - otherNode.x, 2) +
                                Math.pow(node.y - otherNode.y, 2) +
                                Math.pow(node.z - otherNode.z, 2)
                            );
                            
                            // Connect if within certain distance
                            if (distance < 12 && Math.random() > 0.5) {
                                const connection = {
                                    from: node.id,
                                    to: otherNode.id,
                                    strength: 1 - (distance / 12)
                                };
                                connections.push(connection);
                                node.connections.push(otherNode.id);
                                
                                // Create line for connection
                                const points = [];
                                points.push(new THREE.Vector3(node.x, node.y, node.z));
                                points.push(new THREE.Vector3(otherNode.x, otherNode.y, otherNode.z));
                                
                                const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
                                const lineMaterial = new THREE.LineBasicMaterial({ 
                                    color: 0x4a6fa5,
                                    transparent: true,
                                    opacity: 0.4 * connection.strength,
                                    linewidth: 2
                                });
                                const line = new THREE.Line(lineGeometry, lineMaterial);
                                scene.add(line);
                                connectionLines.push(line);
                            }
                        }
                    });
                }
            });
            
            // Add central hub node (platform)
            const hubGeometry = new THREE.TorusGeometry(2, 0.3, 16, 100);
            const hubMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x166088,
                emissive: 0x0a3a5a,
                emissiveIntensity: 0.3
            });
            const hub = new THREE.Mesh(hubGeometry, hubMaterial);
            hub.rotation.x = Math.PI / 2;
            scene.add(hub);
            nodeMeshes.push(hub);
            
            // Add connections from hub to all job sites
            nodes.forEach(node => {
                if (node.type === 'job') {
                    const points = [];
                    points.push(new THREE.Vector3(0, 0, 0));
                    points.push(new THREE.Vector3(node.x, node.y, node.z));
                    
                    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
                    const lineMaterial = new THREE.LineDashedMaterial({ 
                        color: 0x166088,
                        dashSize: 0.5,
                        gapSize: 0.3,
                        transparent: true,
                        opacity: 0.3
                    });
                    const line = new THREE.Line(lineGeometry, lineMaterial);
                    line.computeLineDistances();
                    scene.add(line);
                    connectionLines.push(line);
                }
            });
            
            // Add floating text indicators
            const textPositions = [
                { x: -6, y: 3, z: -6, text: "Workers" },
                { x: 6, y: 3, z: 6, text: "Job Sites" },
                { x: 0, y: 4, z: 0, text: "LabourConnect Hub" }
            ];
            
            textPositions.forEach(pos => {
                // Create a simple placeholder for text (cube with label)
                const textGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
                const textMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });
                const textMarker = new THREE.Mesh(textGeometry, textMaterial);
                textMarker.position.set(pos.x, pos.y, pos.z);
                scene.add(textMarker);
                nodeMeshes.push(textMarker);
            });
        }
        
        function onWindowResize() {
            const canvas = document.getElementById('labour3d');
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        }
        
        function animate() {
            requestAnimationFrame(animate);
            
            // Animate nodes (subtle floating motion)
            nodeMeshes.forEach((mesh, i) => {
                if (mesh.userData.node) {
                    const node = mesh.userData.node;
                    // Only animate worker nodes
                    if (node.type === 'worker') {
                        const time = Date.now() * 0.001;
                        mesh.position.y = node.y + Math.sin(time + i) * 0.2;
                    }
                }
            });
            
            // Animate connection lines (pulse effect)
            connectionLines.forEach((line, i) => {
                const time = Date.now() * 0.001;
                if (line.material.opacity) {
                    line.material.opacity = 0.3 + Math.sin(time + i) * 0.2;
                }
            });
            
            // Slowly rotate the entire scene
            scene.rotation.y += 0.002;
            
            controls.update();
            renderer.render(scene, camera);
        }
        
        // Login Modal Functionality
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize 3D scene
            init3DScene();
            
            // Get modal elements
            const loginModal = document.getElementById('loginModal');
            const openLoginBtn = document.getElementById('openLogin');
            const openLoginMobileBtn = document.getElementById('openLoginMobile');
            const closeLoginBtn = document.getElementById('closeLogin');
            
            // Open modal when login button is clicked
            openLoginBtn.addEventListener('click', () => {
                loginModal.style.display = 'flex';
            });
            
            openLoginMobileBtn.addEventListener('click', () => {
                loginModal.style.display = 'flex';
            });
            
            // Close modal when X is clicked
            closeLoginBtn.addEventListener('click', () => {
                loginModal.style.display = 'none';
            });
            
            // Close modal when clicking outside
            window.addEventListener('click', (e) => {
                if (e.target === loginModal) {
                    loginModal.style.display = 'none';
                }
            });
            
            // Switch to signup form (placeholder)
            document.getElementById('switchToSignup').addEventListener('click', (e) => {
                e.preventDefault();
                // In backend implementation, you would switch forms here
                alert('Sign up form would appear here. Backend would handle user registration.');
            });
            
            // Form submission
            document.querySelector('.login-form').addEventListener('submit', (e) => {
                e.preventDefault();
                const email = e.target.querySelector('input[type="email"]').value;
                const password = e.target.querySelector('input[type="password"]').value;
                
                // In backend implementation, you would send this to your API
                console.log('Login attempt:', { email, password });
                
                // Simulate API call
                setTimeout(() => {
                    alert(`Login functionality would call your backend API.\nEmail: ${email}\nPassword: [hidden]`);
                    loginModal.style.display = 'none';
                    // Reset form
                    e.target.reset();
                }, 500);
            });
            
            // Smooth scrolling for navigation links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const targetId = this.getAttribute('href');
                    if (targetId === '#') return;
                    
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 80,
                            behavior: 'smooth'
                        });
                    }
                });
            });
            
            // Header scroll effect
            window.addEventListener('scroll', () => {
                const header = document.querySelector('header');
                if (window.scrollY > 50) {
                    header.style.padding = '0.7rem 5%';
                    header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
                } else {
                    header.style.padding = '1rem 5%';
                    header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
                }
            });
            
            // Add some interactivity to feature cards
            document.querySelectorAll('.feature-card').forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-10px)';
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                });
            });
            
            // CTA buttons functionality
            document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    const isWorker = this.textContent.includes('Find Work');
                    // In backend implementation, this would redirect to appropriate registration
                    alert(`This would redirect to ${isWorker ? 'worker' : 'employer'} registration page.\nBackend would handle user type detection.`);
                });
            });
        });
        
        // Helper function for backend API calls (for your future implementation)
        async function callBackendAPI(endpoint, method = 'GET', data = null) {
            // This is a template for your backend API calls
            const baseURL = 'https://your-backend-api.com'; // Replace with your actual backend URL
            
            const options = {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    // Add authentication headers here when implemented
                }
            };
            
            if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
                options.body = JSON.stringify(data);
            }
            
            try {
                const response = await fetch(`${baseURL}${endpoint}`, options);
                return await response.json();
            } catch (error) {
                console.error('API call failed:', error);
                throw error;
            }
        }
        
        // Example backend API endpoints you would implement:
        // - POST /api/auth/register (user registration)
        // - POST /api/auth/login (user login)
        // - GET /api/jobs (get available jobs)
        // - POST /api/jobs (post a new job)
        // - GET /api/workers (get available workers)
        // - POST /api/connections (create connection between worker and job)
        // - PUT /api/users/:id (update user profile)
        // - GET /api/notifications (get user notifications)
        // - POST /api/payments (process payment)
    // Modal functionality
// Modal functionality
const modal = document.getElementById('loginModal');
const openLoginBtn = document.getElementById('openLogin');
const openLoginMobileBtn = document.getElementById('openLoginMobile');
const closeBtn = document.querySelector('.close');

// Open modal when login button is clicked
if (openLoginBtn) {
    openLoginBtn.addEventListener('click', function() {
        modal.style.display = 'block';
    });
}

if (openLoginMobileBtn) {
    openLoginMobileBtn.addEventListener('click', function() {
        modal.style.display = 'block';
    });
}

// Close modal when X is clicked
if (closeBtn) {
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});

// 3D Canvas Animation

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});