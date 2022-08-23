import { useEffect, useState } from "react"

interface ILeftMenuProps{
    setFile:React.Dispatch<React.SetStateAction<string>>
    setLight:React.Dispatch<React.SetStateAction<string>>
    light:string
}

export default function LeftMenu(props:ILeftMenuProps){
    const [menu,setMenu]=useState(true);

    const {setFile,setLight,light}=props;

    useEffect(()=>{console.log(light)},[light])

    return(
        <div className={`Left-menu ${menu?'active':''}`}>
            <div className="Left-menu__close" onClick={()=>setMenu(state=>!state)}>
                {menu
                ?<span className="material-icons">cancel</span>
                :<span className="material-icons">segment</span>
                }</div>
            


            <div className="Left-menu__buttons">
            <label>
            <span className="material-icons btn">upload</span>
            <input type={"file"} onChange={(event: any) => {
                        console.log(event.target.files[0]);
                        setFile(URL.createObjectURL(event.target.files[0]))
                    }} hidden/>
            </label>

            <label>
            <span className="material-icons btn" style={{color:light||'white'}} >wb_incandescent</span>
            <input type={'color'} onChange={event => setLight(event.target.value)} hidden/>
            </label>

            </div>
           
        </div>
    )
}