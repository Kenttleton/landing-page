class ValueNoise {
  constructor(wl = 20, amp = 1) {

    this.w = 500;
    this.h = 500;
    this.wlx = wl;
    this.wly = wl;
    this.amp = amp || 1;

    this.octaves = 1;
    this.oFactor = 2;

    this.rows = Array(this.h).fill(0).map(item => Array(this.w).fill(0).map(item => Math.random() * this.amp));

    this.interpolate = this.quadratic;
  }

  cosine(pa, pb, px) {
    const ft = px * Math.PI;
    const f = (1 - Math.cos(ft)) * 0.5;
    return pa * (1 - f) + pb * f;
  }

  cubic(pa, pb, px) {
    return px < .5 ? 4 * px ** 3 * (pb - pa) + pa : ((px - 1) * (2 * px - 2) * (2 * px - 2) + 1) * (pb - pa) + pa;
  }

  quadratic(pa, pb, px) {
    return px < .5 ? 2 * px ** 2 * (pb - pa) + pa : (-1 + (4 - 2 * px) * px) * (pb - pa) + pa;
  }

  linear(pa, pb, px) {
    return pa + (pb - pa) * px;
  }
  sawtooth() {
    
  }
  square() {
  }

  randomise() {
    this.rows = Array(this.h)
      .fill(0)
      .map(() => Array(this.w)
        .fill(0)
        .map(() => Math.random()));
  }

  gen2d(x, y, wlx, wly, amp) {
    let currx = ~~(x / wlx);
    let nextx = ~~(x / wlx) + 1;
    let curry = ~~(y / wly);
    let nexty = ~~(y / wly) + 1;

    if (y % wly === 0) {
      if (x % wlx === 0) {
        return this.rows[curry][currx] * amp;
      } else {
        return this.interpolate(this.rows[curry][currx], this.rows[curry][nextx], (x % wlx) / wlx) * amp;
      }
    } else {
      if (x % wlx === 0) {
        return this.interpolate(this.rows[curry][currx], this.rows[nexty][currx], (y % wly) / wly) * amp;
      } else {
        return this.interpolate(
          this.interpolate(this.rows[curry][currx], this.rows[nexty][currx], (y % wly) / wly) * amp, // 
          this.interpolate(this.rows[curry][nextx], this.rows[nexty][nextx], (y % wly) / wly) * amp,
          (x % wlx) / wlx
        );
      }
    }
  }

  generate(x, y = 0) {
    let ret = 0;
    let offset = 0;

    for (let i = 0; i < this.octaves; i++) {
      const amp = this.amp / this.oFactor ** i;
      const wlx = Math.max(this.wlx / this.oFactor ** i, 1);
      const wly = Math.max(this.wly / this.oFactor ** i, 1);

      // console.log(amp,wlx,wly);

      ret += this.gen2d(x, y, wlx, wly, amp);
      offset += 1 / this.oFactor ** i;
    }

    return ret / (offset);
  }
}

module.exports = ValueNoise;