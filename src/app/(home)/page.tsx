

import { getUser } from "@/lib/auth/auth-session";



export default async function Home() {

    const user = await getUser();

    console.log(user, "user");
 
  return (
    <div className="w-full">


    </div>
  );
}
