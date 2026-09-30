import { useCallback, useEffect, useRef, useState } from "react"
// ponytail: generic over caller state; was hard-coded to v1 ClientInterface which broke v2's extra fields
export const useStateWithCallback = <T,>(initialState : T)=>{
    const [state , setState] = useState<T>(initialState)
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