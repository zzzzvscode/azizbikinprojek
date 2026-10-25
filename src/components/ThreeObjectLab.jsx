import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { Play, Pause, Layers, Eye } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import '../style/ThreeObjectLab.css'

const OBJECTS = [
  { id: 'torus', name: 'Torus Knot' },
  { id: 'crystal', name: 'Icosahedron' },
  { id: 'dodeca', name: 'Dodecahedron' },
  { id: 'ring', name: 'Particle Ring' },
]

const FINISHES = [
  { name: 'Titanium', hex: 0xd4d4d8, roughness: 0.25, metalness: 0.8 },
  { name: 'Ceramic', hex: 0xf4f4f5, roughness: 0.5, metalness: 0.05 },
  { name: 'Obsidian', hex: 0x27272a, roughness: 0.2, metalness: 0.4 },
  { name: 'Indigo', hex: 0x3b82f6, roughness: 0.3, metalness: 0.6 },
]

export default function ThreeObjectLab() {
  const mountRef = useRef(null)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const [activeObj, setActiveObj] = useState(0)
  const [activeFinish, setActiveFinish] = useState(0)
  const [wireframe, setWireframe] = useState(false)
  const [autoRotate, setAutoRotate] = useState(true)

  const controlsRef = useRef(null)
  const meshGroupRef = useRef(null)
  const materialRef = useRef(null)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const width = container.clientWidth || 500
    const height = container.clientHeight || 380

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(0, 0, 5.0)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.innerHTML = ''
    container.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.autoRotate = autoRotate
    controls.autoRotateSpeed = 1.6
    controlsRef.current = controls

    // Clean Studio lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 1.0 : 1.4)
    scene.add(ambientLight)

    const dirLight1 = new THREE.DirectionalLight(0xffffff, isDark ? 2.2 : 1.6)
    dirLight1.position.set(5, 5, 5)
    scene.add(dirLight1)

    const dirLight2 = new THREE.DirectionalLight(0xffffff, isDark ? 1.2 : 0.8)
    dirLight2.position.set(-5, -4, -3)
    scene.add(dirLight2)

    const group = new THREE.Group()
    scene.add(group)
    meshGroupRef.current = group

    const finish = FINISHES[activeFinish]
    const material = new THREE.MeshStandardMaterial({
      color: finish.hex,
      roughness: finish.roughness,
      metalness: finish.metalness,
      wireframe: wireframe,
    })
    materialRef.current = material

    buildObject(activeObj, group, material, finish.hex)

    let frameId
    const animate = () => {
      frameId = requestAnimationFrame(animate)
      controls.autoRotate = autoRotate
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(frameId)
      controls.dispose()
      renderer.dispose()
      material.dispose()
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [isDark, activeObj, activeFinish])

  function buildObject(idx, group, material, colorHex) {
    while (group.children.length > 0) {
      const child = group.children[0]
      if (child.geometry) child.geometry.dispose()
      group.remove(child)
    }

    if (idx === 0) {
      const geo = new THREE.TorusKnotGeometry(1.2, 0.38, 128, 32)
      group.add(new THREE.Mesh(geo, material))
    } else if (idx === 1) {
      const geo = new THREE.IcosahedronGeometry(1.5, 0)
      group.add(new THREE.Mesh(geo, material))
    } else if (idx === 2) {
      const geo = new THREE.DodecahedronGeometry(1.4, 0)
      group.add(new THREE.Mesh(geo, material))
    } else if (idx === 3) {
      const particleCount = 1400
      const geo = new THREE.BufferGeometry()
      const pos = new Float32Array(particleCount * 3)
      for (let i = 0; i < particleCount; i++) {
        const t = (i / particleCount) * Math.PI * 10
        const r = 1.6 + Math.sin(t * 3) * 0.3
        pos[i * 3] = Math.cos(t) * r
        pos[i * 3 + 1] = ((i / particleCount) - 0.5) * 2.5
        pos[i * 3 + 2] = Math.sin(t) * r
      }
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      const pMat = new THREE.PointsMaterial({
        color: colorHex,
        size: 0.04,
        transparent: true,
        opacity: 0.8,
      })
      group.add(new THREE.Points(geo, pMat))
    }
  }

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.wireframe = wireframe
    }
  }, [wireframe])

  return (
    <div className="clean-lab-section">
      <div className="clean-lab-header">
        <div>
          <span className="clean-section-tag">02 / 3D PLAYGROUND</span>
          <h2 className="clean-section-heading">Interactive 3D Study</h2>
        </div>
        <p className="clean-section-desc">
          Eksplorasi bentuk geometri dan material real-time berbasis Three.js.
        </p>
      </div>

      <div className="clean-lab-canvas-card">
        {/* Model Tabs */}
        <div className="clean-lab-tabs">
          {OBJECTS.map((obj, i) => (
            <button
              key={obj.id}
              type="button"
              className={`clean-tab-pill ${activeObj === i ? 'active' : ''}`}
              onClick={() => setActiveObj(i)}
            >
              {obj.name}
            </button>
          ))}
        </div>

        {/* Viewport Canvas */}
        <div ref={mountRef} className="clean-lab-mount" />

        {/* Bottom Clean Toolbar */}
        <div className="clean-lab-toolbar">
          <button
            type="button"
            className="clean-tool-btn"
            onClick={() => setAutoRotate(prev => !prev)}
            aria-label="Toggle Rotation"
          >
            {autoRotate ? <Pause size={14} /> : <Play size={14} />}
            <span>{autoRotate ? 'Pause' : 'Play'}</span>
          </button>

          <button
            type="button"
            className={`clean-tool-btn ${wireframe ? 'active' : ''}`}
            onClick={() => setWireframe(prev => !prev)}
          >
            <Layers size={14} />
            <span>Wireframe</span>
          </button>

          {/* Finish selector */}
          <div className="clean-finish-selector">
            {FINISHES.map((f, i) => (
              <button
                key={f.name}
                type="button"
                className={`finish-circle ${activeFinish === i ? 'active' : ''}`}
                style={{ backgroundColor: '#' + f.hex.toString(16).padStart(6, '0') }}
                onClick={() => setActiveFinish(i)}
                title={f.name}
              />
            ))}
          </div>

          <span className="clean-drag-note">
            <Eye size={12} /> Drag 360°
          </span>
        </div>
      </div>
    </div>
  )
}
