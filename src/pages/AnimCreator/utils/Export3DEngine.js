// Export3DEngine.js
// Export utilities for MotionZync 3D Studio:
//  - GLB  : THREE.GLTFExporter -> binary .glb download
//  - JSON : serialize full world/scene state -> downloadable .json
//  - Sprite Sheet : render N frames of the scene to a stitched PNG sprite sheet
//
// All functions are framework-agnostic; pass in THREE, scene, renderer, camera
// obtained from Viewport3D's ref API (getThree/getScene/getRenderer/getCamera).

// ─── Helpers ─────────────────────────────────────────────────────
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function downloadJSON(obj, filename) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' })
  downloadBlob(blob, filename)
}

// ════════════════════════════════════════════════════════════════
// GLB EXPORT — export the Three.js scene as a binary .glb file
// ════════════════════════════════════════════════════════════════
let _GLTFExporter = null

async function loadGLTFExporter(THREE) {
  if (_GLTFExporter) return _GLTFExporter
  try {
    const mod = await import('three/addons/exporters/GLTFExporter.js')
    _GLTFExporter = mod.GLTFExporter
  } catch {
    const mod = await import('https://esm.sh/three@0.167.0/examples/jsm/exporters/GLTFExporter.js')
    _GLTFExporter = mod.GLTFExporter
  }
  return _GLTFExporter
}

/**
 * Export the given scene to a .glb file and trigger download.
 * @param {object} THREE - the loaded THREE module
 * @param {THREE.Scene} scene
 * @param {object} opts - { filename, binary, onlyVisible, includeFloorAndGrid }
 */
export async function exportGLB(THREE, scene, opts = {}) {
  if (!THREE || !scene) throw new Error('THREE and scene are required')

  const Exporter = await loadGLTFExporter(THREE)
  const exporter = new Exporter()

  const filename = opts.filename || `motionzync-scene-${Date.now()}.glb`
  const includeHelpers = opts.includeFloorAndGrid ?? false

  // Optionally exclude grid/floor helper objects from export
  const excluded = []
  if (!includeHelpers) {
    scene.traverse((obj) => {
      if (obj.isGridHelper || obj.userData?.isFloor) {
        excluded.push(obj)
        obj.userData.__exportHidden = obj.visible
        obj.visible = false
      }
    })
  }

  try {
    const result = await new Promise((resolve, reject) => {
      exporter.parse(
        scene,
        (gltf) => resolve(gltf),
        (err) => reject(err),
        { binary: true, onlyVisible: opts.onlyVisible ?? true }
      )
    })

    // result is an ArrayBuffer when binary:true
    const blob = new Blob([result], { type: 'application/octet-stream' })
    downloadBlob(blob, filename)
    return { success: true, filename }
  } finally {
    // restore visibility
    for (const obj of excluded) {
      obj.visible = obj.userData.__exportHidden
      delete obj.userData.__exportHidden
    }
  }
}

// ════════════════════════════════════════════════════════════════
// JSON WORLD EXPORT — serialize full studio state to a downloadable JSON
// ════════════════════════════════════════════════════════════════
/**
 * Serialize the full 3D world state: objects, materials, physics bodies,
 * lights, camera, keyframe animations, and procedural animations.
 *
 * @param {object} params
 * @param {Array}  params.objects     - viewport object list [{id,name,type,...}]
 * @param {object} params.meshMap     - { [id]: THREE.Mesh }
 * @param {object} params.bodyMap     - { [id]: RigidBody }
 * @param {object} params.world       - Physics3DWorld instance (optional)
 * @param {object} params.lights      - { ambient, dir, fillA, fillB } THREE lights
 * @param {object} params.camera      - THREE.Camera
 * @param {object} params.keyframeAnimator - Keyframe3DAnimator instance (optional)
 * @param {object} params.proceduralAnimations - Animation3DController instance (optional)
 * @param {object} params.meta        - extra metadata (duration, gravity, etc.)
 */
