/**
 * @jest-environment jsdom
 */

import { fireEvent, screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES, ROUTES_PATH} from "../constants/routes.js";
import userEvent from "@testing-library/user-event";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store.js"
import router from "../app/Router.js"
import * as fs from "fs";

jest.mock("../app/Store.js", () => mockStore)

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then go nowhere", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      document.body.innerHTML = NewBillUI();

      const store = null
      const billsObj = new NewBill({ document, onNavigate, store, localStorage })
      const handleSubmit = jest.fn(billsObj.handleSubmit)
      //const form = screen.getByTestId("form-new-bill");
      const form = screen.getByRole("new-bill-form");
      form.addEventListener("submit", handleSubmit);
      const newBill = screen.getByTestId('btn-send-bill')
      userEvent.click(newBill)
      expect(handleSubmit).toHaveBeenCalled()
      expect(form).toBeTruthy()
    })
  })
})