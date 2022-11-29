'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
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

const accounts = [account1, account2, account3, account4];

// Elements
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
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//Display transactions and sorting them
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov}€</div>
  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//Calculates account balance using .reduce method and display
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

//Calculate and displays the summary
const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => (acc += mov), 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => (acc += mov), 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interset = account.movements
    .filter(mov => mov > 0)
    .map(deposite => (deposite * account.interestRate) / 100)
    .filter((int, i, arr) => int >= 1)
    .reduce((acc, int) => (acc += int), 0);
  labelSumInterest.textContent = `${Math.abs(interset).toFixed(2)}€`;
};

//Creates shorter user names from full names using .map metod
const createUserNames = function (accs) {
  //foreach method creates a side effect on the account sobjects
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUserNames(accounts);

let currentAccount;

//Update and Display movements, balance, summary
const updateUI = function (currentAccount) {
  displayMovements(currentAccount.movements);
  calcDisplayBalance(currentAccount);
  calcDisplaySummary(currentAccount);
};

//Loging in to an account
btnLogin.addEventListener('click', function (e) {
  //Prevent form from submitting
  e.preventDefault();

  //Sets current account to logged in user
  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and message
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //Clear input fields
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();

    //Update UI
    updateUI(currentAccount);
  }
});

//Transfer money from yours to others
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reserverAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    reserverAcc &&
    currentAccount.balance >= amount &&
    currentAccount.userName !== reserverAcc.userName
  ) {
    //Doing the transfer
    currentAccount.movements.push(-amount);
    reserverAcc.movements.push(amount);

    //Update UI
    updateUI(currentAccount);
  }
});

//Close your account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    currentAccount.userName === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.userName === currentAccount.userName
    );
    // console.log(index);
    accounts.splice(index, 1);

    //Hide UI
    containerApp.style.opacity = 0;

    //Reset Welcome label
    labelWelcome.textContent = `Log in to get started`;
  }
  //Clear input fields
  inputCloseUsername.value = '';
  inputClosePin.value = '';
  inputCloseUsername.blur();
});

//Requesting for a loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.balance > 0 &&
    currentAccount.movements.some(mov => mov >= amount * 0.1)
  ) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

//Sort or unsort the movements
let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// /////////////////////////////////////////////////

//For Each
// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`Movement ${i + 1}: You deposited ${movement}`);
//   } else {
//     console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
//   }
// }
// console.log('-----FOR EACH--------');

// //continue and break statements will not work with .forEach
// movements.forEach(function (mov, i, arr) {
//   if (mov > 0) {
//     console.log(`Movement ${i + 1}: You deposited ${mov}`);
//   } else {
//     console.log(`Movement ${i + 1}: You withdrew ${Math.abs(mov)}`);
//   }
// });

// //SLICE - Does not mutate original array
// let arr = ['a', 'b', 'c', 'd', 'e'];
// console.log(arr.slice(2));
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-1));
// console.log(arr.slice(1, -2));
// console.log(arr.slice()); //To make a shallow copy of an array

// //SPLICE - Mutates original array
// // console.log(arr.splice(2));
// arr.splice(-1);
// arr.splice(1, 2); //Go to position one and delete two elements
// console.log(arr);

// //REVERSE - Mutates the original array
// arr = ['a', 'b', 'c', 'd', 'e'];
// const arr2 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr2.reverse());
// console.log(arr2);

// //Concat
// const letters = arr.concat(arr2);
// console.log(letters);
// console.log([...arr, ...arr2]);

// //Join
// console.log(letters.join('-'));

// const arr = [23, 11, 64];
// console.log(arr[0]);
// console.log(arr.at(0));

// //Ways to get last element
// console.log(arr[arr.length - 1]);
// console.log(...arr.slice(-1));

// //Last element with .at
// console.log(arr.at(-1));
// console.log('Jonas'.at(-1));

