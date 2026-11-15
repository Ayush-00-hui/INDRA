#version 140

uniform float osg_FrameTime;
uniform vec4 p3d_ColorScale;

in vec2 v_uv;
out vec4 fragColor;

void main() {
    // Center at (0.5, 0.5)
    vec2 pos = v_uv - vec2(0.5);
    float dist = length(pos) * 2.0; // [0, 1]
    
    // Animated radial energy pulse wave
    float wave1 = sin(dist * 12.0 - osg_FrameTime * 4.0);
    float ring = smoothstep(0.05, 0.0, abs(dist - 0.75 + 0.1 * sin(osg_FrameTime * 3.0)));
    
    float glow = (1.0 - smoothstep(0.0, 1.0, dist)) * (0.6 + 0.4 * sin(osg_FrameTime * 2.5));
    vec3 col = vec3(0.0, 0.95, 0.75) * (glow + ring * 1.5);
    float alpha = clamp(glow * 0.7 + ring * 0.8, 0.0, 1.0) * p3d_ColorScale.a;
    
    fragColor = vec4(col, alpha);
}
