import { transfMoney, createAcc, openBill, exchangeCurr } from "../API/Api";
import { renderAccount, renderBill, reRenderAccount } from '../components/account';
import { renderForm } from "../components/authorize-form";
import { renderDetailAcc } from '../components/billDetails';
import { renderCurrents } from '../components/currents';
import { renderError } from "../components/Error";
import { getBillsFromLS } from "./searchBills";
import { reAuthorize, addBillsToLocalStorage } from "./utility";

function addPaginationListeners(obj) {
  console.log(1)
  console.log(obj)
  const paginationList = document.querySelectorAll('.table__pagination-item');
  paginationList.forEach(item => {
    item.addEventListener('click', (event) => {
        const historyTable = obj.transactions.reverse();
        console.log(historyTable);
    })
})
}

export function addListeners(token) {
  const billsCount = document.querySelectorAll('.account__bill');
  document.querySelector('.account__button').addEventListener('click', async () => {
    try{
      if(billsCount.length >= 9) throw new TypeError('Вы открыли максимальное количество счетов')
      await createAcc(token);
      let data = await reAuthorize(token);
      renderAccount(data.payload);
      addListeners(token);
    } catch(e) {
      renderError(e.message)
    }
  });

  document.querySelector('.header__button').addEventListener('click', () => {
    history.pushState({ 'page_id': 'account' }, null,`/`);
    document.body.innerHTML = '';
    renderForm();
  })

  document.querySelector('.account__select').addEventListener('change', async () => {
    let data = await reAuthorize(token);
    let selectedValue = document.querySelector('.account__select').value;
    let sortedArray;
    if(selectedValue === 'Номер счёта') sortedArray = data.payload.sort((a, b) => b.account - a.account)
    if(selectedValue === 'Баланс') sortedArray = data.payload.sort((a, b) => b.balance - a.balance)
    if(selectedValue === 'Время последней транзации') {
      sortedArray = data.payload.sort((a, b) => {
        a = (a.transactions.length)
            ?
            new Date(a.transactions[0].date).getTime()
            :
            0;
        b = (b.transactions.length)
            ?
            new Date(b.transactions[0].date).getTime()
            :
            0;
        return b-a;
      });
    }
    reRenderAccount(sortedArray);
    addListeners(token);
  })

  document.querySelectorAll('.bill__button').forEach(item => {
    item.addEventListener('click', async function () {
      let bill = item.parentElement.parentElement.firstChild.firstChild.textContent;
      let obj = await openBill(bill, token);
      history.pushState({ 'page_id': 'account' }, null,`?account=${bill}`);
      renderBill(obj.payload);
      addListenersAcc(obj.payload, bill, token);
    })
  })
}

export function addListenersAcc(obj, bill, token) {
  const keyStorage = 'bills';
  const inputNumber = document.querySelector('.input__number');
  const modalInput = document.querySelector('.billing__input-modal');
  const listNumber = document.querySelector('.billing__input-list');

  document.querySelector('.billing__button').addEventListener('click', async () => {
    let data = await reAuthorize(token);
    history.pushState({ 'page_id': 'account' }, null,`?account`);
    renderAccount(data.payload);
    addListeners(token);
  });

  document.querySelector('.billing__form-btn').addEventListener('click', async (e) => {
    try{
      e.preventDefault();

      let transferOpt = {
        myBill: obj.account,
        otherBill: document.querySelector('.input__number').value,
        count: document.querySelector('.input__count').value,
      };
      if(transferOpt.count<=0) throw new TypeError('Сумма перевода должна быть больше нуля');
      addBillsToLocalStorage(keyStorage, transferOpt.otherBill);
      await transfMoney(transferOpt.myBill, transferOpt.otherBill, transferOpt.count, token);
      let newObj = await openBill(bill, token);
      renderBill(newObj.payload);
      addListenersAcc(newObj.payload, bill, token)
    }catch(err) {
      renderError(err.message)
    }
  })

  inputNumber.addEventListener('input', (e) => {
    let value = e.target.value;
    getBillsFromLS(value, keyStorage, listNumber, modalInput, inputNumber);
  });

  document.getElementById('myChart').addEventListener('click', async() => {
    history.pushState({ 'page_id': 'account' }, null,`?history=${bill}`);
    let newObj = await openBill(bill, token);
    renderDetailAcc(newObj.payload);
    addPaginationListeners(newObj.payload);
  })
}

export function addListenersCurr(token) {
  document.querySelector('.exchange__form-button').addEventListener('click', async (e) => {
    try{
      e.preventDefault()
      let from = document.querySelector('.from__select').value;
      let to = document.querySelector('.to__select').value;
      let amount = document.querySelector('.exchange__form-input').value;
      if(amount <= 0) throw new TypeError('Сумма перевода должна быть больше нуля')
      exchangeCurr(from, to, amount, token);
      renderCurrents();
      addListenersCurr(token);
    } catch(err) {
      console.log(err);
      renderError(err.message);
    }
  });
}
