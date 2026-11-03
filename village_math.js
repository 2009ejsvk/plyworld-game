// Shared pure geometry is also used by the layout tests.
window.PLY_VILLAGE_MATH = {
  inside(x,z,p){let yes=false;for(let i=0,j=p.length-1;i<p.length;j=i++){const a=p[i],b=p[j];if((a[1]>z)!==(b[1]>z)&&x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0])yes=!yes;}return yes;},
  distance(x,z,a,b){const dx=b[0]-a[0],dz=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz||1)));return Math.hypot(x-a[0]-dx*t,z-a[1]-dz*t);},
  polygonDistance(x,z,p){if(this.inside(x,z,p))return 0;let d=Infinity;for(let i=1;i<p.length;i++)d=Math.min(d,this.distance(x,z,p[i-1],p[i]));return d;},
  inWater(m,x,z){return m.waters.some(p=>this.inside(x,z,p.outer)&&!p.holes.some(h=>this.inside(x,z,h)));},
  waterDistance(m,x,z){if(this.inWater(m,x,z))return 0;let d=Infinity;for(const p of m.waters){for(const r of [p.outer,...p.holes])for(let i=1;i<r.length;i++)d=Math.min(d,this.distance(x,z,r[i-1],r[i]));}return d;},
  rawHeight(m,x,z){let h=0;for(const [a,b,rx,rz,dy] of m.hills){const r=Math.hypot((x-a)/rx,(z-b)/rz);h+=dy*Math.max(0,1-r*r)**2;}return h;},
  heightAt(m,x,z){
    if(this.inWater(m,x,z))return -3;
    let h=this.rawHeight(m,x,z),distance=35,near=null;
    for(const v of m.slots){const b=v.footprint;if(x<b[0]-35||x>b[2]+35||z<b[1]-35||z>b[3]+35)continue;const d=this.polygonDistance(x,z,v.plot);if(d<distance){distance=d;near=v;}}
    for(const g of m.gardens||[]){if(Math.abs(x-g.x)>g.width+35||Math.abs(z-g.z)>g.depth+35)continue;const d=this.polygonDistance(x,z,g.polygon);if(d<distance){distance=d;near=g;}}
    if(near){const t=Math.min(1,Math.max(0,(distance-11)/24)),e=t*t*(3-2*t);h=near.y*(1-e)+h*e;}
    return h;
  },
  create(id){const source=window.PLY_VILLAGE_PRESETS.find(m=>m.id===id)||window.PLY_VILLAGE_PRESETS[0];return {...JSON.parse(JSON.stringify(source)),planted:[],placedProps:[]};}
};
