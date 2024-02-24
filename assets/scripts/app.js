const ATTACK_VALUE = 10; //in caps as its a global variable and gold a hardcoded value
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_PLAYER_VALUE = 21;
const MODE_ATTACK = 'ATTACK';
const MODE_STRONG_ATTACK = 'STRONG ATTACK';
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER STRONG ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER HEAL';
const LOG_EVENT_GAMEOVER = 'GAME OVER';

const enteredValue = prompt('Maximum life for you and monster', '100');

let chosenMaxLife = parseInt(enteredValue);
let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;
let battleLog = [];
if (isNaN(chosenMaxLife) || chosenMaxLife <= 0) {
  chosenMaxLife = 100;
}
adjustHealthBars(chosenMaxLife);

function writeToLog(ev, val, monsterHealth, playerHealth) {
  let logEntery = {
    event: ev,
    value: val,
    finalMonsterHealth: monsterHealth,
    finalPlayerHealth: playerHealth,
  };
  if (ev == LOG_EVENT_PLAYER_ATTACK || ev == LOG_EVENT_PLAYER_STRONG_ATTACK) {
    logEntery.target = 'Monster';
  } else if (
    ev == LOG_EVENT_MONSTER_ATTACK ||
    ev == LOG_EVENT_PLAYER_HEAL ||
    ev == LOG_EVENT_GAMEOVER
  ) {
    logEntery.target = 'Player';
  }
  battleLog.push(logEntery);
}

function rest() {
  resetGame(chosenMaxLife);
  currentPlayerHealth = chosenMaxLife;
  currentMonsterHealth = chosenMaxLife;
}

function endRound() {
  const initialPlayerHealth = currentPlayerHealth;
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;
  writeToLog(
    LOG_EVENT_MONSTER_ATTACK,
    playerDamage,
    currentMonsterHealth,
    currentPlayerHealth
  );
  if (currentPlayerHealth <= 0 && hasBonusLife) {
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerHealth;
    setPlayerHealth(initialPlayerHealth);
    alert('You would be dead, but bonus life saved you!');
  }
  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert('You won!');
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert('You Lost!');
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
    alert('You have a draw!');
  }
  if (currentPlayerHealth < 0 || currentMonsterHealth < 0) {
    rest();
  }
}

function attackMonster(attackMode) {
  let maxDamage;
  let logevent;
  if (attackMode === MODE_ATTACK) {
    maxDamage = ATTACK_VALUE;
    logevent = MODE_ATTACK;
  } else if (attackMode === MODE_STRONG_ATTACK) {
    maxDamage = STRONG_ATTACK_VALUE;
    logevent = MODE_STRONG_ATTACK;
  }
  const damage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= damage;
  endRound();

  writeToLog(logevent, damage, currentMonsterHealth, currentPlayerHealth);
}

function attackHandler() {
  attackMonster(MODE_ATTACK);
}

function strongAttackHandler() {
  attackMonster(MODE_STRONG_ATTACK);
}

function healPlayerHandler() {
  let healValue;
  if (currentPlayerHealth >= chosenMaxLife - HEAL_PLAYER_VALUE) {
    alert("You can't heal more you max initial value");
    healValue = chosenMaxLife - currentPlayerHealth;
  } else {
    healValue = HEAL_PLAYER_VALUE;
  }
  increasePlayerHealth(healValue);
  currentPlayerHealth += healValue;
  endRound();

  writeToLog(
    LOG_EVENT_PLAYER_HEAL,
    healValue,
    currentMonsterHealth,
    currentPlayerHealth
  );
}

function printToLogHandler() {
  console.log(battleLog);
}
attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayerHandler);
logBtn.addEventListener('click', printToLogHandler);
