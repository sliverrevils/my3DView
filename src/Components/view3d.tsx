
import  { useEffect, useState } from 'react';
import { useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from '../ThreeJs/OrbitControls';
import { GLTFLoader } from '../ThreeJs/GLTFLoader';
import { Camera } from 'three';

//const _MODEL= 'models/my2/puff.gltf'
const _MODEL= 'models/sofa4/scene.gltf'

export default function My3DView() {
    const [loading,setLoading]=useState(true);
    const render3d=useRef(true);
    const canvasDiv: { current: HTMLDivElement | null } = useRef(null);
    let  hlite, loader: GLTFLoader;   

    
    //BASE IMG ARRAY
    const [file,setFile]=useState([
        'https://images.wallpaperscraft.com/image/single/room_vanity_flooring_wall_80351_3840x2400.jpg',       
        'https://i.pinimg.com/originals/34/99/d1/3499d12f28a741f0063ee8f2bbd711d9.jpg'][Math.round(Math.random()*1)]
    );

    //LOAD FILE IMG
    const imgRef:{current:HTMLImageElement|undefined}=useRef();
    useEffect(()=>{
        const img=new Image();
        img.src=file;
        img.onload=()=>{
            imgRef.current!.src=img.src;
        }
    },[file])
    
    const rendererRef:{current:THREE.WebGL1Renderer|undefined}=useRef();
    const directionalLightRef:{current:THREE.DirectionalLight|undefined}=useRef();
    const cameraRef:{current:THREE.Camera|undefined}=useRef();
    const sceneRef:{current:THREE.Scene|undefined}=useRef();

    const [light,setLight]=useState('');

    useEffect(()=>{
        if(sceneRef.current && light){
            if(directionalLightRef.current) sceneRef.current?.remove(directionalLightRef.current)
            directionalLightRef.current = new THREE.DirectionalLight(light, 3);
            directionalLightRef.current.position.set(12, 12, 12);
            directionalLightRef.current.castShadow = true;
            sceneRef.current!.add(directionalLightRef.current);
        }

    },[light])
   
    useEffect(() => {

        function init() {   
            //CLEAR OLD RENDER ON RESIZE
            if(rendererRef.current){
                rendererRef.current.domElement.parentElement?.removeChild(rendererRef.current.domElement);
                rendererRef.current.dispose();
            }           

            //SCENE
            sceneRef.current = new THREE.Scene();         
            //sceneRef.current.background = new THREE.Color(0xdddddd);
            //sceneRef.current.add(new THREE.GridHelper(10, 10)) // ДОБАВЛЕНИЕ СЕТКИ          
    
            //CAMERA
            const {width,height}= canvasDiv.current!.getBoundingClientRect();
            //cameraRef.current = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
            cameraRef.current = new THREE.PerspectiveCamera(40, width / height, 1, 10000);
            
            cameraRef.current.position.set(0, 0, 6);
            // cameraRef.current.lookAt(0, 22, 1);     
    
            //LIGHT
            // let directionalLight = new THREE.DirectionalLight('white', 3);
            // directionalLight.position.set(12, 12, 12);
            // directionalLight.castShadow = true;
            // sceneRef.current.add(directionalLight);

            directionalLightRef.current = new THREE.DirectionalLight('white', 3);
            directionalLightRef.current.position.set(12, 12, 12);
            directionalLightRef.current.castShadow = true;
            sceneRef.current.add(directionalLightRef.current);
            //sceneRef.current.remove(directionalLight);
    
            hlite = new THREE.AmbientLight(0x404040, 1);
            sceneRef.current.add(hlite);
            
            rendererRef.current = new THREE.WebGL1Renderer({ antialias: true ,alpha:true});
            rendererRef.current.setSize(window.innerWidth, window.innerHeight);
           // renderer.setSize(width, height+50);
           
    
            //CONTROL
            let control=new OrbitControls(cameraRef.current,rendererRef.current.domElement);
            control.maxDistance=110;
            control.minDistance=2.2;
            control.getPolarAngle()
           
            // control.autoRotate=true;
            // control.rotateSpeed=.5;       
            
            control.enableDamping=false;
            //control.addEventListener('change',(e)=>console.log(control.getPolarAngle()))        
    
            canvasDiv.current?.appendChild(rendererRef.current.domElement); 
    
            //LOADER gLTF
            loader = new GLTFLoader();
            setLoading(true);
            loader.load(process.env.PUBLIC_URL + _MODEL, (gltf: any) => {
                setLoading(false);            
                sceneRef.current!.add(gltf.scene);            
                const model = gltf.scene.children[0];
                model.position.set(0,-.5,0);
                model.scale.set(1, 1, 1);
               
                render();
            })
            //RENDER
            function render() {
                if(render3d.current&& sceneRef.current){
                rendererRef.current!.render(sceneRef.current, cameraRef.current as Camera);
                requestAnimationFrame(render); 
                control.update();
                console.log('render 3D');   
                }             
            }
        }

        render3d.current=true;
        !canvasDiv.current!.querySelector('canvas')&&init();


        //ON RESIZE WINDOW
        let timer:any;
        window.addEventListener('resize',()=>{

            clearTimeout(timer);
            timer =setTimeout(()=>{init()},500);
            
        });
        
        return ()=>{
            render3d.current=false;
        };       
    }, []);

    return (
        <div className="Item">                         
            {loading&&<div className='Item__loading'>Loading</div>}            
            <div className='Item__div-canvas' ref={canvasDiv} >
                <div className='Item__menu' >
                <input  type={"file"} onChange={(event:any)=>{                
                console.log(event.target.files[0]);
                setFile(URL.createObjectURL(event.target.files[0]))
                }} />
                <input type={'color'} onChange={event=>setLight(event.target.value)}  value={light}/>
                </div>
            
            <img src='' alt="" ref={imgRef as {current:HTMLImageElement}} />    
            </div>           
        </div>
    )
}