//For each with a Map
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (vale, key, map) {
//   console.log(`${key}: ${vale}`);
// });

// //ForEach with a Set
// const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);

// console.log(currenciesUnique);

// currenciesUnique.forEach(function (value, _, set) {
//   console.log(`${value}`);
// });

//1.

// const checkDogs = function (juliaData, KateData) {
//   const juliaCopy = juliaData.slice();
//   const juliaCorrected = juliaCopy.slice(1, -2);
//   const collection = juliaCorrected.concat(KateData);
//   collection.forEach(function (age, i) {
//     if (age >= 3) {
//       console.log(`Dog number ${i + 1} is an adult, and is ${age} years old`);
//     } else {
//       console.log(`Dog number ${i + 1} is still a puppy ⚽`);
//     }
//   });
// };

// checkDogs(juliaData, KateData);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const eurToUsd = 1.1;

// const movementsUSD = movements.map(mov => mov * eurToUsd);

// console.log(movements);
// console.log(movementsUSD);

// const movementDescriptions = movements.map(
//   (mov, i) =>
//     `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
//       mov
//     )}`
// );

// console.log(movementDescriptions);

// const deposits = movements.filter(mov => mov > 0);

// const withdrawals = movements.filter(mov => mov < 0);

// console.log(movements);
// console.log(deposits);
// console.log(withdrawals);

// console.log(movements);

//Accumulator is like a snow ball
// const balance = movements.reduce(function (acc, cur, i, arr) {
//   console.log(`Iteration ${i}: Accumilator value: ${acc}`);
//   return acc + cur;
// }, 0);

// const balance = movements.reduce((acc, cur) => acc + cur, 0);
// console.log(balance);

//Maximum value
// const maxValue = movements.reduce(
//   (acc, mov) => (acc < mov ? (acc = mov) : acc),
//   0
// );

// console.log(maxValue);

// const juliaData = [5, 2, 4, 1, 15, 8, 3];
// const KateData = [16, 6, 10, 5, 6, 1, 4];

// const ages = function calcAverageHumanAge(arr1) {
//   const humanAge = arr1.map(dogAge =>
//     dogAge > 2 ? 16 + 4 * dogAge : 2 * dogAge
//   );
//   console.log(humanAge);

//   const adultDogs = humanAge.filter(dogAge => dogAge >= 18);
//   console.log(adultDogs);

//   const average = adultDogs.reduce(
//     (acc, age) => (acc += age / adultDogs.length),
//     0
//   );
//   return average;
// };

// const ages = function calcAverageHumanAge(arr1) {
//   return arr1
//     .map(dogAge => (dogAge > 2 ? 16 + 4 * dogAge : 2 * dogAge))
//     .filter(dogAge => dogAge >= 18)
//     .reduce((acc, age, i, arr) => (acc += age / arr.length), 0);
// };

// console.log(ages(juliaData));
// console.log(ages(KateData));
// console.log(ages(dogAges));

// const euroToUSD = 1.1;

// //PIPELINE
// const sumOfUSDValues = function (movements) {
//   return movements
//     .filter(mov => mov > 0)
//     .map((mov, i, arr) => {
//       console.log(arr);
//       return mov * euroToUSD;
//     })
//     .reduce((acc, mov) => (acc += mov), 0);
// };

// console.log(sumOfUSDValues(movements));

// const firstWithdrawal = movements.find(mov => mov < 0);
// console.log(movements);
// console.log(firstWithdrawal);

// console.log(accounts);

// const account = accounts.find(acc => acc.owner === 'Jessica Davis');

// const acc = function (accs) {
//   for (const acc of accounts) {
//     if (acc.owner === 'Jessica Davis') {
//       return acc;
//     }
//   }
// };

// console.log(account);
// console.log(acc(accounts));

// console.log(movements);

// //EQUALITY
// console.log(movements.includes(-130));

// //CONDITION
// console.log(movements.some(mov => mov > 0));

// Every
// console.log(account4.movements.every(deposit));

//Seperate call back
// const deposit = mov => mov > 0;
// console.log(account4.movements.every(deposit));
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat());

// const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
// console.log(arrDeep.flat(2));

// const accountMovements = accounts.map(acc => acc.movements);
// console.log(accountMovements);

// const allMovements = accountMovements.flat();
// console.log(allMovements);

// const overallBalance = allMovements.reduce((acc, mov) => (acc += mov), 0);
// console.log(overallBalance);

// //with .flat() method
// const overallBalance2 = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, mov) => (acc += mov), 0);
// console.log(overallBalance2);

// //with .flatmap method
// const overallBalance3 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, mov) => (acc += mov), 0);

// console.log(overallBalance3);

// //Strings
// const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
// console.log(owners.sort());
// console.log(owners);

// //Numbers
// console.log(movements);

