/* ============================================================
   API URLS
============================================================ */

const USER_API_URL =
"https://script.google.com/macros/s/AKfycbw00GHHheuvtdQtgPURjs4PtsM48-4yaFx-_ms0ZBV5FHhnmcdbJ5DHr3Aix8JPF0kQzA/exec";

const DATA_API_URL =
"https://script.google.com/macros/s/AKfycbz59T-4CKQDbHJB_ql6OYZf18eN7XUmttp0d2FaOM5pm27yCBOWrEilqA_zMOnFq_rz/exec";

const SELL_API_URL =
"https://script.google.com/macros/s/AKfycbyiKn1MH1ZQvebSIo83bZzbbfJimmfRf9PjlPI4w1q1UliuF27gKViYM24oXakpkHuP/exec";

const PAID_API_URL =
"https://script.google.com/macros/s/AKfycb_ykDEHln_Dj_0YfB421POWa2XAuN6g2PDypQtyS2arrxgPVtyZZOwAp_TKLrUnRudKng/exec";

const DELETE_API_URL =
"https://script.google.com/macros/s/AKfycbwDL1JIV7QYcH84VGiWxhUoT-wN9UfuGn0t9boYrs_FaG_ZfcVGjNmaTqSTC6ev0Ig9Kg/exec";

const ITEM_API_URL =
"https://script.google.com/macros/s/AKfycby2e7dzGE5vkS0Q-Eyl9MKLAbkkkD8f37eIVj7VuV8bPytWGOH7cwJ3w25efP7MLGshOw/exec";


/* ============================================================
   GLOBAL
============================================================ */

let allData=[];
let filteredData=[];

let editingUser=false;
let editingDataRow=null;
let editingSellRow=null;

let currentDataType="data";
let currentPage=1;

const pageSize=10;

let dataCache=null;
let sellCache=null;
let deleteCache=null;

let itemList=[];
let itemCache=null;

let currentUsername=
  localStorage.getItem("username") ||
  localStorage.getItem("loggedUser") ||
  "";


/* ============================================================
   PAGE LOAD
============================================================ */

document.addEventListener("DOMContentLoaded",function(){

  loadTheme();

  if(!checkLogin()) return;

  loadUser();
  loadData();
  loadItems();

});


/* ============================================================
   LOGIN
============================================================ */

function checkLogin(){

  const auth=
    localStorage.getItem("dashboardAuth") ||
    sessionStorage.getItem("dashboardAuth");

  if(auth!=="true"){

    window.location.replace("index.html");

    return false;
  }

  return true;
}


/* ============================================================
   LOAD USER
============================================================ */

async function loadUser(){

  if(!checkLogin()) return;

  if(!currentUsername){

    logout();
    return;
  }

  try{

    const url=
      USER_API_URL+
      "?action=getUser"+
      "&username="+
      encodeURIComponent(currentUsername)+
      "&_="+Date.now();

    const response=
      await fetch(url,{
        method:"GET",
        cache:"no-store"
      });

    if(!response.ok)
      throw new Error("User API connection failed.");

    const result=await response.json();

    if(!result.success)
      throw new Error(
        result.message ||
        "Unable to load user."
      );

    const user=result.user || {};

    const displayName=
      user.name ||
      user.username ||
      currentUsername;

    document.getElementById("profileName").textContent=
      displayName;

    document.getElementById("profileRole").textContent=
      user.role || "User";

    document.getElementById("profileAvatar").textContent=
      displayName.charAt(0).toUpperCase();

    localStorage.setItem("name",user.name || "");
    localStorage.setItem("role",user.role || "");
    localStorage.setItem("status",user.status || "");

    if(
      String(user.status || "")
        .trim()
        .toLowerCase()==="block"
    ){

      logout();
      return;
    }

  }catch(error){

    console.error("loadUser:",error);

    showToast(
      error.message ||
      "Unable to connect to User API.",
      "error"
    );

  }
}
