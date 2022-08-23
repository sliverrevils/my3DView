import { useEffect, useState } from "react"

interface ILeftMenuProps {
    setFile: React.Dispatch<React.SetStateAction<string>>;
    setLight: React.Dispatch<React.SetStateAction<string>>;
    light: string;
    setGrid: React.Dispatch<React.SetStateAction<boolean>>;
    setHlight: React.Dispatch<React.SetStateAction<{
        color: string;
        intansity: number;
    }>>;
    hlite:{
        color: string;
        intansity: number;
    };
    grid:boolean;
}

export default function LeftMenu(props: ILeftMenuProps) {
    const [menu, setMenu] = useState(true);

    const { setFile, setLight, light, setGrid ,setHlight,hlite,grid} = props;

    useEffect(() => { console.log(light) }, [light])

    return (
        <div className={`Left-menu ${menu ? 'active' : ''}`}>
            <div className="Left-menu__close" onClick={() => setMenu(state => !state)}>
                {menu
                    ? <span className="material-icons">cancel</span>
                    : <span className="material-icons">segment</span>
                }</div>



            <div className="Left-menu__buttons">
                <label>
                    <span className="material-icons btn">upload</span>
                    <input type={"file"} onChange={(event: any) => {
                        console.log(event.target.files[0]);
                        setFile(URL.createObjectURL(event.target.files[0]))
                    }} hidden />
                </label>

                <label>
                    <span className="material-icons btn" style={{ color: light || 'white' }} >lightbulb_circle</span>
                    <input type={'color'} onChange={event => setLight(event.target.value)} hidden />
                </label>
                
                <div  onClick={()=>setGrid(state=>!state)}>
                    {
                        grid
                        ?<span className="material-icons btn">grid_off</span>                        
                        :<span className="material-icons btn">grid_on</span>
                    }                
                </div>
                
                <div>
                <label>                    
                <span className="material-icons btn" style={{color:hlite.color}}>highlight</span>
                    <input type={'color'} onChange={event=>setHlight((state:any)=>({...state,color:event.target.value}))} hidden/>
                </label>
                <input type={'range'} onChange={event=>setHlight((state:any)=>({...state,intansity:+event.target.value/10}))} min={1} max={50} value={hlite.intansity*10}/>
                </div>
               

            </div>

        </div>
    )
}