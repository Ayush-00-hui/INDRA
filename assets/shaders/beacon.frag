#version 140

uniform vec4 p3d_ColorScale;

in vec2 v_uv;
out vec4 fragColor;

void main() {
    // Center at (0.5, 0.5)
    vec2 pos = v_uv - vec2(0.5);
    float dist = length(pos) * 2.0; // [0, 1]
    
    float ring = smoothstep(0.08, 0.0, abs(dist - 0.75));
    float glow = (1.0 - smoothstep(0.0, 1.0, dist));
    vec3 col = vec3(0.0, 0.95, 0.75) * (glow + ring * 1.5);
    float alpha = clamp(glow * 0.7 + ring * 0.8, 0.0, 1.0) * p3d_ColorScale.a;
    
    fragColor = vec4(col, alpha);
}
