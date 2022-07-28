import { renderError } from "../components/Error";


export async function getAccData(token) {
  console.log(token)
  let response = await fetch('http://localhost:3000/accounts', {
    method: 'GET',
    headers: {
      Authorization: `Basic ${token}`,
    },
  })
  let data = await response.json();
  return data;
};

export async function authorization(obj) {
  const response = await fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj)
  });

  const data = await response.json();
  return data;
}

export async function createAcc(token) {
  const response = await fetch('http://localhost:3000/create-account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${token}`,
    },
    body:'',
  });
  const data = await response.json();
};

export async function transfMoney(fromAcc, toAcc, amount, token) {
  const response = await fetch('http://localhost:3000/transfer-funds', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${token}`,
    },
    body: JSON.stringify({
    	from: fromAcc, // счёт с которого списываются средства
    	to: toAcc, // счёт, на который зачисляются средства
	    amount: amount // сумма для перевода
    }),
  });
  const data = await response.json();
  console.log(data);
};

export async function openBill(id, token) {
  const response = await fetch(`http://localhost:3000/account/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${token}`,
    },
  });
  const data = await response.json();
  console.log(data);
  return data;
}

export async function getAllCrypto(token) {
  const response = await fetch(`http://localhost:3000/all-currencies`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${token}`,
    },
  });
  const data = await response.json();
  return data;
}

export async function getAccountCrypto(token) {
  const response = await fetch(`http://localhost:3000/currencies`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${token}`,
    },
  });
  const data = await response.json();
  return data;
}

export async function exchangeCurr(from, to, amount, token) {
  const response = await fetch('http://localhost:3000/currency-buy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${token}`,
    },
    body: JSON.stringify({
    	from: from, // счёт с которого списываются средства
    	to: to, // счёт, на который зачисляются средства
	    amount: amount // сумма для перевода
    }),
  })
  const data = await response.json();
  console.log(data);
  if(data.error === `Not enough currency` || data.error === `Overdraft prevented`) renderError('Недостаточно средств на вашем счете!');
}

export async function getBanksPosition (token) {
  const response = await fetch('http://localhost:3000/banks', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${token}`,
    },
  });
  const data = await response.json();
  return data;
}