export function serializeWorld(params = {}) {
  const {
    objects = [], meshMap = {}, bodyMap = {},
    world = null, lights = {}, camera = null,
    keyframeAnimator = null, proceduralAnimations = null,
    meta = {},
  } = params

  const objectsData = objects.map(obj => {
    const mesh = meshMap[obj.id]
    const body = bodyMap[obj.id]

    const data = {
      id: obj.id,
      name: obj.name,
      type: obj.type,
      isStatic: !!obj.isStatic,
    }

    if (mesh) {
      data.transform = {
        position: { x: mesh.position.x, y: mesh.position.y, z: mesh.position.z },
        rotation: { x: mesh.rotation.x, y: mesh.rotation.y, z: mesh.rotation.z },
        scale:    { x: mesh.scale.x,    y: mesh.scale.y,    z: mesh.scale.z },
      }
      if (mesh.material) {
        const m = mesh.material
        data.material = {
          color: m.color ? `#${m.color.getHexString()}` : undefined,
          emissive: m.emissive ? `#${m.emissive.getHexString()}` : undefined,
          metalness: m.metalness,
          roughness: m.roughness,
          opacity: m.opacity,
          transparent: m.transparent,
          wireframe: !!m.wireframe,
        }
      }
    }

    if (body) {
      data.physics = {
        mass: body.mass,
        isStatic: body.isStatic,
        position: { ...body.position },
        rotation: { ...body.rotation },
        velocity: body.velocity ? { ...body.velocity } : undefined,
        restitution: body.restitution,
        friction: body.friction,
        linearDamping: body.linearDamping,
        angularDamping: body.angularDamping,
      }
    }

    return data
  })

  const lightsData = {}
  if (lights.ambient) {
    lightsData.ambient = { color: `#${lights.ambient.color.getHexString()}`, intensity: lights.ambient.intensity }
  }
  if (lights.dir) {
    lightsData.directional = {
      color: `#${lights.dir.color.getHexString()}`,
      intensity: lights.dir.intensity,
      position: { x: lights.dir.position.x, y: lights.dir.position.y, z: lights.dir.position.z },
    }
  }
  if (lights.fillA) {
    lightsData.fillA = { color: `#${lights.fillA.color.getHexString()}`, intensity: lights.fillA.intensity,
      position: { x: lights.fillA.position.x, y: lights.fillA.position.y, z: lights.fillA.position.z } }
  }
  if (lights.fillB) {
    lightsData.fillB = { color: `#${lights.fillB.color.getHexString()}`, intensity: lights.fillB.intensity,
      position: { x: lights.fillB.position.x, y: lights.fillB.position.y, z: lights.fillB.position.z } }
  }

  const cameraData = camera ? {
    fov: camera.fov, near: camera.near, far: camera.far,
    position: { x: camera.position.x, y: camera.position.y, z: camera.position.z },
  } : null

  const worldData = world ? {
    gravity: { ...world.gravity },
  } : null

  return {
    version: '1.0',
    generator: 'MotionZync 3D Studio',
    exportedAt: new Date().toISOString(),
    meta,
    world: worldData,
    lights: lightsData,
    camera: cameraData,
    objects: objectsData,
    keyframeAnimations: keyframeAnimator ? keyframeAnimator.serialize() : null,
    proceduralAnimations: proceduralAnimations ? proceduralAnimations.serialize() : null,
  }
}

/**
 * Serialize and download the world state as a .json file.
 */
export function exportWorldJSON(params = {}, filename) {
  const data = serializeWorld(params)
  downloadJSON(data, filename || `motionzync-world-${Date.now()}.json`)
  return data
}

// ════════════════════════════════════════════════════════════════
// SPRITE SHEET EXPORT — render N frames and stitch into one PNG
// ════════════════════════════════════════════════════════════════
/**
 * Render `frameCount` frames of the scene (advancing time/animations between
 * each frame via the provided `stepFn`) and stitch them into a single
 * sprite-sheet PNG with a grid layout.
 *
 * @param {object} params
 * @param {object} params.renderer  - THREE.WebGLRenderer
 * @param {object} params.scene     - THREE.Scene
 * @param {object} params.camera    - THREE.Camera
 * @param {number} params.frameCount - total frames to capture (default 16)
 * @param {number} params.columns    - grid columns (default: ceil(sqrt(frameCount)))
 * @param {number} params.frameWidth - output frame width  (default: renderer width)
 * @param {number} params.frameHeight- output frame height (default: renderer height)
 * @param {number} params.dt         - seconds advanced per frame (default 1/30)
 * @param {function} params.stepFn   - (dt) => void, called before each frame render
 *                                      (e.g. step procedural animations + keyframes)
 * @param {string} params.filename
 */
export async function exportSpriteSheet(params = {}) {
  const {
    renderer, scene, camera,
    frameCount = 16,
    columns = Math.ceil(Math.sqrt(frameCount)),
    frameWidth, frameHeight,
    dt = 1 / 30,
    stepFn = null,
    filename,
  } = params

  if (!renderer || !scene || !camera) {
    throw new Error('renderer, scene, and camera are required')
  }

  // Output frame resolution (defaults to renderer's current canvas size)
  const rw = frameWidth  || renderer.domElement.width
  const rh = frameHeight || renderer.domElement.height

  const rows = Math.ceil(frameCount / columns)

  const sheet = document.createElement('canvas')
  sheet.width  = rw * columns
  sheet.height = rh * rows
  const ctx = sheet.getContext('2d')

  // Preserve current pixel ratio render size to restore after
  const prevSize = { w: renderer.domElement.width, h: renderer.domElement.height }
  const prevRatio = renderer.getPixelRatio()

  // Render at exact frame resolution (pixel ratio 1 for crisp grid math)
  renderer.setPixelRatio(1)
  renderer.setSize(rw, rh, false)

  try {
    for (let i = 0; i < frameCount; i++) {
      if (stepFn) stepFn(dt)
      renderer.render(scene, camera)

      const col = i % columns
      const row = Math.floor(i / columns)
      ctx.drawImage(renderer.domElement, col * rw, row * rh, rw, rh)
    }

    const blob = await new Promise((resolve) => sheet.toBlob(resolve, 'image/png'))
    downloadBlob(blob, filename || `motionzync-spritesheet-${Date.now()}.png`)

    return {
      success: true,
      frameCount, columns, rows,
      frameWidth: rw, frameHeight: rh,
      sheetWidth: sheet.width, sheetHeight: sheet.height,
    }
  } finally {
    // restore renderer size/ratio
    renderer.setPixelRatio(prevRatio)
    renderer.setSize(prevSize.w / prevRatio, prevSize.h / prevRatio, false)
  }
}
