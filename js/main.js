var W = window.innerWidth
var H = window.innerHeight

var scene, camera, light, renderer, container, controls

var cubeSeparation = 85

var raycaster = new THREE.Raycaster()
var mouse = new THREE.Vector2()
var INTERSECTED

var squareGeometry
var squareMaterial

// mouse
var mouseDown = false

var squaresGroup = new THREE.Group()


// octree
var octree


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

    squareGeometry = new THREE.BoxBufferGeometry(32, 32, 32)
    squareMaterial = new THREE.MeshLambertMaterial({
        color: 0x2194ce
    })


    for(var x=0; x<W; x+=cubeSeparation*4){
        for(var y=0; y<H; y+=cubeSeparation*4){
            var cube = new THREE.Mesh(squareGeometry, squareMaterial)
            cube.position.set((x-W/2), (y-H/2), 0)

            findNearestObjects(cube)

            squaresGroup.add(cube)
        }
    }

    scene.add(squaresGroup)


    document.addEventListener('mousemove', onMouseMove, false)
    document.addEventListener('mousedown', onMouseDown, false)
    document.addEventListener('mouseup', onMouseUp, false)
    document.addEventListener('mousewheel', onMouseWheel, false)
    window.addEventListener('resize', onWindowResize, false)


    // helper
    var axis = new THREE.AxisHelper(200)
    scene.add(axis)

}


function render(){
    handleRaycasting()

    // if( mouseDown ) {
    //     animateObject(INTERSECTED)
    // }

    //camera.lookAt( scene.position )
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

    document.getElementById("info").innerHTML = "x: " +e.clientX + "; y: " + e.clientY
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


var mycube
function handleRaycasting(){
    raycaster.setFromCamera(mouse, camera)
    var intersects = raycaster.intersectObjects(squaresGroup.children)

    if(intersects.length>0 && mouseDown){
        if(INTERSECTED!=intersects[0].object){
            INTERSECTED = intersects[0].object
            mycube = INTERSECTED
        }
    } else {
        if(INTERSECTED){
            INTERSECTED.rotation.set(0, 0, 0)
            INTERSECTED = null
        }
    }
}


function animateObject(object) {
    if( object ) {
        object.translateZ(100)
    }
}


/*
find closest objects:
 - generate octree for each cube
 - find neighbours
 - generate line
*/
function findNearestObjects(object) {
    var nearestObjects = []

    // build octree
    octree = new THREE.Octree({
        undeferred: false,
        depthMax: Infinity,
        objectsThreshold: 18,
        overlapPct: (32+85) * 4,
        scene: object
    })

    octree.add(object)
    octree.update()


    // find neighbours
    // console.log(octree.search(object.position, 1200))

}



init()
animate()