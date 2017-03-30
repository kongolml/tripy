var W = window.innerWidth
var H = window.innerHeight

var scene, camera, light, renderer, container, controls

var circleSeparation = 85

var raycaster = new THREE.Raycaster()
var mouse = new THREE.Vector2()
var INTERSECTED

var geometry
var material

// mouse
var mouseDown = false

var group = new THREE.Group()


function init(){
    container = document.createElement('div')
    document.body.appendChild(container)

    scene = new THREE.Scene()

    camera = new THREE.PerspectiveCamera(75, W/H, 1, 10000)
    //camera = new THREE.OrthographicCamera(W/-2, W/2, H/2, H/-2, 1, 1000)
    camera.position.set(0, 0, 700)

    controls = new THREE.OrbitControls(camera)
    controls.addEventListener('change', render)

    renderer = new THREE.WebGLRenderer()
    renderer.setClearColor(0xfafafa)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(W, H)

    light = new THREE.PointLight(0xaeaeae)
    light.position.set(350, 0, 1150)
    scene.add(light)

    container.appendChild(renderer.domElement)

    geometry = new THREE.BoxBufferGeometry(32, 32, 32)
    material = new THREE.MeshLambertMaterial({
        color: 0x2194ce
    })


    for(var x=0; x<W; x+=circleSeparation){
        for(var y=0; y<H; y+=circleSeparation){
            var sphere = new THREE.Mesh(geometry, material)
            sphere.position.set((x-W/2), (y-H/2), 0)
            group.add(sphere)
        }
    }

    scene.add(group)


    document.addEventListener('mousemove', onMouseMove, false)
    document.addEventListener('mousedown', onMouseDown, false)
    document.addEventListener('mouseup', onMouseUp, false)
    document.addEventListener('mousewheel', onMouseWheel, false)
    window.addEventListener('resize', onWindowResize, false)


    // helper
    var axis = new THREE.AxisHelper(200)
    scene.add(axis)

    createRope()
}


function render(){
    handleRaycasting()

    if( mouseDown ) {
        animateObject(INTERSECTED)
    }

    camera.lookAt( scene.position )
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


function onMouseWheel(e){
    camera.position.z += -e.deltaY
}


function onMouseDown(){
    mouseDown = true
}


function onMouseUp(){
    mouseDown = false
}


function onWindowResize(){
    W = window.innerWidth
    H = window.innerHeight

    camera.aspect = W/H
    camera.updateProjectionMatrix()
    
    renderer.setSize(W, H)
}


function handleRaycasting(){
    raycaster.setFromCamera(mouse, camera)
    var intersects = raycaster.intersectObjects(group.children)

    if(intersects.length>0 && mouseDown){
        if(INTERSECTED!=intersects[0].object){
            INTERSECTED = intersects[0].object
            console.log(INTERSECTED)
        }
    } else {
        if(INTERSECTED){
            INTERSECTED.rotation.set(0, 0, 0)
            INTERSECTED = null
        }
    }
}


var sinArgument = 0
function animateObject(object) {
    if( object ) {
        sinArgument += 0.1
        var translateVal = Math.cos(sinArgument)

        object.translateZ(translateVal*2)
    }
}


function createRope() {
    var ropeNumSegments = 10
    var ropeLength = 4
    var ropePos = scene.position.clone()

    var segmentLength = ropeLength / ropeNumSegments
    var ropeGeometry = new THREE.BufferGeometry()
    var ropeMaterial = new THREE.LineBasicMaterial({
        color: 0x000000
    })

    var rope = new THREE.LineSegments(ropeGeometry, ropeMaterial)

    scene.add(rope)
}



init()
animate()