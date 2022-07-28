import { authorization, getAccData } from "../API/Api";
import { renderAccount, renderBill } from '../components/account';
import { renderForm } from '../components/authorize-form';
import { renderCurrents } from '../components/currents';
import { renderMap } from '../components/map';
import { reRenderDetailAcc } from '../components/billDetails';
import { renderError } from '../components/Error';
import { openBill } from "../API/Api";
import { addListeners, addListenersAcc, addListenersCurr } from "./listeners";

//авторизация
export async function authorize() {
    const user = {
      login: document.querySelector('.form__input-login').value.replace(/\s/g, '').trim(),
      password: document.querySelector('.form__input-password').value.replace(/\s/g, '').trim(),
    };

    if(!user.login || !user.password) throw new SyntaxError('Данные некорректны')
    if(!user.login.match(/[a-zA-Z0-9]/)) throw new Error ('Логин должен состоять только из букв и цифр')

    const data = await authorization(user);
    document.cookie = `${encodeURIComponent('authToken')} = ${encodeURIComponent(data.payload.token)}`;
    const answ = await getAccData(data.payload.token);
    return answ;
};

//повторная авторизация
export async function reAuthorize(token) {
  console.log(token);
  const answ = await getAccData(token)
  return answ;
};

export function getMonthBalance(obj, number, bool) {
  const currDate = new Date(new Date().setDate(1));
  currDate.setMonth(currDate.getMonth() + 1 - number);
  const fullDate = currDate.valueOf();

  const numbersOne = obj.transactions.reduce((accumulator, currentValue) => {
    let elDate = new Date(currentValue.date).valueOf();
    let bill = currentValue.to;
    if(elDate <= fullDate && bill === obj.account) return accumulator + currentValue.amount;
    return accumulator;
  }, 0);

  const numbersTwo = obj.transactions.reduce((accumulator, currentValue) => {
    let elDate = new Date(currentValue.date).valueOf();
    let bill = currentValue.from;
    if(elDate <= fullDate && bill === obj.account) return accumulator + currentValue.amount;
    return accumulator;
  }, 0);
  let diff = (bool) ? numbersOne - numbersTwo : numbersTwo;

  return (diff < 0) ? 0 : diff;
}

export function getTimeFormat(string) {
  if(!string) return;
  const regex = /[-.:T]/;
  let arr = string.split(regex);
  [arr[0], arr[1], arr[2]] = [arr[2], arr[1], arr[0]];
  const timeString = `${arr[0]}.${arr[1]}.${arr[2]}`;
  return timeString;
}

export function getDateLongMonth(string) {
  if(!string) return;
  const dateStr = new Date(string);
  let month = dateStr.toLocaleString('default', { month: 'long' });
  month = month.slice(0, -1) + 'я';
  const timeString = `${dateStr.getDate()} ${month} ${dateStr.getFullYear()}`;
  return timeString;
}

export function getMonths(num) {
  const date = new Date();
  const arr = [];
  for (let i = 0; i < num; ++i) {
    let newDate = new Date();
    newDate.setMonth(date.getMonth() - i);
    let newMonth = newDate.toLocaleString('default', { month: 'long' });
    arr.push(newMonth);
  }
  return arr;
}

export async function routePages(path) {
  if (path === '') {
    //если перешли на страницу авторизации
    document.body.innerHTML = '';
    renderForm();
    const btn = document.querySelector('.form__button');
    btn.addEventListener('click', async(e) => {
      e.preventDefault();
      try{
        let data = await authorize();
        history.pushState({ 'page_id': 'account' }, null, '?account');
        renderAccount(data.payload);
        let token = document.cookie.match(/(?<==)[\w]+/)[0];
        addListeners(token);
      }catch(e){
        renderError(e.message);
      }
    });
  } else if (path === '?account') {
    let token = document.cookie.match(/(?<==)[\w]+/)[0];
    try{
      let data = await reAuthorize(token);
      renderAccount(data.payload);
      addListeners(token);
    } catch (err) {
      renderError(err.message);
    }
    //если перешли на страницу счетов

  } else if(path === '?currency'){
    let token = document.cookie.match(/(?<==)[\w]+/)[0];
    //если перешли на страницу валют
    renderCurrents();
    addListenersCurr(token);
  } else if(path === '?map'){
    //если перешли на страницу валют
    renderMap();
  } else if(path.includes('history')){
    //если перешли на страницу валют
    let token = document.cookie.match(/(?<==)[\w]+/)[0];
    let bill = window.location.search.match(/(?<==)[\w]+/)[0];
    let obj = await openBill(bill, token);
    reRenderDetailAcc(obj.payload);
    let btn = document.querySelector('.billing__button');
    // btn.removeEventListener('click', );
    document.querySelector('.billing__button').addEventListener('click', () => {
      history.pushState({ 'page_id': 'account' }, null,`?account=${bill}`);
      renderBill(obj.payload);
      addListenersAcc(obj.payload, bill, token);
    })
  } else {
    let token = document.cookie.match(/(?<==)[\w]+/)[0];
    let bill = window.location.search.match(/(?<==)[\w]+/)[0];
    let obj = await openBill(bill, token);
    renderBill(obj.payload);
    addListenersAcc(obj.payload, bill, token);
  }
}

export function popstateChange() {
  window.addEventListener('popstate', async() => {
    let path = window.location.search;
    if (path === '') {
      document.body.innerHTML = '';
      renderForm();
    } else if (path === '?account') {
      let token = document.cookie.match(/(?<==)[\w]+/)[0];
      let data = await reAuthorize(token);
      renderAccount(data.payload);
      addListeners(token);
    } else if (path === '?currency'){
      renderCurrents();
    } else if (path === '?map'){
      renderMap();
    } else if (path.includes('history')){
      let token = document.cookie.match(/(?<==)[\w]+/)[0];
      let bill = window.location.search.match(/(?<==)[\w]+/)[0];
      let obj = await openBill(bill, token);
      reRenderDetailAcc(obj.payload);
      let btn = document.querySelector('.billing__button');
      btn.removeEventListener('click');
      btn.addEventListener('click', () => {
        history.pushState({ 'page_id': 'account' }, null,`?account=${bill}`);
        renderBill(obj.payload);
        addListenersAcc(obj.payload, bill, token);
      })
    } else {
      let token = document.cookie.match(/(?<==)[\w]+/)[0];
      let bill = window.location.search.match(/(?<==)[\w]+/)[0];
      let obj = await openBill(bill, token);
      renderBill(obj.payload);
      addListenersAcc(obj.payload, bill, token);
    }
  });
}

export function addBillsToLocalStorage(key, transfBill) {
  if(!localStorage.getItem(key)) localStorage.setItem (key, JSON.stringify([transfBill]));
  else {
    let storageArray =  JSON.parse(localStorage.getItem(key));
    storageArray.push(transfBill);
    let newArray = [...new Set(storageArray)];
    localStorage.setItem (key, JSON.stringify(newArray));
  }
}
