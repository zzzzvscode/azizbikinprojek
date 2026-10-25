import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import '../style/Splash.css'

export function LoadingScreen({ visible, progress = 0, currentAsset = '' }) {
  const mountRef = useRef(null)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000)
    camera.position.z = 4.2

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(140, 140)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.innerHTML = ''
    container.appendChild(renderer.domElement)

    // Clean, minimalist geometric cube: subtle matte wireframe + clean edges
    const group = new THREE.Group()
    scene.add(group)

    const boxGeo = new THREE.BoxGeometry(1.4, 1.4, 1.4)
    const edges = new THREE.EdgesGeometry(boxGeo)
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
    })
    const wireCube = new THREE.LineSegments(edges, edgeMat)
    group.add(wireCube)

    // Inner subtle solid core
    const innerGeo = new THREE.BoxGeometry(0.7, 0.7, 0.7)
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.12,
    })
    const innerCube = new THREE.Mesh(innerGeo, innerMat)
    group.add(innerCube)

    let frameId
    const animate = () => {
      frameId = requestAnimationFrame(animate)
      group.rotation.x += 0.008
      group.rotation.y += 0.012
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(frameId)
      renderer.dispose()
      boxGeo.dispose()
      edges.dispose()
      edgeMat.dispose()
      innerGeo.dispose()
      innerMat.dispose()
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div className={`loading-screen ${visible ? '' : 'is-hidden'}`} aria-hidden={!visible}>
      <div className="loading-clean-container">
        {/* 3D Wireframe Cube */}
        <div ref={mountRef} className="loading-cube-canvas" />

        {/* Minimalist Progress & Typography */}
        <div className="loading-status-block">
          <div className="loading-label-row">
            <span className="loading-brand">ALFARI</span>
            <span className="loading-percent">{Math.round(progress)}%</span>
          </div>

          <div className="loading-line-track">
            <div
              className="loading-line-fill"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>

          <p className="loading-asset-caption">
            {currentAsset ? `Memuat ${currentAsset}…` : 'Menyiapkan aset 3D…'}
          </p>
        </div>
      </div>
    </div>
  )
}
