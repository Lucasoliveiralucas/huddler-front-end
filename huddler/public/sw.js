if(!self.define){let e,s={};const a=(a,c)=>(a=new URL(a+".js",c).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(c,i)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(s[n])return;let t={};const r=e=>a(e,n),d={module:{uri:n},exports:t,require:r};s[n]=Promise.all(c.map((e=>d[e]||r(e)))).then((e=>(i(...e),t)))}}define(["./workbox-588899ac"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/Huddler_brown_white.png",revision:"091d70cc6ed1eb3504f2b9ce63f09d7a"},{url:"/Huddler_green.png",revision:"090427cc1edd2b43c53439067cb87de5"},{url:"/Huddler_opt.png",revision:"fb4e27a6956e42ca53651e2c9b10a8fa"},{url:"/Huddler_white.png",revision:"aa0bad305e9c8c6ec4199335c8e67279"},{url:"/_next/static/XqPXt6luVj6YTnXJTh7mX/_buildManifest.js",revision:"8460eb9713f6a51f557d4659786ee6a7"},{url:"/_next/static/XqPXt6luVj6YTnXJTh7mX/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/100-08b51c1b49397dcc.js",revision:"08b51c1b49397dcc"},{url:"/_next/static/chunks/156-51a55f1a83053e0f.js",revision:"51a55f1a83053e0f"},{url:"/_next/static/chunks/367-7cfd041d7705e9a7.js",revision:"7cfd041d7705e9a7"},{url:"/_next/static/chunks/7d0bf13e-0a521c1c148eac0c.js",revision:"0a521c1c148eac0c"},{url:"/_next/static/chunks/80-ad102281f4895000.js",revision:"ad102281f4895000"},{url:"/_next/static/chunks/972-a41e6f79566a8e96.js",revision:"a41e6f79566a8e96"},{url:"/_next/static/chunks/framework-b3802df6cb251587.js",revision:"b3802df6cb251587"},{url:"/_next/static/chunks/main-973431e309f8fe13.js",revision:"973431e309f8fe13"},{url:"/_next/static/chunks/pages/_app-cdb4557979981ab9.js",revision:"cdb4557979981ab9"},{url:"/_next/static/chunks/pages/_error-a51993fe870ec2c8.js",revision:"a51993fe870ec2c8"},{url:"/_next/static/chunks/pages/details/%5Bid%5D-df4b568b98dc7437.js",revision:"df4b568b98dc7437"},{url:"/_next/static/chunks/pages/home-e4edbf8180709fd9.js",revision:"e4edbf8180709fd9"},{url:"/_next/static/chunks/pages/index-3cbcc48d3163b420.js",revision:"3cbcc48d3163b420"},{url:"/_next/static/chunks/pages/newuser-d4a240942b2bf8c3.js",revision:"d4a240942b2bf8c3"},{url:"/_next/static/chunks/pages/profile-a19372f73f7defd9.js",revision:"a19372f73f7defd9"},{url:"/_next/static/chunks/pages/settings-4f69fcb06fe3671a.js",revision:"4f69fcb06fe3671a"},{url:"/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",revision:"837c0df77fd5009c9e46d446188ecfd0"},{url:"/_next/static/chunks/webpack-fd4d6095db2e64e2.js",revision:"fd4d6095db2e64e2"},{url:"/_next/static/css/53fa15469dc309b1.css",revision:"53fa15469dc309b1"},{url:"/_next/static/css/d7adedf30fd9d671.css",revision:"d7adedf30fd9d671"},{url:"/_next/static/css/f8ddb4a03b95b9d8.css",revision:"f8ddb4a03b95b9d8"},{url:"/_next/static/media/Bike_img.03625ca9.jpg",revision:"c1a064c300d19207c06eb262f0a18879"},{url:"/_next/static/media/Huddler_green.a9c49de9.png",revision:"090427cc1edd2b43c53439067cb87de5"},{url:"/_next/static/media/Motorcycle_img.c407f31c.jpeg",revision:"e7ae0831896b67ea070d1bbbceaec6a4"},{url:"/_next/static/media/Park_img.1f1e2403.jpg",revision:"919e0735702337899a52e4861c19c759"},{url:"/_next/static/media/defaultUserImage.9034fed0.png",revision:"7861dadc7807c489531e672f28d0ecec"},{url:"/_next/static/media/location-pin-svgrepo-com.ba0a55c7.svg",revision:"7321a5235a90d4aeca64c7ab74a03145"},{url:"/_next/static/media/right-arrow.d4b9ab30.png",revision:"34430d40d721d9e7d6ef59d1802380ca"},{url:"/_next/static/media/terrace_img.c4f26de0.jpeg",revision:"809943f167fc473d3b87984cef49d224"},{url:"/bg_images/Bike_img.jpg",revision:"c1a064c300d19207c06eb262f0a18879"},{url:"/bg_images/Motorcycle_img.jpeg",revision:"e7ae0831896b67ea070d1bbbceaec6a4"},{url:"/bg_images/Park_img.jpg",revision:"919e0735702337899a52e4861c19c759"},{url:"/bg_images/terrace_img.jpeg",revision:"809943f167fc473d3b87984cef49d224"},{url:"/defaultUserImage.png",revision:"7861dadc7807c489531e672f28d0ecec"},{url:"/favicon.ico",revision:"c30c7d42707a47a3f4591831641e50dc"},{url:"/icon-192x192.png",revision:"b107e19b781433cc6af16b16c8ba5fba"},{url:"/icon-256x256.png",revision:"967e21cd0be9c95fbd328385711dff67"},{url:"/icon-384x384.png",revision:"e9a5e62510ee35323e99a7f70f9b5a80"},{url:"/icon-512x512.png",revision:"83cf1c18cd83fa24d5a9e757feb9b0b9"},{url:"/location-pin-svgrepo-com.svg",revision:"7321a5235a90d4aeca64c7ab74a03145"},{url:"/manifest.json",revision:"4f70c718127d7db123a925819b20ef1d"},{url:"/noImage.jpg",revision:"cec69a569d2d2224a738afb5ad8a419f"},{url:"/pinIcon.jpg",revision:"9463f66f7c7effaa3ae02bf89011bd1e"},{url:"/placeholder.jpg",revision:"f16044ced1d91add1e6adf88dd855042"},{url:"/right-arrow.png",revision:"34430d40d721d9e7d6ef59d1802380ca"},{url:"/vercel.svg",revision:"4b4f1876502eb6721764637fe5c41702"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:a,state:c})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
