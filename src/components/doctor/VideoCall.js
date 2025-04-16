// Import stylesheets
import '../../css/user/style.css';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import {
  getName
} from "../service/otherService/localStorage";
// Write Javascript code!
const appDiv = document.getElementById('app');
appDiv.innerHTML = `<h1>JS Starter</h1>`;

// get token
//! You need generate a token using your own backend api!
//! Please refer to https://docs.zegocloud.com/article/14741 for more information.
function generateToken(tokenServerUrl, userID) {
  // Obtain the token interface provided by the App Server
  return fetch(
    `${tokenServerUrl}/access_token?userID=${userID}&expired_ts=7200`,
    {
      method: 'GET',
    }
  ).then((res) => res.json());
}

function randomID(len) {
  let result = '';
  if (result) return result;
  var chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP',
    maxPos = chars.length,
    i;
  len = len || 5;
  for (i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

function getUrlParams(url) {
  let urlStr = url.split('?')[1];
  const urlSearchParams = new URLSearchParams(urlStr);
  const result = Object.fromEntries(urlSearchParams.entries());
  return result;
}

async function init() {
  const roomID = getUrlParams(window.location.href)['roomID'] || randomID(5);
  const userID = randomID(5);
  const userName = randomID(5);
  const { token } = await generateToken(
    'https://nextjs-token.vercel.app/api',
    userID
  );
  const KitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
    1484647939, // You need to replace the appid with your own appid
    token,
    roomID,
    userID,
    userName
  );
  const zp = ZegoUIKitPrebuilt.create(KitToken);

  let sharedLinks = [
    {
      name: 'Personal link',
      url:
        window.location.origin + window.location.pathname + '?roomID=' + roomID,
    },
  ];
  zp.joinRoom({
    container: appDiv,
    maxUsers: 4,
    branding: {
      logoURL:
        'https://www.zegocloud.com/_nuxt/img/zegocloud_logo_white.ddbab9f.png',
    },
    scenario: {
      mode: ZegoUIKitPrebuilt.GroupCall,
    },
    sharedLinks,
  });
}

init();
