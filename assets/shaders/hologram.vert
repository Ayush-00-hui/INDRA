#version 140

uniform mat4 p3d_ModelViewProjectionMatrix;
uniform mat4 p3d_ModelMatrix;

in vec4 p3d_Vertex;
in vec3 p3d_Normal;

out vec3 v_world_normal;
out vec3 v_world_pos;

void main() {
    gl_Position = p3d_ModelViewProjectionMatrix * p3d_Vertex;
    v_world_pos = (p3d_ModelMatrix * p3d_Vertex).xyz;
    v_world_normal = normalize((p3d_ModelMatrix * vec4(p3d_Normal, 0.0)).xyz);
}
