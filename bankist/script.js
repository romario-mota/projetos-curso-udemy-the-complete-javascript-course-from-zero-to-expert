'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2021-07-01T14:11:59.604Z',
    '2021-07-03T17:01:17.194Z',
    '2021-07-04T23:36:17.929Z',
    '2021-07-05T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

/*
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};
*/

const accounts = [account1, account2 /*, account3, account4*/];

// ELements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransfer = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUserName = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

let currentAccount, timer, time;

const startTimer = () => {
  time = 300;
  clearInterval(timer);
  tick();
  timer = setInterval(tick, 1000);
};

const tick = () => {
  const minute = time / 60;
  const second = time % 60;

  labelTimer.textContent = `${String(Math.trunc(minute)).padStart(
    2,
    '0'
  )}:${String(Math.trunc(second)).padStart(2, '0')}`;

  if (time === 0) logout();

  time--;
};

const displayMovimentDate = (date, locale) => {
  const calcDaysPassed = (date1, date2) =>
    Math.round((date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(date, Date.now());
  if (daysPassed === 0) return 'today';
  if (daysPassed === 1) return 'yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  const now = date;

  /*return `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${now.getFullYear().toString().padStart(4)}`;*/

  return Intl.DateTimeFormat(locale).format(now);
};

const formatCurrency = (value, locale, currency) => {
  return Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = (acc, sorted = 0) => {
  containerMovements.innerHTML = '';
  let movs;

  if (sorted === -1) movs = acc.movements.slice().sort((a, b) => b - a);
  else if (sorted === 1) movs = acc.movements.slice().sort((a, b) => a - b);
  else movs = acc.movements;
  movs.forEach(function (mov, index) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const now = new Date(acc.movementsDates[index]);
    const displayDate = displayMovimentDate(now, acc.locale);
    const formatedMovValue = formatCurrency(
      mov,
      currentAccount.locale,
      currentAccount.currency
    );
    const html = ` <div class="movements__row">
                    <div class="movements__type movements__type--${type}">${index} ${type}</div>
                    <div class="movements__date">${displayDate}</div>
                    <div class="movements__value">${formatedMovValue}</div>
                  </div>
                  `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const createUserName = function (accs) {
  accs.forEach(ac => {
    ac.username = ac.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUserName(accounts);

const calcDisplaySummary = acc => {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCurrency(
    incomes,
    currentAccount.locale,
    currentAccount.currency
  );
  const out = acc.movements
    .filter(mov => mov <= 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCurrency(
    Math.abs(out),
    currentAccount.locale,
    currentAccount.currency
  );

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCurrency(
    interest,
    currentAccount.locale,
    currentAccount.currency
  );
};

const calcDisplayBalance = acc => {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = formatCurrency(
    acc.balance,
    currentAccount.locale,
    currentAccount.currency
  );
};

btnLogin.addEventListener('click', e => {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Update UI and Message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginUsername.blur();

    const now = new Date();

    /*const displayDate = `${now.getDate().toString().padStart(2, '0')}/${(
      now.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}/${now.getFullYear().toString().padStart(4)} ${now
      .getHours()
      .toString()
      .padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;*/

    const options = {
      minute: 'numeric',
      hour: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    };
    const displayDate = Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    labelDate.textContent = `${displayDate}`;

    updateUI(currentAccount);
    containerApp.style.opacity = 100;

    startTimer();
  }
});

const updateUI = function (acc) {
  // Display Movemets
  displayMovements(acc);
  // Calc and Display Balance
  calcDisplayBalance(acc);
  // Calc and Displcay Summary
  calcDisplaySummary(acc);
};

const logout = () => {
  labelWelcome.textContent = 'Login to get started';
  containerApp.style.opacity = 0;
  clearInterval(timer);
};

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const accountTo = accounts.find(acc => acc.username === inputTransfer.value);
  if (
    amount > 0 &&
    accountTo &&
    currentAccount.balance >= amount &&
    currentAccount.username !== accountTo.username
  ) {
    currentAccount.movements.push(-amount);
    accountTo.movements.push(amount);

    currentAccount.movementsDates.push(new Date().toISOString());
    accountTo.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);
    inputTransfer.value = inputTransferAmount.value = '';
    startTimer();
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    currentAccount.username === inputCloseUserName.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    logout();
  }
});

btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(() => {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
    }, 5000);
  }
  inputLoanAmount.value = '';
  startTimer();
});

let sorted = 0;
btnSort.addEventListener('click', e => {
  e.preventDefault();
  if (sorted == 0) sorted = 1;
  else if (sorted == 1) sorted = -1;
  else sorted = 0;
  displayMovements(currentAccount, sorted);
});

/*

// # Code Challenge
const checkDogs = function (dogsJulia, dogsKate) {
  const dogsJuliaCorrect = dogsJulia.slice(); // faz uma cópia do array
  dogsJuliaCorrect.splice(0, 1); // remove o elemento da posicao 0
  dogsJuliaCorrect.splice(-2); // remove os dois ultimos elementos

  console.log(dogsJuliaCorrect);
  const totalDogs = [...dogsJuliaCorrect, ...dogsKate];

  totalDogs.forEach(function (dog, index) {
    const isAdult = dog >= 3;
    console.log(
      isAdult
        ? `Dog number ${index + 1}
  is an adult, and is ${dog} years old`
        : `Dog number ${index + 1} is still a puppy`
    );
  });
};

checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);

*/

// MAP FUNCTION

/*
const eurToUsd = 1.1;
const newArray = account1.movements.map(function (mov) {
  return mov * eurToUsd;
});
console.log(newArray);
console.log(account1.movements);

const newArrayFor = [];
for (const mov of account1.movements) newArrayFor.push(mov * eurToUsd);
console.log(newArrayFor);

const newArrayArrow = account1.movements.map(mov => mov * eurToUsd);
console.log(newArrayArrow);

const arrString = account1.movements.map(
  (mov, i) =>
    `Movement ${i + 1}: You is ${
      mov > 0 ? 'deposit' : 'withdrwal'
    } value ${mov}`
);

console.log(arrString);

*/

/*
// FILTER FUNCTiON
const deposit = account1.movements.filter(function (mov, i, arr) {
  return mov > 0;
});

console.log(deposit);

// usando for of
const depositFor = [];
for (const m1 of account1.movements) {
  if (m1 > 0) {
    depositFor.push(m1);
  }
}
console.log(depositFor);

const withdrawalArrow = account1.movements.filter(mov => mov < 0);
console.log(withdrawalArrow);
*/

// REDUCE METHOD

/*
const balance = account1.movements.reduce((acc, cur, i, arr) => acc + cur);
console.log(balance);
const maxMov = account1.movements.reduce((acc, cur) => {
  if (acc > cur) return acc;
  else return cur;
});

console.log(maxMov);

// for of

let balanceFor = 0;
for (const mov of account1.movements) {
  balanceFor += mov;
}
console.log(balanceFor);
*/

/*
// Code Challenge #2
const calcAverageHummanAge = dogsAge => {
  const humanDogsAge = dogsAge.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
  const adults = humanDogsAge.filter(humanAge => humanAge >= 18);
  const avg = adults.reduce((acc, curr, i, array) => {
    console.log(acc, curr, i, array.length);
    return acc + curr / array.length;
  }, 0);

  console.log(humanDogsAge);
  console.log(adults);
  console.log(`The average of human age dogs is ${avg} year.`);
};

calcAverageHummanAge([5, 2, 4, 1, 15, 8, 3]);
console.log('-----------------');
calcAverageHummanAge([16, 6, 10, 5, 6, 1, 4]);
*/

/*
// Code Challenge #3
const calcAverageHummanAge = dogsAge => {
  const average = dogsAge
    .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter(humanAge => humanAge >= 18)
    .reduce((acc, humanAge, i, array) => acc + humanAge / array.length, 0);

  console.log(`The average of human age dogs is ${average} year.`);
};

calcAverageHummanAge([5, 2, 4, 1, 15, 8, 3]);
console.log('-----------------');
calcAverageHummanAge([16, 6, 10, 5, 6, 1, 4]);*/

// FIND METHOD -> retorno o primeiro elemento do array baseado na condição especificada
/*const acc = accounts.find(acc => acc.user === 'jd');
console.log(acc);
*/

/*
// some and every METHOD
// valida pela igualdade de elementos
console.log(account1.movements.includes(-1300));

// some -> valida pela condição estabelecida
// verifica se existe algum movimento maior que 0
console.log(account1.movements.some(mov => mov > 0));

// every -> verificar se todos os elementos do array atendem a condição estabelecida
console.log(account4.movements.every(mov => mov > 0)); // true
console.log(account1.movements.every(mov => mov > 0)); // false
*/

/*

// FLAT e FLAMAP
// flat nivela os sub arrays em um unico array de acordo com o niel de profundidade espcificado
// padrão é nivel 1
const arr = [1, 2, , [3, [4, 5]]];
const aflat = arr.flat(2);
//console.log(aflat);

// flat map é identinco a um map seguido de um flat de nivel 1
// solução com map e flat
const mmov = accounts.map(cc => cc.movements).flat();
const ssoma = mmov.reduce((acc, mov) => acc + mov, 0);
console.log(ssoma);

// solução com flatMap
const fmov = accounts.flatMap(acc => acc.movements);
const fsoma = fmov.reduce((acc, m) => acc + m, 0);
console.log(fsoma);

*/

/*

// SORT
// ele funciona bem com strings
const n = ['maria', 'joao', 'raimundo'];
console.log(n.sort());

// mas com nnumero não funciona bem da forma correta, pq na verdade ele transforma tudo em string antes de classificar
console.log(account1.movements.sort());

// para resolver deve-se passar uma função de callback que vai indicar como deve ser a classificação
// se a função retonar um numero positivo a classificação será crescnete, caso contratio, decrescente
// ordem crescente
const cl = account1.movements.sort((a, b) => {
  if (a > b) return 1;
  if (a < b) return -1;
});
console.log(cl);
// ordem decrescente
const cl1 = account1.movements.sort((a, b) => {
  if (a > b) return -1;
  if (a < b) return 1;
});
console.log(cl1);
// forma simplificada
const cl2 = account1.movements.sort((a, b) => a - b);
console.log(cl2);

*/

/*
const a = new Array(100);
const arr = Array.from(a, (el, i) => i + 1);
console.log(arr);
console.log(Math.floor(Math.random() * 100));
console.log(Array.from('ROMARIO', l => `->${l}`));

*/

// Array Method Practice

// 1.

/*const depositSum = accounts
  .map(mov => mov.movements)
  .flat()
  .filter(mov => mov > 0)
  .reduce((sum, cur) => sum + cur, 0);
console.log(depositSum);

const depositSumFlatMap = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((sum, cur) => sum + cur, 0);
console.log(depositSumFlatMap);
*/

/*
const bankSum = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sum, cur) => {
      //cur > 0 ? (sum.deposit += cur) : (sum.withdrawal += cur);
      sum[cur > 0 ? 'deposit' : 'withdrawal'] += cur;
      return sum;
    },
    { deposit: 0, withdrawal: 0 }
  );

console.log(bankSum);

*/

/*
// Code Challange #4
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

//1.
dogs.forEach(
  dog => (dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28))
);
console.log(dogs);

//2.
const sarasDog = dogs.find(dog =>
  dog.owners.some(owner => owner.trim() === 'Sarah')
);

if (sarasDog.curFood > sarasDog.recommendedFood * 1.1)
  console.log('Comendo demais');
else if (sarasDog.curFood < sarasDog.recommendedFood * 0.9)
  console.log('Comendo pouco');
else console.log('Porção correta');

console.log(
  sarasDog.curFood > sarasDog.recommendedFood
    ? 'Comendo muito'
    : 'Comendo pouco'
);

//3.
const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recommendedFood)
  .flatMap(dg => dg.owners);

const ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recommendedFood)
  .flatMap(dgs => dgs.owners);

console.log(ownersEatTooMuch);
console.log(ownersEatTooLittle);

// 4.0
console.log(
  `${ownersEatTooMuch.reduce((msg, cur, i) => {
    i === 0 ? (msg += `${cur}`) : (msg += ` and ${cur}`);
    return msg;
  }, '')}'s dogs eat too much!`
);
console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);

console.log(
  `${ownersEatTooLittle.reduce((msg, cur, i) => {
    i === 0 ? (msg += `${cur}`) : (msg += ` and ${cur}`);
    return msg;
  }, '')}'s dogs eat too little!`
);

console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little!`);

// 5.
const exactly = dogs.some(dog => dog.curFood === dog.recommendedFood);

console.log(exactly);

// 6.
const checkEaet = dog =>
  dog.curFood >= dog.recommendedFood * 0.9 &&
  dog.curFood <= dog.recommendedFood * 1.1;

const okay = dogs.some(checkEaet);

console.log(okay);

// 7.
const okayDogs = dogs.filter(checkEaet);

console.log(okayDogs);

// 8.
const copy = dogs.slice();
copy.sort((a, b) => a.recommendedFood - b.recommendedFood);
console.log(copy);

*/

// NUmber
/*console.log(+'1');
console.log(Number.parseInt('1px', 10));
console.log(Number.isInteger(10));
console.log(Number.parseFloat('10.30').toFixed(2));*/

// Date
/*const d = new Date(2021, 0, 31);
console.log(d);
d.setMonth(d.getMonth() + 1);
console.log(d);*/

//date.setMonth(date.getMonth() + 2);
//console.log(date);

// Date operation

/*
const calcDaysPassed = (date1, date2) =>
  Math.round(date2 - date1) / 1000 / 60 / 60 / 24;
const daysPassed = calcDaysPassed(new Date(2021, 5, 10), new Date(2021, 6, 5));
console.log(daysPassed);
*/

/*
// setTimeout
const timer = setTimeout(
  (p1, p2) => console.log('Sua pizza ', p1, p2),
  3000,
  '1',
  '2'
);
console.log('Aguardando....', timer);
clearTimeout(timer);

// set Interval
const interval = setInterval(() => {
  console.log(new Date().toTimeString());
}, 1000);
console.log(interval);

*/
