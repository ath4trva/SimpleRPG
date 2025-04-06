let xp = 0;
let health = 100;
let gold = 50;
let currentWeaponIndex = 0;
let fighting;
let monsterHealth;
let inventory = [`Stick`];

const button1 = document.querySelector(`#button1`);
const button2 = document.querySelector(`#button2`);
const button3 = document.querySelector(`#button3`);

const text = document.querySelector(`#text`);
const xpText = document.querySelector(`#xpText`);
const healthText = document.querySelector(`#healthText`);
const goldText = document.querySelector(`#goldText`);
const monsterStats = document.querySelector(`#monsterStats`);
const monsterName = document.querySelector(`#monsterName`);
const monsterHealthText = document.querySelector(`#monsterHealthText`);

xpText.innerText = xp;
healthText.innerText = health;
goldText.innerText = gold;

const weapons = [
  { name: `Stick`, power: 5 },
  { name: `Dagger`, power: 30 },
  { name: `Claw Hammer`, power: 50 },
  { name: `Katana`, power: 100 }
];

const locations = [
  {
    name: `town square`,
    "button text": [`Go to Store`, `Go to Cave`, `Fight Undead`],
    "button functions": [goStore, goCave, fightUndead],
    text: `You are in the Town Square. You see a sign that says 'Store'.`
  },
  {
    name: `store`,
    "button text": [`Buy 10 Health (10 Gold)`, `Buy Weapon (30 Gold)`, `Go to Town Square`],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: `You have entered the Store.`
  },
  {
    name: `cave`,
    "button text": [`Fight Slime`, `Fight Goblin`, `Go to Town Square`],
    "button functions": [fightSlime, fightBeast, goTown],
    text: `You enter the cave. You see some monsters.`
  },
  {
    name: `fight`,
    "button text": [`Attack`, `Dodge`, `Run Away`],
    "button functions": [attack, dodge, goTown],
    text: `You are fighting a Monster!`
  },
  {
    name: `kill monster`,
    "button text": [`Go to Town Square`, `Go to Town Square`, `Go to Town Square`],
    "button functions": [goTown, goTown, handleEasterEgg],
    text: `The monster screams "Arg!" as it dies. You gain experience points and find gold.`
  },
  {
    name: "lose",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: `You have died. <strong>Game Over</strong>`
  },
  {
    name: "win",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: `You have defeated the Undead King Necrothorn! YOU WIN THE GAME.`
  },
  {
    name: "easter egg",
    "button text": ["2", "8", "Go to Town Square"],
    "button functions": [pickTwo, pickEight, goTown],
    text: `You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you chose matches one of the random numbers, you win!`
  },
];

const monsters = [
  { name: `Slime`, level: 2, health: 15 },
  { name: `Goblin Mage`, level: 8, health: 60 },
  { name: `Necrothorn`, level: 20, health: 300 }
];

// Initialising Buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightUndead;

function goTown() {
  update(locations[0]);
  monsterStats.style.display = "none";
}

function goStore() {
  update(locations[1]);
}

function goCave() {
  update(locations[2]);
}

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
    text.innerText = `You bought 10 health.`;
  } else {
    text.innerText = `You don't have enough gold to buy health.`;
  }
}

function buyWeapon() {
  if (currentWeaponIndex < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeaponIndex++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeaponIndex].name;
      text.innerText = `You now have a ${newWeapon}. `;
      inventory.push(newWeapon);
      text.innerText += `In your inventory: ${inventory.join(", ")}`;
    } else {
      text.innerText = `You don't have enough gold to buy a weapon.`;
    }
  } else {
    text.innerText = `You already have the most powerful weapon!`;
    button2.innerText = `Sell weapon for 15 Gold`;
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = `You sold your ${currentWeapon} for 15 gold. `;
    text.innerText += `In your inventory: ${inventory.join(", ")}`;
  } else {
    text.innerText = "You don't have any weapons to sell.";
  }
}

function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function fightUndead() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];

  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];

  text.innerHTML = location.text;
}

function attack() {
  text.innerText = `The ${monsters[fighting].name} attacks.\n`;
  text.innerText += `You attacked it with your ${weapons[currentWeaponIndex].name}.\n`;

  health -= getMonsterAttackValue(monsters[fighting].level);
  if (health < 0) health = 0;

  if (isMonsterHit()) {
    monsterHealth -= weapons[currentWeaponIndex].power + Math.floor(Math.random() * xp) + 1;
  } else {
    text.innerText += "You missed the monster.\n";
  }

  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;

  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    if (fighting === 2) {
      winGame();
    } else {
      defeatMonster();
    }
  }

  if (Math.random() <= 0.1 && inventory.length !== 1) {
    text.innerText += `Your ${inventory.pop()} breaks`;
    currentWeaponIndex--;
  }
}

function defeatMonster() {
  gold += Math.floor(6.7 * monsters[fighting].level);
  xp += Math.floor(1.2 * monsters[fighting].level);
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
}

function handleEasterEgg() {
  if (Math.random() < 0.4) {
    easterEgg();
  } else {
    goTown();
  }
}

function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

function dodge() {
  text.innerText = "You dodged the attack from " + monsters[fighting].name + `.`;
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeaponIndex = 0;
  inventory = ["Stick"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}

function getMonsterAttackValue(level) {
    const baseDamage = level + 5;
    const healthFactor = monsterHealth / 100;
    const randomFactor = Math.random() * 2;
    const hit = Math.floor(baseDamage * healthFactor * randomFactor);
    return hit > 0 ? hit : 1;
  }
  

function isMonsterHit() {
  return Math.random() > 0.2 || health < 20;
}

function easterEgg() {
  update(locations[7]);
}

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText = `You picked ${guess}. Here are the random numbers:\n`;
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }
  if (numbers.includes(guess)) {
    text.innerText += "Right! You won 20 gold!";
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerText += "Wrong! You lost 10 health!";
    health -= 10;
    if (health < 0) health = 0;
    healthText.innerText = health;
    if (health <= 0) {
      lose();
    }
  }
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}
//bgm
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");

musicToggle.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play();
    musicToggle.innerText = "🔊 Music: ON";
  } else {
    bgMusic.pause();
    musicToggle.innerText = "🔇 Music: OFF";
  }
});