var W = window.innerWidth
var H = window.innerHeight

var scene, camera, light, renderer, container

var theta = 0, radius = 100

var circleSeparation = 85

var raycaster = new THREE.Raycaster()
var mouse = new THREE.Vector2()
var INTERSECTED


function init(){
    container = document.createElement('div')
    document.body.appendChild(container)

    scene = new THREE.Scene()

    camera = new THREE.PerspectiveCamera(75, W/H, 1, 1000)
    //camera = new THREE.OrthographicCamera(W/-2, W/2, H/2, H/-2, 1, 1000)
    camera.position.set(0, 0, 1000)

    renderer = new THREE.WebGLRenderer()
    renderer.setClearColor(0x000000)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(W, H)

    light = new THREE.AmbientLight(0xaeaeae)
    scene.add(light)

    container.appendChild(renderer.domElement)

    var geometry = new THREE.BoxBufferGeometry(32, 32, 32)
    var material = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        wireframe: true
    })

    for(var x=0; x<W; x+=circleSeparation){
        for(var y=0; y<H; y+=circleSeparation){
            var sphere = new THREE.Mesh(geometry, material)
            sphere.position.set((x-W/2), (y-H/2), 0)
            scene.add(sphere)
        }
    }


    document.addEventListener('mousemove', onMouseMove, false)
    window.addEventListener('resize', onWindowResize, false)


    // helper
    var axis = new THREE.AxisHelper(20)
    scene.add(axis)
}


function render(){
    theta += 1

    // camera.position.set(radius * Math.sin(THREE.Math.degToRad(theta)), radius * Math.sin(THREE.Math.degToRad(theta)), 500)
    camera.lookAt( scene.position )
    handleRaycasting()
    renderer.render(scene, camera)
}


function animate(){
    requestAnimationFrame(animate)
    render()
}


function onMouseMove(e){
    e.preventDefault()

    mouse.x = (e.clientX/W) * 2 - 1
    mouse.y = -(e.clientY/H) * 2 + 1
}


function handleRaycasting(){
    raycaster.setFromCamera(mouse, camera)
    var intersects = raycaster.intersectObjects(scene.children)

    if(intersects.length>0){
        if(INTERSECTED!=intersects[0].object){
            INTERSECTED = intersects[0].object
            INTERSECTED.rotation.set(100, 100, 100)
            console.log(INTERSECTED.id)
        }
    } else {
        if(INTERSECTED){
            INTERSECTED.rotation.set(0, 0, 0)
            INTERSECTED = null
        }
    }
}


function onWindowResize(){
    W = window.innerWidth
    H = window.innerHeight

    camera.aspect = W/H
    camera.updateProjectionMatrix()
    
    renderer.setSize(W, H)
}


init()
animate()