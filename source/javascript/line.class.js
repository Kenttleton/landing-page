class Line {
  constructor(vertices) {
    this.vertices = vertices;
    // canvasObject.drawLine(vertices[0], vertices[1]);
  }

  getLength() {
    const { vertices } = this;
    const v0 = vertices[0];
    const v1 = vertices[1];

    return Math.sqrt((v1.x - v0.x) ** 2 + (v1.y - v0.y) ** 2);
  }

  getMidpoint() {
    const { vertices } = this;
    const v0 = vertices[0];
    const v1 = vertices[1];

    return {
      x: (v0.x + v1.x) / 2,
      y: (v0.y + v1.y) / 2,
    };
  }

  getNormal() {
    const { vertices } = this;
    const v0 = vertices[0];
    const v1 = vertices[1];

    // the two points can not be the same
    let nx = v1.x - v0.x;  // as vector
    let ny = v1.y - v0.y;
    const len = Math.sqrt(nx * nx + ny * ny);  // length of line
    nx = nx / len;  // make one unit long
    ny = ny / len;  // which we call normalising a vector
    return [-ny, nx]; // return the normal  rotated 90 deg
  }

  getNormalLine() {
    return {
      vertices: [
        this.vertices[1],
        {
          x: this.getMidpoint().x - this.getNormal()[0] * this.getLength() * .4,
          y: this.getMidpoint().y - this.getNormal()[1] * this.getLength() * .4,
        }
      ]
    };
  }
}

module.exports = Line;