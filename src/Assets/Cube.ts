import { ModelData } from "../GraphicsEngine/Model";

/*
 * A model representing a cube with the origin at the center
 */
export const CubeModelData: ModelData = {
    // use 36 vertices to represent the cube (makes texturing easier)
    vertices: [
        // Front face
        -0.5, -0.5, 0.5, // front bottom left
        0.5, -0.5, 0.5,
        0.5, 0.5, 0.5,
        -0.5, 0.5, 0.5,
        // Back face
        -0.5, -0.5, -0.5,
        0.5, -0.5, -0.5,
        0.5, 0.5, -0.5,
        -0.5, 0.5, -0.5,
        // Left face
        -0.5, -0.5, -0.5,
        -0.5, -0.5, 0.5,
        -0.5, 0.5, 0.5,
        -0.5, 0.5, -0.5,
        // Right face
        0.5, -0.5, -0.5,
        0.5, -0.5, 0.5,
        0.5, 0.5, 0.5,
        0.5, 0.5, -0.5,
        // Top face
        -0.5, 0.5, -0.5,
        0.5, 0.5, -0.5,
        0.5, 0.5, 0.5,
        -0.5, 0.5, 0.5,
        // Bottom face
        -0.5, -0.5, -0.5,
        0.5, -0.5, -0.5,
        0.5, -0.5, 0.5,
        -0.5, -0.5, 0.5,
      ],
      normals: [
        // Front face
        0.0, 0.0, 0.5,
        0.0, 0.0, 0.5,
        0.0, 0.0, 0.5,
        0.0, 0.0, 0.5,
        // Back face
        0.0, 0.0, -0.5,
        0.0, 0.0, -0.5,
        0.0, 0.0, -0.5,
        0.0, 0.0, -0.5,
        // Left face
        -0.5, 0.0, 0.0,
        -0.5, 0.0, 0.0,
        -0.5, 0.0, 0.0,
        -0.5, 0.0, 0.0,
        // Right face
        0.5, 0.0, 0.0,
        0.5, 0.0, 0.0,
        0.5, 0.0, 0.0,
        0.5, 0.0, 0.0,
        // Top face
        0.0, 0.5, 0.0,
        0.0, 0.5, 0.0,
        0.0, 0.5, 0.0,
        0.0, 0.5, 0.0,
        // Bottom face
        0.0, -0.5, 0.0,
        0.0, -0.5, 0.0,
        0.0, -0.5, 0.0,
        0.0, -0.5, 0.0,
      ],
      textureCoords: [
        // Front face
        0.0, 0.0,
        0.5, 0.0,
        0.5, 0.5,
        0.0, 0.5,
        // Back face
        0.5, 0.0,
        0.0, 0.0,
        0.0, 0.5,
        0.5, 0.5,
        // Left face
        0.0, 0.0,
        0.5, 0.0,
        0.5, 0.5,
        0.0, 0.5,
        // Right face
        0.0, 0.0,
        0.5, 0.0,
        0.5, 0.5,
        0.0, 0.5,
        // Top face
        0.0, 0.0,
        0.5, 0.0,
        0.5, 0.5,
        0.0, 0.5,
        // Bottom face
        0.0, 0.0,
        0.5, 0.0,
        0.5, 0.5,
        0.0, 0.5,
      ],
      indices: [
        0, 1, 2,   0, 2, 3,     // Front face
        4, 5, 6,   4, 6, 7,     // Back face
        8, 9, 10,  8, 10, 11,   // Left face
        12, 13, 14, 12, 14, 15, // Right face
        16, 17, 18, 16, 18, 19, // Top face
        20, 21, 22, 20, 22, 23, // Bottom face
      ],
}