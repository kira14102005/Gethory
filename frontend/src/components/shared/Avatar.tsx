
const AvatarComponent = ({ img }: { img: string }) => {
   return (
      <div className="w-[16vh] h-[16vh] max-w-[110px] max-h-[110px] border-[3px] border-[#4A5568] bg-[#DB9C50] rounded-full flex items-center justify-center overflow-hidden">
         <img src={img} alt="" className="h-[98%] w-[98%] object-cover" />
      </div>
   )
}

export default AvatarComponent
