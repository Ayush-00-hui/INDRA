#version 140

uniform mat4 p3d_ModelViewProjectionMatrix;
uniform mat4 p3d_ModelViewMatrix;

in vec4 p3d_Vertex;
in vec3 p3d_Normal;

out vec3 v_view_normal;
out vec3 v_view_pos;
out vec3 v_world_pos;

void main() {
    gl_Position = p3d_ModelViewProjectionMatrix * p3d_Vertex;
    vec4 view_p = p3d_ModelViewMatrix * p3d_Vertex;
    v_view_pos = view_p.xyz;
    v_view_normal = normalize((p3d_ModelViewMatrix * vec4(p3d_Normal, 0.0)).xyz);
    v_world_pos = p3d_Vertex.xyz;
}
