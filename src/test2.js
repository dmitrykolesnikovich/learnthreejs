import {BoxGeometry, DirectionalLight, Mesh, MeshPhongMaterial, PerspectiveCamera, Scene, WebGLRenderer} from 'three'

function main() {
    const renderer = new WebGLRenderer({antialias: true})
    document.body.appendChild(renderer.domElement)
    const fov = 75
    const aspect = 2
    const near = 0.1
    const far = 5
    const camera = new PerspectiveCamera(fov, aspect, near, far)
    camera.position.z = 2
    const scene = new Scene()
    {
        const color = 0xFFFFFF
        const intensity = 3
        const light = new DirectionalLight(color, intensity)
        light.position.set(-1, 2, 4)
        scene.add(light)
    }
    const boxWidth = 1
    const boxHeight = 1
    const boxDepth = 1
    const geometry = new BoxGeometry(boxWidth, boxHeight, boxDepth)

    function makeInstance(geometry, color, x) {
        const material = new MeshPhongMaterial({color})
        const cube = new Mesh(geometry, material)
        scene.add(cube)
        cube.position.x = x
        return cube
    }

    const cubes = [
        makeInstance(geometry, 0x44aa88, 0),
        makeInstance(geometry, 0x8844aa, -2),
        makeInstance(geometry, 0xaa8844, 2),
    ]

    function render(time) {
        time *= 0.001
        cubes.forEach((cube, ndx) => {
            const speed = 1 + ndx * .1
            const rot = time * speed
            cube.rotation.x = rot
            cube.rotation.y = rot
        })
        renderer.render(scene, camera)
        requestAnimationFrame(render)
    }

    requestAnimationFrame(render)
}

main()
