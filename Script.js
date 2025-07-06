import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAoVdv14MTRh_tST3Mwa1X6LhhIWzfahKU",
  authDomain: "flambeau-packing-142ad.firebaseapp.com",
  databaseURL: "https://flambeau-packing-142ad-default-rtdb.firebaseio.com",
  projectId: "flambeau-packing-142ad",
  storageBucket: "flambeau-packing-142ad.appspot.com",
  messagingSenderId: "219383298265",
  appId: "1:219383298265:web:9e8f3ceb3115d50d92a6c8"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Packing list items
const packingItems = [
  "Rx Medications",
  "Sleeping Bag",
  "Rain gear - jacket and pants",
  "Wet shoes (close-toed)",
  "Personal hygiene items",
  "2 t-shirts/tank tops",
  "1 long-sleeved shirt",
  "1 warm sweater (wool or synthetic fleece)",
  "2 pair pants",
  "2 pairs wool socks",
  "Underwear",
  "Brimmed hat",
  "Warm stocking hat",
  "Water bottle (32 oz)",
  "Headlamp/Flashlight",
  "Dry shoes",
  "1 or 2 pairs of shorts",
  "Swimsuit",
  "Small daypack or fanny pack",
  "Camping towel",
  "Sleeping pad",
  "Sunglasses",
  "Card game, journal, or book",
  "Camera"
];

// Elements
const loginContainer = document.getElementById("login-container");
const listContainer = document.getElementById("list-container");
const usernameInput = document.getElementById("username");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const userDisplay = document.getElementById("user-display");
const packingListEl = document.getElementById("packing-list");

let currentUser = null;

// Login logic
loginBtn.addEventListener("click", () => {
  const name = usernameInput.value.trim();
  if (name) {
    currentUser = name;
    localStorage.setItem("flambeauUser", name);
    initUser(name);
  }
});

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("flambeauUser");
  location.reload();
});

// Check if user already logged in
const savedUser = localStorage.getItem("flambeauUser");
if (savedUser) {
  currentUser = savedUser;
  initUser(savedUser);
}

function initUser(username) {
  loginContainer.style.display = "none";
  listContainer.style.display = "block";
  userDisplay.textContent = username;

  const userRef = ref(db, `users/${username}`);

  // Load initial data and listen for updates
  onValue(userRef, (snapshot) => {
    let data = snapshot.val();
    if (!data) {
      // First time user: initialize with all false
      data = {};
      packingItems.forEach(item => data[item] = false);
      set(userRef, data);
    }
    renderList(data);
  });
}

function renderList(userData) {
  packingListEl.innerHTML = "";
  packingItems.forEach(item => {
    const li = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = userData[item] || false;

    checkbox.addEventListener("change", () => {
      const userRef = ref(db, `users/${currentUser}/${item}`);
      set(userRef, checkbox.checked);
    });

    li.appendChild(checkbox);
    li.appendChild(document.createTextNode(item));
    packingListEl.appendChild(li);
  });
}
