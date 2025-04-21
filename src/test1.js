import {BufferGeometry, Line, LineBasicMaterial, PerspectiveCamera, Scene, Vector3, WebGLRenderer, AmbientLight, CameraHelper} from "three"
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js"
import {FlyControls} from "three/addons/controls/FlyControls.js"
import {OrbitControls} from "three/addons/controls/OrbitControls.js"
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass.js"
import {GlitchPass} from "three/examples/jsm/postprocessing/GlitchPass.js"
import {OutlinePass} from "three/examples/jsm/postprocessing/OutlinePass.js"
import {OutputPass} from "three/examples/jsm/postprocessing/OutputPass.js"
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer.js"
import {Camera, Object3D, Vector2} from "three/src/Three.js"
import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass.js";
import {FXAAShader} from "three/examples/jsm/shaders/FXAAShader.js";


const renderer = new WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500)
camera.position.set(0, 0, 100)
camera.lookAt(0, 0, 0)

const scene = new Scene()

const composer = new EffectComposer(renderer)
composer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
const renderPass = new RenderPass(scene, camera)
composer.addPass(renderPass)
const outlinePass = new OutlinePass(new Vector2(window.innerWidth, window.innerHeight), scene, camera)
// outlinePass.renderToScreen = true
composer.addPass(outlinePass)
outlinePass.edgeStrength = 3.0
outlinePass.edgeGlow = 1.0
outlinePass.edgeThickness = 3.0
outlinePass.pulsePeriod = 0
outlinePass.usePatternTexture = false
outlinePass.visibleEdgeColor.set(0x1abaff)
outlinePass.hiddenEdgeColor.set(0x1abaff)
composer.addPass(new OutputPass())

const effectFXAA = new ShaderPass(FXAAShader)
effectFXAA.uniforms["resolution"].value.set(1 / window.innerWidth, 1 / window.innerHeight)
// effectFXAA.renderToScreen = true
composer.addPass(effectFXAA)

const material = new LineBasicMaterial({color: 0xff33ff})

const points = []
points.push(new Vector3(-10, 0, 0))
points.push(new Vector3(0, 10, 0))
points.push(new Vector3(10, 0, 0))
const geometry = new BufferGeometry().setFromPoints(points)

const line = new Line(geometry, material)

scene.add(line)

const light = new AmbientLight(0xffffff, 100)

scene.add(light)
// scene.add(new CameraHelper(camera))
const controls = new OrbitControls(camera, renderer.domElement)
controls.movementSpeed = 100
controls.rollSpeed = Math.PI / 24
controls.autoForward = false
controls.dragToLook = true

const loader = new GLTFLoader()

loader.load("res/models/porsche.glb", function (gltf) {
    scene.add(gltf.scene)
    gltf.scene.scale.setScalar(10)
    outlinePass.selectedObjects = [gltf.scene]
}, undefined, function (error) {
    console.error(error)
})

function render() {
    requestAnimationFrame(render)
    controls.update(0.01)
    composer.render()
}

render()
