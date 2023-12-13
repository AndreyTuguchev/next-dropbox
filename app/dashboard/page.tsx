
import DropZoneComp from "@/components/DropZoneComp";
import { auth } from "@clerk/nextjs"


function Dashboard() {

  const { userId } = auth();

  return (
    <>
    <div>Dashboard </div>
    <div>
      <DropZoneComp />
    </div>
    </>
  )
}

export default Dashboard