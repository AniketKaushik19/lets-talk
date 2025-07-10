import {create} from 'zustand'

export const useThemeStore=create((set)=>({
    theme:localStorage.getItem("lets-talk")||"night",
    setTheme:(theme)=>{
        set({theme})
        localStorage.setItem("lets-talk",theme);
     },
}))