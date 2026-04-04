"use client"

import { useEffect, useRef, useCallback } from "react"

interface WebGLBackgroundProps {
  dominantColor?: "black" | "cyan" | "amber" | "green"
}

const COLORS = {
  black: [0.024, 0.024, 0.039],
  cyan: [0.024, 0.714, 0.831],
  amber: [0.984, 0.573, 0.235],
  green: [0.204, 0.827, 0.600],
} as const

const vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`

const fragmentShaderSource = `
  #ifdef GL_ES
  precision highp float;
  #endif

  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec2 u_mouse;
  uniform vec2 u_mouseVelocity;
  uniform vec3 u_dominantColor;
  uniform float u_colorBlend;

  // Simplex noise functions
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  vec3 colorBlack = vec3(0.024, 0.024, 0.039);
  vec3 colorCyan = vec3(0.024, 0.714, 0.831);
  vec3 colorAmber = vec3(0.984, 0.573, 0.235);

  float calculateInfluence(vec2 uv, vec2 blobPos, float radius) {
    float dist = distance(uv, blobPos);
    return 1.0 - smoothstep(0.0, radius, dist);
  }

  vec2 applyMouseDistortion(vec2 uv, vec2 mousePos, vec2 velocity) {
    float dist = distance(uv, mousePos);
    float effectRadius = 0.3;
    
    if (dist < effectRadius) {
      float strength = 1.0 - smoothstep(0.0, effectRadius, dist);
      strength *= length(velocity) * 8.0;
      strength = clamp(strength, 0.0, 0.15);
      
      vec2 direction = normalize(uv - mousePos);
      uv += direction * strength;
    }
    
    return uv;
  }

  vec3 applyMouseGlow(vec3 color, vec2 uv, vec2 mousePos) {
    float dist = distance(uv, mousePos);
    float glowRadius = 0.25;
    
    if (dist < glowRadius) {
      float glow = 1.0 - smoothstep(0.0, glowRadius, dist);
      glow = pow(glow, 2.0);
      float brighten = 1.0 + (glow * 0.15);
      color *= brighten;
    }
    
    return color;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    
    // Apply mouse distortion
    vec2 mousePos = u_mouse;
    mousePos.y = 1.0 - mousePos.y; // Flip Y for WebGL coords
    uv = applyMouseDistortion(uv, mousePos, u_mouseVelocity);
    
    // Calculate animated blob positions using noise
    float time = u_time * 0.0008;
    
    vec2 blob1Pos = vec2(0.2, 0.3) + vec2(
      snoise(vec2(time, 0.0)) * 0.3,
      snoise(vec2(0.0, time)) * 0.3
    );
    vec2 blob2Pos = vec2(0.6, 0.6) + vec2(
      snoise(vec2(time + 100.0, 50.0)) * 0.3,
      snoise(vec2(50.0, time + 100.0)) * 0.3
    );
    vec2 blob3Pos = vec2(0.8, 0.2) + vec2(
      snoise(vec2(time + 200.0, 100.0)) * 0.3,
      snoise(vec2(100.0, time + 200.0)) * 0.3
    );
    
    // Calculate influences
    float inf1 = calculateInfluence(uv, blob1Pos, 0.5);
    float inf2 = calculateInfluence(uv, blob2Pos, 0.45);
    float inf3 = calculateInfluence(uv, blob3Pos, 0.4);
    
    // Normalize
    float total = inf1 + inf2 + inf3 + 0.001;
    inf1 /= total;
    inf2 /= total;
    inf3 /= total;
    
    // Base color blend
    vec3 baseColor = colorBlack * inf1 + colorCyan * inf2 + colorAmber * inf3;
    
    // Apply dominant color morphing
    vec3 finalColor = mix(baseColor, u_dominantColor, u_colorBlend * 0.4);
    
    // Apply mouse glow
    finalColor = applyMouseGlow(finalColor, uv, mousePos);
    
    // Add subtle noise for texture
    float noise = snoise(uv * 200.0 + u_time * 0.01) * 0.02;
    finalColor += noise;
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) return null
  
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  
  return shader
}

function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
  const program = gl.createProgram()
  if (!program) return null
  
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(program))
    gl.deleteProgram(program)
    return null
  }
  
  return program
}

export function WebGLBackground({ dominantColor = "black" }: WebGLBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const mousePrevRef = useRef({ x: 0.5, y: 0.5 })
  const velocityRef = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number | undefined>(undefined)
  const colorBlendRef = useRef(0)
  const targetColorRef = useRef(dominantColor)
  const currentColorRef = useRef(COLORS[dominantColor])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mousePrevRef.current = { ...mouseRef.current }
    mouseRef.current = {
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight,
    }
    velocityRef.current = {
      x: mouseRef.current.x - mousePrevRef.current.x,
      y: mouseRef.current.y - mousePrevRef.current.y,
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext("webgl", { 
      alpha: false, 
      antialias: false,
      powerPreference: "high-performance" 
    })
    if (!gl) {
      console.error("WebGL not supported")
      return
    }

    // Create shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
    if (!vertexShader || !fragmentShader) return

    const program = createProgram(gl, vertexShader, fragmentShader)
    if (!program) return

    // Set up geometry
    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1, 1, -1, -1, 1,
      -1, 1, 1, -1, 1, 1,
    ]), gl.STATIC_DRAW)

    const positionLocation = gl.getAttribLocation(program, "a_position")
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution")
    const timeLocation = gl.getUniformLocation(program, "u_time")
    const mouseLocation = gl.getUniformLocation(program, "u_mouse")
    const mouseVelocityLocation = gl.getUniformLocation(program, "u_mouseVelocity")
    const dominantColorLocation = gl.getUniformLocation(program, "u_dominantColor")
    const colorBlendLocation = gl.getUniformLocation(program, "u_colorBlend")

    function resize() {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      gl!.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener("resize", resize)
    window.addEventListener("mousemove", handleMouseMove)

    let startTime = performance.now()

    function render() {
      if (!gl || !canvas) return
      
      const currentTime = (performance.now() - startTime) * 0.5

      // Smooth color transition
      const targetColor = COLORS[targetColorRef.current]
      currentColorRef.current = (currentColorRef.current.map((c, i) => 
        c + (targetColor[i] - c) * 0.02
      ) as any)
      
      // Update color blend
      if (colorBlendRef.current < 1) {
        colorBlendRef.current = Math.min(1, colorBlendRef.current + 0.01)
      }

      gl.useProgram(program)
      
      gl.enableVertexAttribArray(positionLocation)
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

      gl.uniform2f(resolutionLocation, canvas.width, canvas.height)
      gl.uniform1f(timeLocation, currentTime)
      gl.uniform2f(mouseLocation, mouseRef.current.x, mouseRef.current.y)
      gl.uniform2f(mouseVelocityLocation, velocityRef.current.x, velocityRef.current.y)
      gl.uniform3fv(dominantColorLocation, currentColorRef.current)
      gl.uniform1f(colorBlendLocation, colorBlendRef.current)

      gl.drawArrays(gl.TRIANGLES, 0, 6)

      // Decay velocity
      velocityRef.current.x *= 0.95
      velocityRef.current.y *= 0.95

      animationRef.current = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [handleMouseMove])

  // Handle color changes
  useEffect(() => {
    if (targetColorRef.current !== dominantColor) {
      targetColorRef.current = dominantColor
      colorBlendRef.current = 0
    }
  }, [dominantColor])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10"
      style={{ background: "#06060A" }}
    />
  )
}
