
import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Color } from 'three';

const vertexShader = `
varying vec2 vUv;
void main() {
vUv = uv;
gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uAngle;
uniform float uNoise;
uniform float uBlindCount;
uniform float uBlindMinWidth;
uniform bool uMirror;
uniform float uSpotlightRadius;
uniform float uSpotlightSoftness;
uniform float uSpotlightOpacity;
uniform float uDistortAmount;
uniform vec2 uMouse;
uniform float uMouseDampening;

// Random function
float random(vec2 st) {
return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

// 2D Noise
float noise(vec2 st) {
vec2 i = floor(st);
vec2 f = fract(st);

// Four corners in 2D of a tile
float a = random(i);
float b = random(i + vec2(1.0, 0.0));
float c = random(i + vec2(0.0, 1.0));
float d = random(i + vec2(1.0, 1.0));

vec2 u = f * f * (3.0 - 2.0 * f);

return mix(a, b, u.x) +
(c - a)* u.y * (1.0 - u.x) +
(d - b) * u.x * u.y;
}

void main() {
// Rotation
float s = sin(uAngle);
float c = cos(uAngle);
mat2 rot = mat2(c, -s, s, c);
vec2 rotUv = (vUv - 0.5) * rot + 0.5;

// Mirror gradient
vec2 gradUv = rotUv;
if(uMirror) {
gradUv.x = abs(gradUv.x - 0.5) * 2.0;
}

// Blinds pattern
float blinds = fract(gradUv.y * uBlindCount);
float blindWidth = smoothstep(0.0, 0.1, blinds) * smoothstep(1.0, 0.9, blinds);

// Base Gradient
vec3 color = mix(uColor1, uColor2, gradUv.x);

// Add noise
float n = noise(vUv * 10.0 + uTime * 0.1);
color += (n - 0.5) * uNoise;

// Mouse interaction (spotlight)
float dist = distance(vUv, uMouse);
float spot = smoothstep(uSpotlightRadius, uSpotlightRadius - uSpotlightSoftness, dist);
color += vec3(1.0) * spot * uSpotlightOpacity;

 gl_FragColor = vec4(color, 1.0);
}
`;

const GradientBlindsPlane = ({ uniforms }) => {
    const mesh = useRef();
    const { viewport, mouse } = useThree();

    useFrame((state) => {
        if (mesh.current) {
            mesh.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
            // Lerp mouse
            mesh.current.material.uniforms.uMouse.value.lerp(mouse, uniforms.uMouseDampening.value);
        }
    });

    return (
        <mesh ref={mesh} scale={[viewport.width, viewport.height, 1]}>
            <planeGeometry args={[1, 1]} />
            <shaderMaterial
                uniforms={uniforms}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
            />
        </mesh>
    );
};

const GradientBlinds = ({
    gradientColors = ["#FF9FFC", "#5227FF"],
    angle = 0,
    noise = 0.3,
    blindCount = 16,
    blindMinWidth = 60,
    mouseDampening = 0.15,
    mirrorGradient = false, // Not using mirror, linear gradient
    spotlightRadius = 0.5,
    spotlightSoftness = 1,
    spotlightOpacity = 1,
    distortAmount = 0,
    shineDirection = "left"
}) => {
    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uColor1: { value: new Color(gradientColors[0]) },
        uColor2: { value: new Color(gradientColors[1]) },
        uAngle: { value: (angle * Math.PI) / 180 },
        uNoise: { value: noise },
        uBlindCount: { value: blindCount },
        uBlindMinWidth: { value: blindMinWidth },
        uMirror: { value: mirrorGradient },
        uSpotlightRadius: { value: spotlightRadius },
        uSpotlightSoftness: { value: spotlightSoftness },
        uSpotlightOpacity: { value: spotlightOpacity },
        uDistortAmount: { value: distortAmount },
        uMouse: { value: [0, 0] },
        uMouseDampening: { value: mouseDampening }
    }), [gradientColors, angle, noise, blindCount, blindMinWidth, mirrorGradient, spotlightRadius, spotlightSoftness, spotlightOpacity, distortAmount, mouseDampening]);

    return (
        <Canvas>
            <GradientBlindsPlane uniforms={uniforms} />
        </Canvas>
    );
};

export default GradientBlinds;
