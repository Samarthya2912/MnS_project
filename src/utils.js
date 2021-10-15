/* eslint-disable no-unused-vars */
import TRIANGULATION from './TriangulationArray';

const drawTriangle = (vertices, ctx) => { // vertices is an array of 2d array of points
    const region = new Path2D();
    region.moveTo(vertices[0][0], vertices[0][1]);

    for(let i = 1; i < vertices.length; i++) region.lineTo(vertices[i][0], vertices[i][1]);

    region.closePath();

    ctx.strokeStyle = "gray";
    ctx.stroke(region);
}

export const drawMesh = (predictions, ctx) => {
    const keypoints = predictions[0].scaledMesh;
    console.log(keypoints);

      //  Draw Triangles
      for (let i = 0; i < TRIANGULATION.length / 3; i++) {
        // Get sets of three keypoints for the triangle
        const points = [
          TRIANGULATION[i * 3],
          TRIANGULATION[i * 3 + 1],
          TRIANGULATION[i * 3 + 2],
        ].map((index) => keypoints[index]);
        //  Draw triangle
        drawTriangle(points, ctx);
      }

      // Draw Dots
      for (let i = 0; i < keypoints.length; i++) {
        const x = keypoints[i][0];
        const y = keypoints[i][1];

        ctx.beginPath();
        ctx.arc(x, y, 1 /* radius */, 0, 3 * Math.PI);
        ctx.fillStyle = "aqua";
        ctx.fill();
      }
}

