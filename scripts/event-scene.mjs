import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const renderer = new THREE.WebGLRenderer({antialias:true, preserveDrawingBuffer:true});
renderer.setSize(1800,1080);renderer.setPixelRatio(1);
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
document.body.appendChild(renderer.domElement);
const scene=new THREE.Scene();scene.background=new THREE.Color('#dddeda');
const camera=new THREE.PerspectiveCamera(40,1800/1080,.1,150);
camera.position.set(19,15,24);camera.lookAt(0,1,-1.8);
scene.add(new THREE.HemisphereLight('#e7f1ff','#a49d8e',2.8));
function sun(x,y,z,color,intensity){const light=new THREE.DirectionalLight(color,intensity);light.position.set(x,y,z);light.castShadow=true;light.shadow.mapSize.set(2048,2048);Object.assign(light.shadow.camera,{left:-22,right:22,top:22,bottom:-22,near:.1,far:80});light.shadow.bias=-.0003;light.shadow.normalBias=.025;light.shadow.radius=4;scene.add(light);}
sun(4,18,8,'#fff3dc',3.3);sun(-14,10,-8,'#abcaff',1.5);
const model=new THREE.Group();scene.add(model);
const mat=(color,roughness=.75,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
const m={ivory:mat('#eee9df'),fabric:mat('#ddd5c5',.98),white:mat('#f5f2eb',.8),dark:mat('#182125',.65),steel:mat('#a8afb1',.3,.7),gold:mat('#9a8462',.4,.55),oak:mat('#8c7052',.8),floor:mat('#cecac0',.9),blue:mat('#164aba',.38,.15),black:mat('#181c1e',.9)};
function mesh(geometry,material,x,y,z,parent=model){const o=new THREE.Mesh(geometry,material);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
function box(w,h,d,x,y,z,material=m.white,parent=model,rounded=false){return mesh(rounded?new RoundedBoxGeometry(w,h,d,2,.055):new THREE.BoxGeometry(w,h,d),material,x,y,z,parent);}
function cylinder(r1,r2,h,x,y,z,material=m.steel,parent=model){return mesh(new THREE.CylinderGeometry(r1,r2,h,24),material,x,y,z,parent);}
function rod(a,b,r=.027,material=m.steel,parent=model){const A=new THREE.Vector3(...a),B=new THREE.Vector3(...b);const c=mesh(new THREE.CylinderGeometry(r,r,A.distanceTo(B),8),material,...A.clone().add(B).multiplyScalar(.5).toArray(),parent);c.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),B.sub(A).normalize());return c;}
box(29,.18,28,0,-.13,0,m.floor);
box(24,8,.25,0,3.8,-10,m.dark);
for(let x=-11.8;x<12;x+=.24) box(.06,7.7,.04,x,3.8,-9.84,m.oak);
box(17,.55,5.5,0,.25,-6.95,m.dark);
box(17,.055,5.5,0,.552,-6.95,m.white);
box(10,.19,1.1,0,.07,-3.67,m.dark);box(11,.1,.7,0,-.0,-2.8,m.white);
const blueStrip=new THREE.MeshStandardMaterial({color:'#326be0',emissive:'#2253bb',emissiveIntensity:1});
box(17,.055,.025,0,.47,-4.19,blueStrip);
box(10.7,4.85,.2,0,3.62,-9.58,m.black);
function screenTexture(){
 const c=document.createElement('canvas');c.width=1600;c.height=720;const p=c.getContext('2d');
 p.fillStyle='#142439';p.fillRect(0,0,c.width,c.height);const g=p.createLinearGradient(0,0,1600,720);g.addColorStop(0,'#092e5c');g.addColorStop(1,'#3275c6');p.fillStyle=g;p.fillRect(0,0,1600,720);
 p.strokeStyle='rgba(190,222,255,.25)';p.lineWidth=2;for(let i=-3;i<10;i++){p.beginPath();p.moveTo(i*200,0);p.lineTo(i*200+620,720);p.stroke();}
 p.fillStyle='#f2f3ed';p.font='700 135px Arial';p.fillText('TM CONCEPTS',120,315);p.font='40px Arial';p.fillText('SEE IT BEFORE IT HAPPENS.',128,400);p.fillStyle='#b5cef0';p.font='24px Arial';p.fillText('EVENT DESIGN  /  PRODUCTION  /  TECHNOLOGY',130,578);
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;
}
const screenMat=new THREE.MeshStandardMaterial({map:screenTexture(),roughness:.6,emissive:'#365e9a',emissiveIntensity:.6});
box(10.4,4.55,.025,0,3.65,-9.46,screenMat);
function truss(a,b){
 const A=new THREE.Vector3(...a),B=new THREE.Vector3(...b),direction=B.clone().sub(A),vertical=Math.abs(direction.y)>.1;
 const offsets=vertical?[[-.17,0,-.17],[.17,0,-.17],[.17,0,.17],[-.17,0,.17]]:[[0,-.17,-.17],[0,.17,-.17],[0,.17,.17],[0,-.17,.17]];
 offsets.forEach(v=>rod(A.clone().add(new THREE.Vector3(...v)).toArray(),B.clone().add(new THREE.Vector3(...v)).toArray(),.026));
 const steps=Math.ceil(direction.length()/.55);
 for(let i=0;i<steps;i++)for(let j=0;j<4;j++){
  const t=A.clone().addScaledVector(direction,i/steps).add(new THREE.Vector3(...offsets[j]));
  const u=A.clone().addScaledVector(direction,(i+1)/steps).add(new THREE.Vector3(...offsets[(j+1)%4]));
  rod(t.toArray(),u.toArray(),.012);
 }
}
truss([-8.1,.6,-7.7],[-8.1,6.7,-7.7]);truss([8.1,.6,-7.7],[8.1,6.7,-7.7]);truss([-8.1,6.7,-7.7],[8.1,6.7,-7.7]);
for(const x of [-6,-3,0,3,6]){
 box(.2,.28,.2,x,6.32,-7.7,m.black);
 const fixture=cylinder(.16,.18,.42,x,6.05,-7.7,m.black);fixture.rotation.x=.3;
 cylinder(.12,.12,.012,x,5.83,-7.64,blueStrip);
 const spot=new THREE.SpotLight('#9fbfff',70,18,.42,.6,1.2);spot.position.set(x,5.9,-7.5);spot.target.position.set(x*.65,.7,-4.7);scene.add(spot,spot.target);
}
for(const x of [-7.2,7.2]){
 box(.95,1.25,.9,x,1.2,-5.4,m.black,model,true);
 for(let i=0;i<3;i++)box(.7,.38,.65,x,4.3-i*.41,-7.4,m.black,model,true);
 for(let i=0;i<8;i++)box(.74,.012,.01,x,1+i*.075,-4.94,m.steel);
}
function chair(x,z,rotation=0,onStage=false){
 const g=new THREE.Group();g.position.set(x,onStage?.59:0,z);g.rotation.y=rotation;model.add(g);
 box(.57,.14,.57,0,.47,0,m.fabric,g,true);box(.57,.55,.1,0,.78,-.255,m.fabric,g,true);
 [-.24,.24].forEach(a=>[-.23,.23].forEach(b=>rod([a,.05,b],[a,.45,b],.022,m.dark,g)));
 return g;
}
for(let row=0;row<3;row++) for(const x of [-4.45,-3.55,-2.65,-1.75,1.75,2.65,3.55,4.45])chair(x,row*1.22-.3);
for(const x of [-3,-1.5,0,1.5,3])chair(x,-7,0,true);
function table(x,z,r=.5,h=.42){cylinder(r,r,.07,x,h,z,m.white);cylinder(.055,.055,h,x,h/2,z,m.gold);cylinder(r*.62,r*.62,.045,x,.035,z,m.gold);}
table(-1.8,-5.85,.47,.96);table(1.8,-5.85,.47,.96);
function sofa(x,z,rotation=0){
 const g=new THREE.Group();model.add(g);g.position.set(x,0,z);g.rotation.y=rotation;
 box(2.9,.29,1.08,0,.39,0,m.fabric,g,true);box(2.8,.6,.24,0,.81,-.48,m.fabric,g,true);
 for(const a of [-1.35,1.35])box(.22,.6,1.15,a,.68,0,m.fabric,g,true);
 for(const a of [-.85,0,.85]){box(.78,.19,.82,a,.6,.04,m.white,g,true);const pillow=box(.6,.44,.14,a,.89,-.25,m.white,g,true);pillow.rotation.x=-.15;}
 for(const a of [-1.12,1.12])for(const b of [-.35,.35])cylinder(.035,.035,.22,a,.15,b,m.gold,g);
}
sofa(-7,3.5,.45);sofa(-7.6,.4,Math.PI/2);table(-6.45,2,.73,.4);
sofa(7.1,.5,-Math.PI/2);sofa(6.8,3.6,-.4);table(6.6,2.1,.73,.4);
for(const [x,z]of [[-2.8,6],[2.8,6]]){table(x,z,.66,1.12);for(let a=0;a<3;a++){const t=a/3*Math.PI*2;cylinder(.25,.25,.085,x+Math.sin(t)*1.03,.78,z+Math.cos(t)*1.03,m.fabric);cylinder(.025,.025,.76,x+Math.sin(t)*1.03,.4,z+Math.cos(t)*1.03,m.gold);}}
function plant(x,z){cylinder(.29,.23,.65,x,.32,z,m.dark);rod([x,.6,z],[x,1.9,z],.035,m.oak);for(let i=0;i<9;i++){const a=i*2.399,y=.9+(i%3)*.35;const leaf=mesh(new THREE.SphereGeometry(1,10,8),mat('#4c6653'),x+Math.sin(a)*.25,y,z+Math.cos(a)*.25);leaf.scale.set(.15,.36,.075);leaf.rotation.z=Math.sin(a)*.7;leaf.rotation.y=a;}}
plant(-9,-4);plant(9,-4);plant(-9.4,4.7);plant(9.4,4.7);
box(.8,1.1,.6,-5.4,1.1,-6,m.white,model,true);
box(.88,.07,.66,-5.4,1.69,-6,m.dark);
rod([-5.4,1.73,-6],[-5.4,2.03,-6.15],.013,m.black);
const originals=[];
model.traverse(o=>{if(o.isMesh)originals.push([o,o.material]);});
const lines=new THREE.Group();model.add(lines);
originals.forEach(([o])=>{const edges=new THREE.LineSegments(new THREE.EdgesGeometry(o.geometry,24),new THREE.LineBasicMaterial({color:'#3c6986',transparent:true,opacity:.42}));edges.position.copy(o.position);edges.quaternion.copy(o.quaternion);edges.scale.copy(o.scale);o.parent.add(edges);edges.visible=false;o.userData.edges=edges;});
window.renderScene=mode=>{
 const wire=mode==='wire';
 for(const [o,material]of originals){o.material=wire?new THREE.MeshStandardMaterial({color:'#e2e9eb',roughness:1,metalness:0}):material;o.userData.edges.visible=wire;}
 renderer.toneMappingExposure=wire?1.1:1.25;renderer.render(scene,camera);
};
window.renderScene('final');window.sceneReady=true;