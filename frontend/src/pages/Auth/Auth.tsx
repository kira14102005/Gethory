import { MainCard } from "../../components/shared/Card";
import { Navbar } from "../../components/shared/Navigation";
import './Auth.module.css'
export function Auth(){
    return <>
    <Navbar/>
    <div className="w-full h-full flex flex-row justify-center items-center">
    <MainCard />
    </div>
    </>
}