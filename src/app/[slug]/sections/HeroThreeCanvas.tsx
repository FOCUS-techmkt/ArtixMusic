'use client'
import { useEffect, useRef } from 'react'
import type * as THREE from 'three'

interface Props {
  effect:       'particles' | 'waves' | 'volumetric' | 'neural' | 'polygons'
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

      // ── Effect: neural ────────────────────────────────────────
      } else if (effect === 'neural') {
        camera.position.set(0, 0, 8)
        camera.lookAt(0, 0, 0)

        const nodeCount = 60 + Math.round(norm * 80)
        const nodePosArr = new Float32Array(nodeCount * 3)
        const nodeVel    = new Float32Array(nodeCount * 3)
        for (let i = 0; i < nodeCount; i++) {
          nodePosArr[i * 3]     = (Math.random() - 0.5) * 14
          nodePosArr[i * 3 + 1] = (Math.random() - 0.5) * 10
          nodePosArr[i * 3 + 2] = (Math.random() - 0.5) * 6
          nodeVel[i * 3]        = (Math.random() - 0.5) * 0.006
          nodeVel[i * 3 + 1]    = (Math.random() - 0.5) * 0.006
          nodeVel[i * 3 + 2]    = (Math.random() - 0.5) * 0.003
        }
        const nodeGeo = new THREE.BufferGeometry()
        nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePosArr.slice(), 3))
        const nodeMat = new THREE.PointsMaterial({ color, size: 0.06 + norm * 0.06, transparent: true, opacity: 0.8 })
        scene.add(new THREE.Points(nodeGeo, nodeMat))

        const threshold   = 2.8 + norm * 1.5
        const maxLines    = nodeCount * 6
        const linePosBuf  = new Float32Array(maxLines * 6)
        const lineGeo     = new THREE.BufferGeometry()
        lineGeo.setAttribute('position', new THREE.BufferAttribute(linePosBuf, 3))
        const lineMat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.12 + norm * 0.1 })
        const lineSegs = new THREE.LineSegments(lineGeo, lineMat)
        scene.add(lineSegs)

        updateFn = () => {
          // drift nodes
          for (let i = 0; i < nodeCount; i++) {
            nodePosArr[i * 3]     += nodeVel[i * 3]
            nodePosArr[i * 3 + 1] += nodeVel[i * 3 + 1]
            nodePosArr[i * 3 + 2] += nodeVel[i * 3 + 2]
            if (Math.abs(nodePosArr[i * 3])     > 7)  nodeVel[i * 3]     *= -1
            if (Math.abs(nodePosArr[i * 3 + 1]) > 5)  nodeVel[i * 3 + 1] *= -1
            if (Math.abs(nodePosArr[i * 3 + 2]) > 3)  nodeVel[i * 3 + 2] *= -1
          }
          const nodeAttr = nodeGeo.attributes.position as THREE.BufferAttribute
          nodeAttr.array.set(nodePosArr)
          nodeAttr.needsUpdate = true

          // rebuild connections
          let lineIdx = 0
          for (let i = 0; i < nodeCount && lineIdx < maxLines - 1; i++) {
            for (let j = i + 1; j < nodeCount && lineIdx < maxLines - 1; j++) {
              const dx = nodePosArr[i*3]   - nodePosArr[j*3]
              const dy = nodePosArr[i*3+1] - nodePosArr[j*3+1]
              const dz = nodePosArr[i*3+2] - nodePosArr[j*3+2]
              if (Math.sqrt(dx*dx + dy*dy + dz*dz) < threshold) {
                linePosBuf[lineIdx*6]   = nodePosArr[i*3];   linePosBuf[lineIdx*6+1] = nodePosArr[i*3+1]; linePosBuf[lineIdx*6+2] = nodePosArr[i*3+2]
                linePosBuf[lineIdx*6+3] = nodePosArr[j*3];   linePosBuf[lineIdx*6+4] = nodePosArr[j*3+1]; linePosBuf[lineIdx*6+5] = nodePosArr[j*3+2]
                lineIdx++
              }
            }
          }
          lineGeo.setDrawRange(0, lineIdx * 2)
          const lineAttr = lineGeo.attributes.position as THREE.BufferAttribute
          lineAttr.array.set(linePosBuf)
          lineAttr.needsUpdate = true
        }

      // ── Effect: polygons ──────────────────────────────────────
      } else if (effect === 'polygons') {
        camera.position.set(0, 0, 9)
        camera.lookAt(0, 0, 0)

        const shapes: THREE.Mesh[] = []
        const configs = [
          { geo: new THREE.IcosahedronGeometry(1.2, 0),   pos: [-3, 1, -1],  speed: 0.003 },
          { geo: new THREE.OctahedronGeometry(0.9, 0),    pos: [3, -1, 0],   speed: -0.005 },
          { geo: new THREE.TetrahedronGeometry(1.0, 0),   pos: [-1, -2, 1],  speed: 0.004 },
          { geo: new THREE.IcosahedronGeometry(0.7, 0),   pos: [2, 2, -2],   speed: -0.003 },
          { geo: new THREE.OctahedronGeometry(0.55, 0),   pos: [0, 1.5, 2],  speed: 0.007 },
        ]
        configs.forEach(({ geo, pos, speed }) => {
          const mat = new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.08 + norm * 0.14 })
          const mesh = new THREE.Mesh(geo, mat)
          mesh.position.set(...(pos as [number, number, number]))
          mesh.userData.speed = speed
          scene.add(mesh)
          shapes.push(mesh)
        })

        updateFn = (t: number) => {
          shapes.forEach(m => {
            m.rotation.x = t * (m.userData.speed as number)
            m.rotation.y = t * (m.userData.speed as number) * 1.3
            m.position.y += Math.sin(t * 0.4 + m.position.x) * 0.0006
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

      const startTime = performance.now()
      const animate = () => {
        if (disposed) return
        rafId = requestAnimationFrame(animate)
        updateFn((performance.now() - startTime) / 1000)
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
