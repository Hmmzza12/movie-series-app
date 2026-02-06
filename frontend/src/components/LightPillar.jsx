import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Color, AdditiveBlending } from 'three';

const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;
void main() {
  vUv = uv;
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
varying vec3 vPosition;
uniform float uTime;
uniform vec3 uTopColor;
uniform vec3 uBottomColor;
uniform float uPillarWidth;
uniform float uPillarHeight;
uniform float uGlowAmount;
uniform float uNoiseIntensity;

// Simple noise function
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
    // Gradient from bottom to top
    float gradient = smoothstep(0.0, uPillarHeight, vUv.y);
    
    // Horizontal fade for pillar shape (cylinder-like fade)
    float horizFade = 1.0 - abs(vUv.x - 0.5) * 2.0 / uPillarWidth;
    horizFade = smoothstep(0.0, 0.2, horizFade);

    // Noise effect
    float n = noise(vUv * 10.0 + vec2(0.0, uTime * 0.5));
    float noiseEffect = mix(1.0, n, uNoiseIntensity);

    // Color mixing
    vec3 color = mix(uBottomColor, uTopColor, vUv.y);
    
    // Core glow
    float glow = 1.0 / (abs(vUv.x - 0.5) * 20.0 + 0.1) * uGlowAmount;
    
    // Final alpha
    float alpha = horizFade * gradient * noiseEffect;
    alpha += glow; // Additive glow
    
    // Clamp alpha
    alpha = clamp(alpha, 0.0, 1.0);

    gl_FragColor = vec4(color, alpha);
}
`;

const LightPillarMesh = ({
    topColor,
    bottomColor,
    pillarWidth,
    pillarHeight,
    glowAmount,
    noiseIntensity,
    rotationSpeed,
    intensity
}) => {
    const mesh = useRef();
    const { viewport } = useThree();

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uTopColor: { value: new Color(topColor) },
        uBottomColor: { value: new Color(bottomColor) },
        uPillarWidth: { value: pillarWidth },
        uPillarHeight: { value: pillarHeight },
        uGlowAmount: { value: glowAmount * 10.0 }, // Scale up for visibility
        uNoiseIntensity: { value: noiseIntensity }
    }), [topColor, bottomColor, pillarWidth, pillarHeight, glowAmount, noiseIntensity]);

    useFrame((state, delta) => {
        if (mesh.current) {
            mesh.current.material.uniforms.uTime.value += delta;
            mesh.current.rotation.y += rotationSpeed * delta;
        }
    });

    return (
        <mesh ref={mesh} scale={[viewport.width, viewport.height, 1]}>
            <planeGeometry args={[1, 1, 32, 32]} />
            <shaderMaterial
                uniforms={uniforms}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                transparent={true}
                blending={AdditiveBlending}
                depthWrite={false}
            />
        </mesh>
    );
};

const LightPillar = ({
    topColor = "#5227FF",
    bottomColor = "#FF9FFC",
    intensity = 1,
    rotationSpeed = 0.3,
    interactive = false, // Not used in this simple implementation
    glowAmount = 0.005,
    pillarWidth = 3,
    pillarHeight = 0.4,
    noiseIntensity = 0.5,
    pillarRotation = 0
}) => {
    return (
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
            {/* Background color wrapper if needed, but we want transparent */}
            <LightPillarMesh
                topColor={topColor}
                bottomColor={bottomColor}
                pillarWidth={pillarWidth}
                pillarHeight={pillarHeight}
                glowAmount={glowAmount}
                noiseIntensity={noiseIntensity}
                rotationSpeed={rotationSpeed}
                intensity={intensity}
            />
        </Canvas>
    );
};

export default LightPillar;
