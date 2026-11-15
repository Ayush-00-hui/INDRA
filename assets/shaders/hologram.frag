#version 140

uniform vec4 p3d_ColorScale;

in vec3 v_view_normal;
in vec3 v_view_pos;
in vec3 v_world_pos;

out vec4 fragColor;

void main() {
    vec3 view_dir = normalize(-v_view_pos);
    float NdotV = max(0.0, dot(normalize(v_view_normal), view_dir));
    
    // Fresnel rim glow: strongest at grazing edges
    float fresnel = pow(1.0 - NdotV, 2.5);
    
    // Animated moving scanline pattern along Z
    float scanline = 0.8 + 0.2 * sin(v_world_pos.z * 60.0);
    
    // Base cyan holographic color
    vec3 base_color = vec3(0.0, 0.85, 1.0) * p3d_ColorScale.rgb;
    vec3 glow_color = vec3(0.4, 1.0, 0.85);
    
    vec3 final_rgb = mix(base_color, glow_color, fresnel) * scanline;
    float alpha = clamp(0.35 + fresnel * 0.65, 0.0, 1.0) * p3d_ColorScale.a;
    
    fragColor = vec4(final_rgb, alpha);
}
