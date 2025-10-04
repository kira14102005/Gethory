import { useCallback, useEffect, useRef, useState } from "react"
import { type ClientInterface } from "./useWebRTC"
export const useStateWithCallback = (initialState : any)=>{
    const [state , setState] = useState<ClientInterface[]>(initialState)
    const cbRef  = useRef<undefined | Function>(null)
    const updateState = useCallback((newState : any , cb ?: ()=>any)=>{
        cbRef.current  = cb
        setState((prev : any)=>{
            return typeof newState === 'function' ? newState(prev) : newState
        })
    } , [])

    useEffect(()=>{
        if(cbRef.current){
            cbRef.current(state)
            cbRef.current = null
        }
    } , [state])

    return [state , updateState] as const
}