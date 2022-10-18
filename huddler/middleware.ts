import { NextResponse, userAgent } from 'next/server';
import type { NextRequest } from 'next/server';
import { Auth } from 'aws-amplify';

export async function middleware (request: NextRequest) {
  //auth
  // if (request.nextUrl.pathname === '/profile') {
  //   const url = request.nextUrl.clone();  
  //   url.pathname = 'profile/';
  //   // const response = NextResponse.redirect(url);
  //   // const { username } = await Auth.currentUserInfo();
  //   const res = await fetch("http://localhost:3000/api/hello")
  //   console.log(await res.status);

  //   // return response;
  //   return;
  // }
  if (request.nextUrl.pathname === '/logout') {
    const url = request.nextUrl.origin;  
    // const token = request.cookies.get("CognitoIdentityServiceProvider.qrbirft14db4eb95figbrh8p6.a5bae642-bf13-4e01-9c95-85fbec216138.idToken") ;
    const response = new NextResponse()
    // response.cookies.delete("CognitoIdentityServiceProvider.qrbirft14db4eb95figbrh8p6.a5bae642-bf13-4e01-9c95-85fbec216138.idToken")
    
    response.cookies.clear()
    return response;
  }

  return NextResponse.next();
}
