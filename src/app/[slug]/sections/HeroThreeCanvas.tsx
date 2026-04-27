'use client'
import { useEffect, useRef } from 'react'
import type * as THREE from 'three'

interface Props {
  effect:       'particles' | 'waves' | 'volumetric'
  intensity:    number   // 0-100
  primaryColor: string
}

export default function HeroThreeCanvas({ effect, intensity, primaryColor }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let disposed  = false
    let rafId:    number
    let cleanupFn: (() => void) | null = null

    ;(async () => {
      const THREE = await import('three')
      if (disposed || !canvas) return

      const w = canvas.offsetWidth  || window.innerWidth
      const h = canvas.offsetHeight || window.innerHeight

      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false })
      renderer.setSize(w, h)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))

      const scene  = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000)
      camera.position.z = 5

      const color       = new THREE.Color(primaryColor)
      const norm        = Math.max(0, Math.min(100, intensity)) / 100
      let   updateFn: (t: number) => void = () => {}

      // ── Effect: waves ──────────────────────────────────────────
      if (effect === 'waves') {
        camera.position.set(0, 3, 6)
        camera.lookAt(0, 0, 0)

        const geo = new THREE.PlaneGeometry(18, 18, 80, 80)
        const mat = new THREE.MeshBasicMaterial({
          color, wireframe: true, transparent: true,
          opacity: 0.07 + norm * 0.16,
        })
        const mesh = new THREE.Mesh(geo, mat)
        mesh.rotation.x = -Math.PI / 2.5
        scene.add(mesh)

        const pos   = geo.attributes.position as THREE.BufferAttribute
        const origY = new Float32Array(pos.count)
        for (let i = 0; i < pos.count; i++) origY[i] = pos.getY(i)

        updateFn = (t: number) => {
          for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i)
            const z = pos.getZ(i)
            pos.setY(i, origY[i]
              + Math.sin(x * 1.1 + t * 0.7) * (0.25 + norm * 0.55)
              + Math.cos(z * 0.9 + t * 0.5) * (0.18 + norm * 0.35))
          }
          pos.needsUpdate = true
          mesh.rotation.z = Math.sin(t * 0.15) * 0.03
        }

      // ── Effect: volumetric ─────────────────────────────────────
      } else if (effect === 'volumetric') {
        scene.fog = new THREE.FogExp2(0x000000, 0.06)
        camera.position.set(0, 2, 7)
        camera.lookAt(0, -1, 0)

        const beamCount = 6
        const beams: THREE.Mesh[] = []
        for (let i = 0; i < beamCount; i++) {
          const angle = (i / beamCount) * Math.PI * 2
          const r     = 2.8 + (i % 2) * 1.2
          const geo   = new THREE.CylinderGeometry(0.015, 0.45, 8, 6, 1, true)
          const mat   = new THREE.MeshBasicMaterial({
            color, transparent: true,
            opacity: 0.05 + norm * 0.14,
            side: THREE.DoubleSide,
          })
          const beam = new THREE.Mesh(geo, mat)
          beam.position.set(Math.cos(angle) * r, 0.5, Math.sin(angle) * r)
          beam.rotation.z = (Math.random() - 0.5) * 0.3
          scene.add(beam)
          beams.push(beam)
        }

        const pcount = 180 + Math.round(norm * 220)
        const ppos   = new Float32Array(pcount * 3)
        for (let i = 0; i < pcount; i++) {
          ppos[i * 3]     = (Math.random() - 0.5) * 12
          ppos[i * 3 + 1] = Math.random() * 4 - 3.5
          ppos[i * 3 + 2] = (Math.random() - 0.5) * 12
        }
        const pgeo = new THREE.BufferGeometry()
        pgeo.setAttribute('position', new THREE.BufferAttribute(ppos, 3))
        const pmat = new THREE.PointsMaterial({ color, size: 0.035, transparent: true, opacity: 0.35 + norm * 0.4 })
        scene.add(new THREE.Points(pgeo, pmat))

        updateFn = (t: number) => {
          beams.forEach((b, i) => {
            b.rotation.y = t * 0.12 * (i % 2 === 0 ? 1 : -1)
          })
        }

      // ── Effect: particles (default) ────────────────────────────
      } else {
        const count  = 220 + Math.round(norm * 280)
        const ppos   = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
          ppos[i * 3]     = (Math.random() - 0.5) * 22
          ppos[i * 3 + 1] = (Math.random() - 0.5) * 16
          ppos[i * 3 + 2] = (Math.random() - 0.5) * 8
        }
        const geo = new THREE.BufferGeometry()
        geo.setAttribute('position', new THREE.BufferAttribute(ppos, 3))
        const mat = new THREE.PointsMaterial({
          color, size: 0.045 + norm * 0.07, transparent: true, opacity: 0.55 + norm * 0.35,
        })
        const points = new THREE.Points(geo, mat)
        scene.add(points)

        // Connection lines
        const lineGeo = new THREE.BufferGeometry()
        const linePos = new Float32Array(count * count * 6)
        lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3))
        const lineMat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.06 + norm * 0.08 })
        scene.add(new THREE.LineSegments(lineGeo, lineMat))

        updateFn = (t: number) => {
          points.rotation.x = t * 0.02
          points.rotation.y = t * 0.035
        }
      }

      const clock = new THREE.Clock()
      const animate = () => {
        if (disposed) return
        rafId = requestAnimationFrame(animate)
        updateFn(clock.getElapsedTime())
        renderer.render(scene, camera)
      }
      animate()

      const onResize = () => {
        const nw = canvas.offsetWidth  || window.innerWidth
        const nh = canvas.offsetHeight || window.innerHeight
        renderer.setSize(nw, nh)
        camera.aspect = nw / nh
        camera.updateProjectionMatrix()
      }
      window.addEventListener('resize', onResize)

      cleanupFn = () => {
        window.removeEventListener('resize', onResize)
        renderer.dispose()
        scene.clear()
      }
    })()

    return () => {
      disposed = true
      cancelAnimationFrame(rafId)
      cleanupFn?.()
    }
  }, [effect, intensity, primaryColor])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  )
}
