// Viewport3D.jsx
// Full 3D viewport using Three.js + custom physics
// Mobile touch orbit controls built-in
import { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from 'react'
import { Physics3DWorld, RigidBody, BoxShape, SphereShape, CapsuleShape, ClothBody, WindField } from '../engines/Physics3DEngine.js'
import { Animation3DController } from '../engines/Animation3DTypes.js'
import './Viewport3D.css'

// ─── Three.js loaded via dynamic import ───────────────────────
let THREE = null
let OrbitControls = null

async function loadThree() {
  if (THREE) return THREE
  // Try npm package first, fallback to CDN
  try {
    const mod = await import('three')
    const omod = await import('three/addons/controls/OrbitControls.js')
    THREE = mod
    OrbitControls = omod.OrbitControls
  } catch {
    const mod = await import('https://esm.sh/three@0.167.0')
    const omod = await import('https://esm.sh/three@0.167.0/examples/jsm/controls/OrbitControls.js')
    THREE = mod
    OrbitControls = omod.OrbitControls
  }
  return THREE
}

// ─── 3D Object templates ──────────────────────────────────────
const OBJECT_TEMPLATES = {
  'Cube':     { geo: (T) => new T.BoxGeometry(1,1,1),     physics: { shape: new BoxShape(0.5,0.5,0.5) } },
  'Sphere':   { geo: (T) => new T.SphereGeometry(0.5,32,32), physics: { shape: new SphereShape(0.5) } },
  'Cylinder': { geo: (T) => new T.CylinderGeometry(0.4,0.4,1,32), physics: { shape: new CapsuleShape(0.4,1) } },
  'Plane':    { geo: (T) => new T.PlaneGeometry(5,5),     physics: { isStatic:true } },
  'Torus':    { geo: (T) => new T.TorusGeometry(0.5,0.2,16,32), physics: { shape: new BoxShape(0.7,0.7,0.3) } },
  'Cone':     { geo: (T) => new T.ConeGeometry(0.5,1,32), physics: { shape: new BoxShape(0.5,0.5,0.5) } },
  'Diamond':  { geo: (T) => new T.OctahedronGeometry(0.6), physics: { shape: new SphereShape(0.6) } },
  'Star':     { geo: (T) => new T.TorusKnotGeometry(0.4,0.15,100,16), physics: { shape: new SphereShape(0.6) } },
}

const MATERIALS_LIST = {
  'Neon Purple': { color: 0x7c3aed, emissive: 0x3b0764, metalness: 0.3, roughness: 0.4 },
  'Cyan Glow':   { color: 0x06b6d4, emissive: 0x0891b2, metalness: 0.5, roughness: 0.2 },
  'Gold':        { color: 0xf59e0b, emissive: 0x78350f, metalness: 0.9, roughness: 0.1 },
  'Chrome':      { color: 0xe2e8f0, emissive: 0x000000, metalness: 1.0, roughness: 0.0 },
  'Matte Red':   { color: 0xef4444, emissive: 0x000000, metalness: 0.0, roughness: 0.9 },
  'Glass':       { color: 0x93c5fd, emissive: 0x000000, metalness: 0.1, roughness: 0.0, transparent: true, opacity: 0.5 },
  'Rubber':      { color: 0x22c55e, emissive: 0x000000, metalness: 0.0, roughness: 1.0 },
  'Lava':        { color: 0xff4500, emissive: 0xff2200, metalness: 0.0, roughness: 0.8 },
}

let _meshId = 0

const Viewport3D = forwardRef(function Viewport3D(
  { onSelectBody, onWorldStep, style },
  ref
) {
  const mountRef       = useRef(null)
  const rendererRef    = useRef(null)
  const sceneRef       = useRef(null)
  const cameraRef      = useRef(null)
  const orbitRef       = useRef(null)
  const worldRef       = useRef(null)
  const meshMapRef     = useRef({}) // bodyId -> THREE.Mesh
  const bodyMapRef     = useRef({}) // bodyId -> RigidBody
  const clockRef       = useRef({ last: 0 })
  const rafRef         = useRef(null)
  const selectedRef    = useRef(null)
  const outlineRef     = useRef(null)
  const lightsRef      = useRef({ ambient: null, dir: null, fillA: null, fillB: null })
  const procAnimRef    = useRef(null)
  if (!procAnimRef.current) procAnimRef.current = new Animation3DController()

  const [isReady,   setIsReady]   = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [objects,   setObjects]   = useState([])
  const [selId,     setSelId]     = useState(null)
  const [material,  setMaterial]  = useState('Neon Purple')
  const [addSheetOpen, setAddSheetOpen] = useState(false)

  // ── Initialize Three.js scene ─────────────────────────────
  useEffect(() => {
    let alive = true
    loadThree().then((T) => {
      if (!alive || !mountRef.current) return

      const W = mountRef.current.clientWidth
      const H = mountRef.current.clientHeight

      // Renderer
      const renderer = new T.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setSize(W, H)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type    = T.PCFSoftShadowMap
      renderer.toneMapping       = T.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.2
      mountRef.current.appendChild(renderer.domElement)
      rendererRef.current = renderer

      // Scene
      const scene = new T.Scene()
      scene.background = new T.Color(0x0a0a1a)
      scene.fog = new T.Fog(0x0a0a1a, 30, 80)
      sceneRef.current = scene

      // Camera
      const camera = new T.PerspectiveCamera(60, W/H, 0.1, 1000)
      camera.position.set(5, 5, 8)
      camera.lookAt(0, 0, 0)
      cameraRef.current = camera

      // Orbit controls
      if (OrbitControls) {
        const orbit = new OrbitControls(camera, renderer.domElement)
        orbit.enableDamping = true
        orbit.dampingFactor = 0.05
        orbit.screenSpacePanning = true
        orbit.enablePan = true
        orbit.minDistance = 1
        orbit.maxDistance = 50
        // Mobile touch mapping: 1 finger = orbit/rotate, 2 fingers = pinch-zoom + pan
        orbit.touches = {
          ONE: T.TOUCH.ROTATE,
          TWO: T.TOUCH.DOLLY_PAN,
        }
        orbitRef.current = orbit
      }

      // Lights
      const ambient = new T.AmbientLight(0x1a1a2e, 0.5)
      scene.add(ambient)

      const dirLight = new T.DirectionalLight(0xffffff, 1.2)
      dirLight.position.set(5, 10, 5)
      dirLight.castShadow = true
      dirLight.shadow.mapSize.width  = 2048
      dirLight.shadow.mapSize.height = 2048
      dirLight.shadow.camera.near = 0.1
      dirLight.shadow.camera.far  = 50
      dirLight.shadow.camera.left   = -15
      dirLight.shadow.camera.right  =  15
      dirLight.shadow.camera.top    =  15
      dirLight.shadow.camera.bottom = -15
      scene.add(dirLight)

      // Neon fill lights
      const fillA = new T.PointLight(0x7c3aed, 0.8, 20)
      fillA.position.set(-5, 3, -5)
      scene.add(fillA)
      const fillB = new T.PointLight(0x06b6d4, 0.6, 20)
      fillB.position.set(5, 3, -5)
      scene.add(fillB)

      lightsRef.current = { ambient, dir: dirLight, fillA, fillB }

      // Grid
      const grid = new T.GridHelper(20, 20, 0x2d2d44, 0x1e1e30)
      scene.add(grid)

      // Floor (physics plane)
      const floorGeo  = new T.PlaneGeometry(20, 20)
      const floorMat  = new T.MeshStandardMaterial({ color: 0x111827, roughness: 0.8 })
      const floorMesh = new T.Mesh(floorGeo, floorMat)
      floorMesh.rotation.x = -Math.PI / 2
      floorMesh.receiveShadow = true
      scene.add(floorMesh)

      // Physics world
      const world = new Physics3DWorld({
        gravity: { x:0, y:-9.81, z:0 },
        onStep: (t) => onWorldStep?.(t)
      })
      worldRef.current = world

      // Render loop
      const renderLoop = (now) => {
        rafRef.current = requestAnimationFrame(renderLoop)
        const dt = Math.min((now - (clockRef.current.last || now)) / 1000, 0.05)
        clockRef.current.last = now

        // Step procedural animations (orbit/bounce/spin/float/path/camera fly-through)
        procAnimRef.current?.step(dt, meshMapRef.current, cameraRef.current, orbitRef.current)

        orbitRef.current?.update()
        renderer.render(scene, camera)
      }
      rafRef.current = requestAnimationFrame(renderLoop)

      // Resize
      const onResize = () => {
        if (!mountRef.current) return
        const w = mountRef.current.clientWidth
        const h = mountRef.current.clientHeight
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
      }
      window.addEventListener('resize', onResize)

      setIsReady(true)

      return () => {
        window.removeEventListener('resize', onResize)
      }
    })

    return () => {
      alive = false
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      worldRef.current?.stop()
      rendererRef.current?.dispose()
      if (mountRef.current && rendererRef.current) {
        try { mountRef.current.removeChild(rendererRef.current.domElement) } catch {}
      }
    }
  }, [])

  // ── Add 3D object ─────────────────────────────────────────
  const addObject = useCallback((type = 'Cube', pos = null) => {
    const T = THREE
    if (!T || !sceneRef.current || !worldRef.current) return

    const template = OBJECT_TEMPLATES[type] ?? OBJECT_TEMPLATES['Cube']
    const mat = MATERIALS_LIST[material] ?? MATERIALS_LIST['Neon Purple']

    const geo   = template.geo(T)
    const matOpts = { ...mat }
    const threeMat = new T.MeshStandardMaterial(matOpts)
    const mesh  = new T.Mesh(geo, threeMat)
    mesh.castShadow = true
    mesh.receiveShadow = true
    mesh.userData.objType = type

    const position = pos ?? { x: (Math.random()-0.5)*4, y: 3 + Math.random()*3, z: (Math.random()-0.5)*4 }
    mesh.position.set(position.x, position.y, position.z)

    sceneRef.current.add(mesh)

    // Create physics body
    const body = new RigidBody({
      name: `${type}_${_meshId++}`,
      position,
      mass: 1,
      shape: template.physics?.shape,
      isStatic: template.physics?.isStatic ?? false,
    })

    if (!body.isStatic) worldRef.current.addBody(body)

    const id = body.id
    meshMapRef.current[id] = mesh
    bodyMapRef.current[id] = body
    mesh.userData.bodyId = id

    setObjects(prev => [...prev, {
      id, name: body.name, type,
      isStatic: body.isStatic, visible: true
    }])

    return { mesh, body }
  }, [material])

  // ── Select object ─────────────────────────────────────────
  const selectObject = useCallback((id) => {
    if (!THREE || !sceneRef.current) return
    setSelId(id)
    const body = bodyMapRef.current[id]
    onSelectBody?.(body)
  }, [onSelectBody])

  // ── Play/Pause physics ────────────────────────────────────
  const togglePlay = useCallback(() => {
    const world = worldRef.current
    if (!world) return
    if (isPlaying) {
      world.stop()
      // Restore all body transforms in Three.js
      for (const [id, mesh] of Object.entries(meshMapRef.current)) {
        const body = bodyMapRef.current[id]
        if (body) body.syncToObject3D(mesh)
      }
    } else {
      world.start()
      // Sync world step to Three.js meshes
      world.onStep = () => {
        for (const [id, body] of Object.entries(bodyMapRef.current)) {
          const mesh = meshMapRef.current[id]
          if (!mesh || body.isStatic) continue
          mesh.position.set(body.position.x, body.position.y, body.position.z)
          mesh.rotation.set(body.rotation.x, body.rotation.y, body.rotation.z)
        }
      }
    }
    setIsPlaying(p => !p)
  }, [isPlaying])

  // ── Explode ───────────────────────────────────────────────
  const triggerExplosion = useCallback((pos) => {
    worldRef.current?.explode({
      position: pos ?? { x:0, y:0, z:0 },
      radius: 6, force: 300, upward: 0.8
    })
    worldRef.current?.bodies.forEach(b => b.wake())
  }, [])

  // ── Delete selected ───────────────────────────────────────
  const deleteSelected = useCallback(() => {
    if (!selId) return
    const mesh = meshMapRef.current[selId]
    const body = bodyMapRef.current[selId]
    if (mesh) { sceneRef.current?.remove(mesh); mesh.geometry.dispose(); mesh.material.dispose() }
    if (body) worldRef.current?.removeBody(body)
    delete meshMapRef.current[selId]
    delete bodyMapRef.current[selId]
    setObjects(prev => prev.filter(o => o.id !== selId))
    setSelId(null)
    onSelectBody?.(null)
  }, [selId, onSelectBody])

  // ── Update body from panel ────────────────────────────────
  const updateBody = useCallback((updated) => {
    if (!updated?.id) return
    const body = bodyMapRef.current[updated.id]
    if (!body) return
    Object.assign(body, updated)
    body._invMass = body.isStatic ? 0 : 1 / Math.max(body.mass, 0.001)
    if (updated._impulse) {
      body.applyImpulse(updated._impulse)
    }
  }, [])

  // ── Update material on selected mesh ──────────────────────
  const updateMaterial = useCallback((meshId, props = {}) => {
    const T = THREE
    if (!T) return
    const id = meshId ?? selId
    const mesh = id ? meshMapRef.current[id] : null
    if (!mesh || !mesh.material) return

    const mat = mesh.material

    if (props.color !== undefined) mat.color.set(props.color)
    if (props.emissive !== undefined) mat.emissive.set(props.emissive)
    if (props.metalness !== undefined) mat.metalness = props.metalness
    if (props.roughness !== undefined) mat.roughness = props.roughness
    if (props.opacity !== undefined) {
      mat.opacity = props.opacity
      mat.transparent = props.opacity < 1
    }
    if (props.transparent !== undefined) mat.transparent = props.transparent
    if (props.wireframe !== undefined) mat.wireframe = props.wireframe
    if (props.emissiveIntensity !== undefined) mat.emissiveIntensity = props.emissiveIntensity

    mat.needsUpdate = true
  }, [selId])

  // ── Apply a full material preset to selected mesh ─────────
  const applyMaterialPreset = useCallback((presetName, meshId) => {
    const preset = MATERIALS_LIST[presetName]
    if (!preset) return
    updateMaterial(meshId, {
      color: preset.color,
      emissive: preset.emissive,
      metalness: preset.metalness,
      roughness: preset.roughness,
      opacity: preset.opacity ?? 1,
      transparent: !!preset.transparent,
    })
    setMaterial(presetName)
  }, [updateMaterial])

  // ── Update scene lights ─────────────────────────────────────
  const updateLight = useCallback((type, props = {}) => {
    const T = THREE
    if (!T) return
    const lights = lightsRef.current

    switch (type) {
      case 'ambient': {
        const l = lights.ambient
        if (!l) return
        if (props.color !== undefined) l.color.set(props.color)
        if (props.intensity !== undefined) l.intensity = props.intensity
        break
      }
      case 'directional': {
        const l = lights.dir
        if (!l) return
        if (props.color !== undefined) l.color.set(props.color)
        if (props.intensity !== undefined) l.intensity = props.intensity
        if (props.x !== undefined) l.position.x = props.x
        if (props.y !== undefined) l.position.y = props.y
        if (props.z !== undefined) l.position.z = props.z
        break
      }
      case 'fillA':
      case 'fillB': {
        const l = lights[type]
        if (!l) return
        if (props.color !== undefined) l.color.set(props.color)
        if (props.intensity !== undefined) l.intensity = props.intensity
        if (props.x !== undefined) l.position.x = props.x
        if (props.y !== undefined) l.position.y = props.y
        if (props.z !== undefined) l.position.z = props.z
        break
      }
      case 'preset': {
        // props = { ambient, dirX, dirY, dirZ, color, intensity }
        if (lights.ambient && props.ambient !== undefined) lights.ambient.intensity = props.ambient
        if (lights.dir) {
          if (props.color !== undefined) lights.dir.color.set(props.color)
          if (props.intensity !== undefined) lights.dir.intensity = props.intensity
          if (props.dirX !== undefined) lights.dir.position.x = props.dirX
          if (props.dirY !== undefined) lights.dir.position.y = props.dirY
          if (props.dirZ !== undefined) lights.dir.position.z = props.dirZ
        }
        break
      }
      default:
        break
    }
  }, [])

  // ── Update camera ────────────────────────────────────────────
  const updateCamera = useCallback((props = {}) => {
    const camera = cameraRef.current
    if (!camera) return

    let changed = false
    if (props.fov !== undefined)  { camera.fov  = props.fov;  changed = true }
    if (props.near !== undefined) { camera.near = props.near; changed = true }
    if (props.far !== undefined)  { camera.far  = props.far;  changed = true }
    if (changed) camera.updateProjectionMatrix()

    if (props.position) {
      camera.position.set(props.position.x, props.position.y, props.position.z)
    }
    if (props.lookAt) {
      camera.lookAt(props.lookAt.x, props.lookAt.y, props.lookAt.z)
      orbitRef.current?.target.set(props.lookAt.x, props.lookAt.y, props.lookAt.z)
    }
    if (props.preset) {
      const PRESET_POS = {
        'Front': { x:0,  y:2,  z:10 },
        'Side':  { x:10, y:2,  z:0  },
        'Top':   { x:0,  y:12, z:0.01 },
        'Iso':   { x:8,  y:8,  z:8  },
      }
      const p = PRESET_POS[props.preset]
      if (p) {
        camera.position.set(p.x, p.y, p.z)
        camera.lookAt(0, 0, 0)
        orbitRef.current?.target.set(0, 0, 0)
      }
    }
    orbitRef.current?.update()
  }, [])

  useImperativeHandle(ref, () => ({
    addObject, selectObject, togglePlay, triggerExplosion,
    deleteSelected, updateBody,
    updateMaterial, applyMaterialPreset, updateLight, updateCamera,
    getSelectedBody: () => selId ? bodyMapRef.current[selId] : null,
    getSelectedMesh: () => selId ? meshMapRef.current[selId] : null,
    getMesh: (id) => meshMapRef.current[id],
    getWorld: () => worldRef.current,
    getScene: () => sceneRef.current,
    getCamera: () => cameraRef.current,
    getRenderer: () => rendererRef.current,
    getMeshMap: () => meshMapRef.current,
    getBodyMap: () => bodyMapRef.current,
    getThree: () => THREE,
    getObjects: () => objects,
    getLights: () => lightsRef.current,
    getAnimationController: () => procAnimRef.current,
    // Procedural animations (orbit/bounce/spin/float/path/camera fly-through)
    addAnimation: (type, opts) => procAnimRef.current.create(type, opts),
    removeAnimation: (id) => procAnimRef.current.remove(id),
    removeAnimationsForTarget: (targetId) => procAnimRef.current.removeForTarget(targetId),
    getAnimations: () => Array.from(procAnimRef.current.animations.values()),
    getAnimationsForTarget: (targetId) => procAnimRef.current.getForTarget(targetId),
    clearAnimations: () => procAnimRef.current.clear(),
    resetAnimations: () => procAnimRef.current.resetAll(),
  }), [addObject, selectObject, togglePlay, triggerExplosion, deleteSelected, updateBody,
       updateMaterial, applyMaterialPreset, updateLight, updateCamera, selId, objects])

  return (
    <div className="vp3-container" style={style}>
      {/* Three.js canvas mount */}
      <div ref={mountRef} className="vp3-canvas-mount"/>

      {/* Overlay controls */}
      <div className="vp3-overlay">
        {/* Top toolbar (desktop) */}
        <div className="vp3-toolbar">
          <div className="vp3-add-btns">
            {Object.keys(OBJECT_TEMPLATES).map(name => (
              <button key={name} className="vp3-add-btn" onClick={() => addObject(name)}>
                {name}
              </button>
            ))}
          </div>
          <div className="vp3-toolbar-right">
            <select className="vp3-mat-select" value={material} onChange={e=>setMaterial(e.target.value)}>
              {Object.keys(MATERIALS_LIST).map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <button
              className={`vp3-play-btn ${isPlaying ? 'playing' : ''}`}
              onClick={togglePlay}
            >
              {isPlaying ? '⏸ Pause' : '▶ Simulate'}
            </button>
            <button className="vp3-explode-btn" onClick={() => triggerExplosion()}>
              💥
            </button>
          </div>
        </div>

        {/* Mobile floating Add Object button */}
        <button className="vp3-fab-add" onClick={() => setAddSheetOpen(true)} aria-label="Add object">
          ➕
        </button>

        {/* Mobile bottom sheet: object templates + material + actions */}
        {addSheetOpen && (
          <div className="vp3-sheet-backdrop" onClick={() => setAddSheetOpen(false)}>
            <div className="vp3-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="vp3-sheet-handle"/>
              <div className="vp3-sheet-title">Add Object</div>
              <div className="vp3-sheet-grid">
                {Object.keys(OBJECT_TEMPLATES).map(name => (
                  <button key={name} className="vp3-sheet-btn"
                    onClick={() => { addObject(name); setAddSheetOpen(false) }}>
                    {name}
                  </button>
                ))}
              </div>

              <div className="vp3-sheet-title">Material</div>
              <div className="vp3-sheet-grid">
                {Object.keys(MATERIALS_LIST).map(m => (
                  <button key={m}
                    className={`vp3-sheet-btn ${material===m?'active':''}`}
                    onClick={() => setMaterial(m)}>
                    {m}
                  </button>
                ))}
              </div>

              <div className="vp3-sheet-actions">
                <button className={`vp3-play-btn ${isPlaying ? 'playing' : ''}`}
                  onClick={() => { togglePlay(); setAddSheetOpen(false) }}>
                  {isPlaying ? '⏸ Pause' : '▶ Simulate'}
                </button>
                <button className="vp3-explode-btn" onClick={() => { triggerExplosion(); setAddSheetOpen(false) }}>
                  💥
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Object list */}
        {objects.length > 0 && (
          <div className="vp3-object-list">
            {objects.map(obj => (
              <div
                key={obj.id}
                className={`vp3-obj-item ${selId===obj.id?'selected':''}`}
                onClick={() => selectObject(obj.id)}
              >
                <span className="vp3-obj-icon">
                  {obj.isStatic ? '🔒' : '🔷'}
                </span>
                <span className="vp3-obj-name">{obj.name}</span>
                {selId===obj.id && (
                  <button className="vp3-del-btn" onClick={(e)=>{e.stopPropagation();deleteSelected()}}>✕</button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Status */}
        {!isReady && (
          <div className="vp3-loading">
            <div className="vp3-spinner"/>
            <span>Loading 3D Engine...</span>
          </div>
        )}
      </div>
    </div>
  )
})

export default Viewport3D
                                            
