import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { useTheme } from '../context/ThemeContext'
import '../style/ThreeHeroMesh.css'

export default function ThreeHeroMesh() {
  const mountRef = useRef(null)
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [wireframe, setWireframe] = useState(false)
  const [geoIndex, setGeoIndex] = useState(0)

  const geometriesRef = useRef([])
  const currentMeshRef = useRef(null)

  const geoNames = ['Torus Minimal', 'Icosahedron', 'Dodecahedron', 'Sphere Studio']

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const width = container.clientWidth || 340
    const height = container.clientHeight || 340

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(0, 0, 4.6)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.innerHTML = ''
    container.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.enableZoom = false
    controls.autoRotate = true
    controls.autoRotateSpeed = 1.4

    // Clean Studio Lighting (Neutral, Natural)
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 1.0 : 1.4)
    scene.add(ambientLight)

    const dirLight1 = new THREE.DirectionalLight(0xffffff, isDark ? 2.2 : 1.8)
    dirLight1.position.set(4, 5, 4)
    scene.add(dirLight1)

    const dirLight2 = new THREE.DirectionalLight(0xffffff, isDark ? 1.2 : 0.8)
    dirLight2.position.set(-4, -3, -2)
    scene.add(dirLight2)

    // 4 Clean geometric shapes
    const g1 = new THREE.TorusKnotGeometry(1.05, 0.32, 128, 32)
    const g2 = new THREE.IcosahedronGeometry(1.35, 1)
    const g3 = new THREE.DodecahedronGeometry(1.35, 0)
    const g4 = new THREE.SphereGeometry(1.3, 32, 32)
    geometriesRef.current = [g1, g2, g3, g4]

    // Matte Ceramic / Aluminum material (Clean, Non-cheesy)
    const material = new THREE.MeshStandardMaterial({
      color: isDark ? 0xd4d4d8 : 0x27272a,
      roughness: 0.35,
      metalness: isDark ? 0.2 : 0.1,
      wireframe: wireframe,
    })

    const mesh = new THREE.Mesh(geometriesRef.current[geoIndex], material)
    scene.add(mesh)
    currentMeshRef.current = mesh

    let frameId
    const animate = () => {
      frameId = requestAnimationFrame(animate)
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
      geometriesRef.current.forEach(g => g.dispose())
      material.dispose()
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [isDark])

  useEffect(() => {
    if (currentMeshRef.current && geometriesRef.current[geoIndex]) {
      currentMeshRef.current.geometry = geometriesRef.current[geoIndex]
    }
  }, [geoIndex])

  useEffect(() => {
    if (currentMeshRef.current) {
      currentMeshRef.current.material.wireframe = wireframe
    }
  }, [wireframe])

  return (
    <div className="three-hero-clean-frame">
      <div ref={mountRef} className="three-hero-canvas-mount" />

      {/* Clean Minimal Controls */}
      <div className="three-hero-clean-controls">
        <button
          type="button"
          className="clean-pill-btn"
          onClick={() => setGeoIndex((prev) => (prev + 1) % geoNames.length)}
        >
          {geoNames[geoIndex]}
        </button>

        <button
          type="button"
          className={`clean-pill-btn ${wireframe ? 'active' : ''}`}
          onClick={() => setWireframe((prev) => !prev)}
        >
          {wireframe ? 'Wireframe' : 'Solid'}
        </button>
      </div>

      <span className="three-hero-hint">Drag untuk rotasi 360°</span>
    </div>
  )
}
