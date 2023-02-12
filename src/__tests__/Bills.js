/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockstore from "../__mocks__/store"
import DashboardUI from "../views/DashboardUI"

jest.mock('./Logout', () => jest.fn());
import Logout from "../containers/Logout.js"
import Bills from '../containers/Bills.js'
import userEvent from "@testing-library/user-event";

import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression

    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })
})

// describe("Given i am connected as an employee", ()=>{
//   describe('When i am on Bills page and i click on NewBill', ()=>{
//     test(('Then, i should be sent to newBill page'), ()=>{

//     })
//   })
// })

// describe("Given i am connected as an employee", ()=>{
//   describe('When i am on Bills page and i click on NewBill', ()=>{
//     test(('Then, i should be sent to newBill page'), ()=>{

//     })
//   })
// })


describe('Given I am connected as an employee', () => {
  describe('Given I am connected as an employee', ()=> {
    test('it should be initialyzed', ()=> {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
  
      Object.defineProperty(window, 'localStorage', { value: localStorageMock });
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }));
  
      const bills = new Bills({document, onNavigate, localStorageMock})
      expect(bills).toBeInstanceOf(Bills);
    })
  })
  
  describe('When I click on disconnect button', () => {
    test('Then, a logout instance should be created ', () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      Object.defineProperty(window, 'localStorage', { value: localStorageMock });
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }));

      const logout = new Logout({ document, onNavigate, localStorage });
      const logoutInitSpy = jest.spyOn(logout, 'init');
      logout.init();

      expect(logoutInitSpy).toHaveBeenCalled();
    });
  });
  describe('When I am on Bills Page and i click on NewBill', () => {
    test(('Then, I should be sent to newBill page'), () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      document.body.innerHTML = BillsUI({ data: bills })
      const store = null
      const billsObj = new Bills({ document, onNavigate, store, localStorage })
      const handleClick = jest.fn(billsObj.handleClickNewBill )

      const newBill = screen.getByTestId('btn-new-bill')
      newBill.addEventListener('click', handleClick)
      userEvent.click(newBill)
      expect(handleClick).toHaveBeenCalled()
      expect(screen.getByText('Envoyer une note de frais')).toBeTruthy()
    })
  })
  describe('When I am on Bills Page', () => {
    test(('Then, I should see a list of bill'), async () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      document.body.innerHTML = BillsUI({ data: bills })
      const store = mockstore;
      const consoleSpy = jest.spyOn(console, "log");
      const billsObj = new Bills({ document, onNavigate, store, localStorage })
      const handleMethod = jest.fn(billsObj.getBills)
      const result = await handleMethod()

      const billsTable = screen.getByTestId('tbody')
      const numberOfBill = billsTable.children.length;
      expect(handleMethod).toHaveBeenCalled()
      expect(consoleSpy).toHaveBeenCalledWith('length', result.length);
      expect(bills.length == numberOfBill).toBeTruthy()
    })
    
    describe('When I am on Bills Page', () => {
      test(('Then, I should see a error'), async () => {
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))
        document.body.innerHTML = BillsUI({ data: bills, error: 'errorDetected' })
        expect(screen.getByTestId('error-message').textContent).toContain('errorDetected');
      })
    })

    describe('When I click on a eye icon', () => {
      test(('Then, I should see a modal opening'), async () => {
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        //Object.defineProperty(window, 'modal', { value: jest.fn })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))
        document.body.innerHTML = BillsUI({ data: bills })
        const store = mockstore;
        const billsObj = new Bills({ document, onNavigate, store, localStorage })
        const handleClick = jest.fn(billsObj.handleClickIconEye)
        
        const iconEye = screen.queryAllByTestId('icon-eye')[0];
        //@ts-ignore
        iconEye.addEventListener('click', handleClick(iconEye));
        
        userEvent.click(iconEye);
        //@ts-ignore
        expect(handleClick).toHaveBeenCalled();
        await new Promise((r) => setTimeout(r, 1000));
        expect(screen.getByTestId('modaleFile').classList.contains('show')).toBeTruthy();
      })
    })
  })
});




// describe('Bills', () => {
//   let document;
//   let onNavigate;
//   let store;
//   let localStorage;
//   let bills;

//   beforeEach(() => {
//     document = {
//       querySelector: jest.fn(),
//       querySelectorAll: jest.fn(),
//     };
//     onNavigate = jest.fn();
//     store = {
//       bills: jest.fn(() => ({
//         list: jest.fn(() => Promise.resolve([{
//           date: '2022-01-01',
//           status: 'paid',
//         }])),
//       })),
//     };
//     localStorage = {
//       clear: jest.fn(),
//       getItem: jest.fn(),
//       removeItem: jest.fn(),
//       setItem: jest.fn(),
//     };
//     bills = new Bills({ document, onNavigate, store, localStorage });
//   });

//   it('should initialize', () => {
//     expect(bills).toBeInstanceOf(Bills);
//   });

//   it('should initialize the Logout instance', () => {
//     const logout = require('./Logout');
//     expect(logout).toHaveBeenCalledWith({ document, localStorage, onNavigate });
//   });

//   it('should call handleClickNewBill when the button "New Bill" is clicked', () => {
//     const buttonNewBill = {
//       addEventListener: jest.fn(),
//     };
//     document.querySelector.mockReturnValue(buttonNewBill);
//     bills = new Bills({ document, onNavigate, store, localStorage });
//     buttonNewBill.addEventListener.mock.calls[0][1]();
//     expect(onNavigate).toHaveBeenCalledWith('ROUTES_PATH["NewBill"]');
//   });

//   it('should call handleClickIconEye when an eye icon is clicked', () => {
//     const iconEye = [      {        addEventListener: jest.fn(),        getAttribute: jest.fn(() => 'bill-url'),      },    ];
//     document.querySelectorAll.mockReturnValue(iconEye);
//     bills = new Bills({ document, onNavigate, store, localStorage });
//     iconEye[0].addEventListener.mock.calls[0][1]();
//     expect(iconEye[0].getAttribute).toHaveBeenCalledWith('data-bill-url');
//     expect(iconEye[0].addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
//   });

//   it('should get the list of bills', async () => {
//     const result = await bills.getBills();
//     expect(result).toEqual([{
//       date: '2022-01-01',
//       status: 'Paid',
//     }]);
//   });
// });