
import { useEffect, useState } from 'react';
import { useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from '../ThreeJs/OrbitControls';
import { GLTFLoader } from '../ThreeJs/GLTFLoader';
import { AmbientLight, Camera, DirectionalLight } from 'three';
import LeftMenu from './munu';

//const _MODEL= 'models/my2/puff.gltf'
const _MODEL = 'models/sofa4/scene.gltf'

export default function My3DView() {
    const [loading, setLoading] = useState(true);
    const render3d = useRef(true);
    const canvasDiv: { current: HTMLDivElement | null } = useRef(null);
    let  loader: GLTFLoader;


    //BASE IMG ARRAY
    const [file, setFile] = useState([
        'https://images.wallpaperscraft.com/image/single/room_vanity_flooring_wall_80351_3840x2400.jpg',
        'https://i.pinimg.com/originals/34/99/d1/3499d12f28a741f0063ee8f2bbd711d9.jpg'][Math.round(Math.random() * 1)]
    );

    //LOAD FILE IMG
    const imgRef: { current: HTMLImageElement | undefined } = useRef();
    useEffect(() => {
        const img = new Image();
        img.src = file;
        img.onload = () => {
            imgRef.current!.src = img.src;
        }
    }, [file])

    const rendererRef: { current: THREE.WebGL1Renderer | undefined } = useRef();
   
    const cameraRef: { current: any } = useRef();
   //const cameraRef: { current: THREE.Camera | undefined } = useRef();
    const sceneRef: { current: THREE.Scene | undefined } = useRef();

    //light
    const [light, setLight] = useState('');
    const directionalLightRef: { current: THREE.DirectionalLight | undefined } = useRef();
    useEffect(() => {

        if (sceneRef.current && light) {
            if (directionalLightRef.current) sceneRef.current?.remove(directionalLightRef.current)
            directionalLightRef.current = new THREE.DirectionalLight(light, 3);
            directionalLightRef.current.position.set(12, 12, 12);
            directionalLightRef.current.castShadow = true;
            sceneRef.current!.add(directionalLightRef.current);
        }

    }, [light]);

    //hightlite
    const [hlite,setHlight]=useState({color:'',intansity:0});
    const hliteRef:{current:THREE.AmbientLight|undefined}=useRef();
    useEffect(()=>{
        if(sceneRef.current){
            if(hliteRef.current)sceneRef.current!.remove(hliteRef.current);
        hliteRef.current= new THREE.AmbientLight(hlite.color, +hlite.intansity);
        console.log('SET HLITE',hlite.intansity)
        sceneRef.current!.add(hliteRef.current);
        }
    },[hlite]);


    //help grid
    const [grid,setGrid]=useState(false);
    const gridRf:{current:THREE.GridHelper|undefined}=useRef();
    useEffect(()=>{
        if(grid){
               //ADD HELP GRID  
               gridRf.current=new THREE.GridHelper(10, 10)
               sceneRef.current!.add(gridRf.current);  
               
        }else{
            if(gridRf.current){
                sceneRef.current!.remove(gridRf.current);   
            }
        }
    },[grid]);


    useEffect(() => {

        function init() {
            //CLEAR OLD RENDER ON RESIZE
            if (rendererRef.current) {
                rendererRef.current.domElement.parentElement?.removeChild(rendererRef.current.domElement);
                rendererRef.current.dispose();
            }

            //SCENE
            sceneRef.current = new THREE.Scene();
            //sceneRef.current.background = new THREE.Color(0xdddddd);                 

            //CAMERA            
            cameraRef.current = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000); 
            cameraRef.current.position.set(0, 0, 6);
            // cameraRef.current.lookAt(0, 22, 1);

            //LIGHT
            setLight('white');
       
            //H LITE
            // hlite = new THREE.AmbientLight(0x404040, 1);
            // sceneRef.current.add(hlite);
            setHlight({color:'white',intansity:0});

            rendererRef.current = new THREE.WebGL1Renderer({ antialias: true, alpha: true });
            rendererRef.current.setSize(window.innerWidth, window.innerHeight);
            
            //CONTROL
            let control = new OrbitControls(cameraRef.current, rendererRef.current.domElement);
            control.maxDistance = 110;
            control.minDistance = 2.2;
            control.getPolarAngle()

            // control.autoRotate=true;
            // control.rotateSpeed=.5;
            //control.enableDamping = false;            
            //control.addEventListener('change',(e)=>console.log(control.getPolarAngle()))        

            canvasDiv.current?.appendChild(rendererRef.current.domElement);

            //LOADER gLTF
            loader = new GLTFLoader();           
            loader.load(process.env.PUBLIC_URL + _MODEL, (gltf: any) => {                
                sceneRef.current!.add(gltf.scene);
                const model = gltf.scene.children[0];
                model.position.set(0, 0, 0);
                model.scale.set(1, 1, 1);
                render();
            })
            //RENDER
            function render() {
                setLoading(true);
                if (render3d.current && sceneRef.current && directionalLightRef) {
                    // console.log('RENDER 3D');
                    rendererRef.current!.render(sceneRef.current, cameraRef.current as Camera);
                    sceneRef.current!.add(directionalLightRef.current as DirectionalLight);
                    sceneRef.current!.add(hliteRef.current as AmbientLight);                    
                    control.update();                   
                    setLoading(false);
                    requestAnimationFrame(render);
                }
            }
        }

        render3d.current = true;
        !canvasDiv.current!.querySelector('canvas') && init();


        //ON RESIZE WINDOW
       
        window.addEventListener('resize', () => {          
            cameraRef.current.aspect=rendererRef.current!.domElement.width/rendererRef.current!.domElement.height;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current!.setSize(window.innerWidth, window.innerHeight);     

        });
        return () => {
            render3d.current = false;
        };
    }, []);

    return (
        <>
            <LeftMenu {...{ setFile, setLight,light ,grid,setGrid,hlite,setHlight}} />
            <div className="Item">
                {loading && <div className='Item__loading'>Loading</div>}
                <div className='Item__div-canvas' ref={canvasDiv} >
                    <img src='' alt="" ref={imgRef as { current: HTMLImageElement }} />
                </div>
            </div>
        </>
    )
}