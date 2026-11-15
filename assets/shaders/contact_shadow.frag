#version 140

in vec2 v_uv;
out vec4 fragColor;

void main() {
    vec2 pos = v_uv - vec2(0.5);
    float dist = length(pos) * 2.0;
    
    // Soft quadratic falloff shadow disc
    float shadow = clamp(1.0 - dist, 0.0, 1.0);
    float alpha = pow(shadow, 1.8) * 0.55;
    
    fragColor = vec4(0.04, 0.06, 0.08, alpha);
}
