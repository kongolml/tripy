var _W = window.innerWidth
var _H = window.innerHeight

var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera(75, _W/_H, 1, 10000)
var renderer = new THREE.WebGLRenderer()
renderer.setSize(_W, _H)

var axes = new THREE.AxisHelper(20)

renderer.setSize(_W, _H)
camera.position.set(0, 0, 100)
camera.lookAt(new THREE.Vector3(0, 0, 0))

var geometry = new THREE.CircleGeometry(1, 32)
var meterial = new THREE.MeshBasicMaterial({
    color: 0xffffff
})



var separation = 10

for(var x=-(_W/separation); x<_W/separation; x+=separation){
    for(var y=-(_H/separation); y<_H/separation; y+=separation){
        var circle = new THREE.Mesh(geometry, meterial)
        circle.position.set(x, y, 0)
        scene.add(circle)
    }
}

scene.add(axes)



document.addEventListener('mousemove', omMouseMove, false)
document.addEventListener('mousedown', onMouseDown, false)
document.addEventListener('mouseup', onMouseUp, false)

var mouseDown = false

function omMouseMove(e){
    e.preventDefault()
    var cameraX = -(e.clientX-_W/2)/10
    var cameraY = (e.clientY-_H/2)/10

    if(mouseDown){
        camera.position.set(cameraX, cameraY, 100)
        renderer.render(scene, camera)
    }
}

function onMouseDown(e){
    mouseDown = true
}

function onMouseUp(e){
    mouseDown = false
}


renderer.render(scene, camera)


document.body.appendChild(renderer.domElement)