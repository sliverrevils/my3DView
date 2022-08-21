
import  { useEffect, useState } from 'react';
import { useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from '../ThreeJs/OrbitControls';
import { GLTFLoader } from '../ThreeJs/GLTFLoader';

export default function My3DView() {
    const [loading,setLoading]=useState(true);
    const render3d=useRef(true);
    const canvasDiv: { current: HTMLDivElement | null } = useRef(null);
    let scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.WebGL1Renderer, hlite, loader: GLTFLoader;   

    const [file,setFile]=useState([
        'https://images.wallpaperscraft.com/image/single/room_vanity_flooring_wall_80351_3840x2400.jpg',       
        'https://i.pinimg.com/originals/34/99/d1/3499d12f28a741f0063ee8f2bbd711d9.jpg'][Math.round(Math.random()*1)]
    );

    const imgRef:{current:HTMLImageElement|undefined}=useRef();
    useEffect(()=>{
        const img=new Image();
        img.src=file;
        img.onload=()=>{
            imgRef.current!.src=img.src;
        }
    },[file])
    
    const rendererRef:{current:THREE.WebGL1Renderer|undefined}=useRef();
   
    useEffect(() => {

        function init() {   
            //CLEAR OLD RENDER ON RESIZE
            if(rendererRef.current){
                rendererRef.current.domElement.parentElement?.removeChild(rendererRef.current.domElement);
                rendererRef.current.dispose();
            }           

            //SCENE
            scene = new THREE.Scene();         
            //scene.background = new THREE.Color(0xdddddd);
            //scene.add(new THREE.GridHelper(10, 10)) // ДОБАВЛЕНИЕ СЕТКИ          
    
            //CAMERA
            const {width,height}= canvasDiv.current!.getBoundingClientRect();
            //camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
            camera = new THREE.PerspectiveCamera(40, width / height, 1, 10000);
            
            camera.position.set(0, 0, 6);
            // camera.lookAt(0, 22, 1);     
    
            //LIGHT
            let directionalLight = new THREE.DirectionalLight('white', 3);
            directionalLight.position.set(12, 12, 12);
            directionalLight.castShadow = true;
            scene.add(directionalLight);
    
            hlite = new THREE.AmbientLight(0x404040, 20);
            
            rendererRef.current = new THREE.WebGL1Renderer({ antialias: true ,alpha:true});
            rendererRef.current.setSize(window.innerWidth, window.innerHeight);
           // renderer.setSize(width, height+50);
           
    
            //CONTROL
            let control=new OrbitControls(camera,rendererRef.current.domElement);
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
            loader.load(process.env.PUBLIC_URL + 'models/sofa4/scene.gltf', (gltf: any) => {
                setLoading(false);            
                scene.add(gltf.scene);            
                const model = gltf.scene.children[0];
                model.position.set(0,-.5,0);
                model.scale.set(1, 1, 1);
               
                render();
            })
            //RENDER
            function render() {
                if(render3d.current){
                rendererRef.current!.render(scene, camera);
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
            <input className='Item__file'  type={"file"} onChange={(event:any)=>{                
                console.log(event.target.files[0]);
                setFile(URL.createObjectURL(event.target.files[0]))
                }} />
            <img src='' alt="" ref={imgRef as {current:HTMLImageElement}} />    
            </div>           
        </div>
    )
}