//Accending
//return < 0, A,B (keep order)
//return > 0, B,A (switch order)
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (a < b) return -1;
// });

// movements.sort((a, b) => a - b);
// console.log(movements);

// movements.sort((a, b) => b - a);
// console.log(movements);

// //Decsending
// movements.sort((a, b) => {
//   if (a > b) return -1;
//   if (a < b) return 1;
// });
// console.log(movements);

// //.fill method
// const arr = [1, 2, 3, 4, 5, 6, 7];
// console.log(new Array(1, 2, 3, 4, 5, 6, 7));

// const x = new Array(7);
// console.log(x);

// // x.fill(1);
// x.fill(1, 3, 5);
// console.log(x);

// arr.fill(23, 2, 6);
// console.log(arr);

// //Array.from
// const y = Array.from({ length: 7 }, ele => 1);
// console.log(y);

// const z = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(z);

// const diceRolls = Array.from({ length: 100 }, ele =>
//   Math.trunc(Math.random() * 6 + 1)
// );
// console.log(diceRolls);

// labelBalance.addEventListener('click', function () {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value'), //.querySelector returns a node list
//     el => Number(el.textContent.replace('€', ''))
//   );
//   console.log(movementsUI);
// });

// const movementsUI2 = [...document.querySelectorAll('.movements__value')];
// console.log(movementsUI2);

// //1.
// const bankDepositSum = accounts
//   .flatMap(acct => acct.movements)
//   .filter(mov => mov > 0)
//   .reduce((acc, mov) => (acc += mov), 0);
// console.log(bankDepositSum);

// //2.
// // const numDeposites1000 = accounts
// //   .flatMap(acct => acct.movements)
// //   .filter(mov => mov > 1000).length;

// const numDeposites1000 = accounts
//   .flatMap(acct => acct.movements)
//   .reduce((count, mov) => (mov > 1000 ? ++count : count), 0); //prefixed plus operator was used
// console.log(numDeposites1000);

// //3.
// const { deposits, withdrawals } = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sums, cur) => {
//       cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
//       return sums;
//     },
//     { deposits: 0, withdrawals: 0 }
//   );

// // console.log(sums);
// console.log(deposits, withdrawals);

//4.
// const convertTitleCase = function (string) {
//   const exceptions = ['a', 'an', 'the', 'but', 'or', 'on', 'in', 'with', 'and'];

//   const capitalize = str => str.replace(str[0], str.charAt(0).toUpperCase());

//   const titleCase = string
//     .toLowerCase()
//     .split(' ')
//     .map(word => (exceptions.includes(word) ? word : capitalize(word)))
//     .join(' ');
//   return capitalize(titleCase);
// };

// console.log(
//   convertTitleCase('and this is a NICE title on the paPer that I saw')
// );

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];
//1.
//Calculate recommended food portion and add to the object
const addRecFoodPortion = dogs.forEach(function (dog, i, dogs) {
  dog.recFood = Number((dog.weight ** 0.75 * 28).toFixed(2));
});

console.log(dogs);

// 2. Sahah's dog
const saraDog = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(
  `Sarah's dog is eating too ${
    saraDog.curFood > saraDog.recFood ? 'much' : 'little'
  } food`
);

//3. ,4.

const dogOwners = function (dogs) {
  const owners = dogs
    .filter(dog => dog.curFood > dog.recFood * 1.1)
    .flatMap(ele => ele.owners);

  return owners;
};

console.log(dogOwners(dogs));
console.log(`${dogOwners(dogs).join(' and ')}'s dogs eat too much`);

const ownersEatTooLess = dogs
  .filter(dog => dog.curFood < dog.recFood * 0.9)
  .flatMap(ele => ele.owners);
console.log(ownersEatTooLess);

console.log(`${ownersEatTooLess.join(' and ')}'s dogs eat too less`);

// 5. , 6.
console.log(
  dogs.some(
    dog => dog.recFood * 1.1 >= dog.curFood && dog.curFood >= dog.recFood * 0.9
  )
);

//7.
const inRangeDogs = dogs.filter(
  dog => dog.recFood * 1.1 >= dog.curFood && dog.curFood >= dog.recFood * 0.9
);

console.log(inRangeDogs);

//8.
const dogsCopy = dogs.slice().sort((a, b) => a.recFood - b.recFood);
console.log(dogsCopy);
