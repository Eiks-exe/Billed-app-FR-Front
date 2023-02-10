import { ROUTES_PATH } from '../constants/routes.js'

export default class Logout {
  constructor({ document, onNavigate, localStorage }) {
    console.log(document)
    console.log(onNavigate)
    console.log(localStorage)

    this.document = document
    this.onNavigate = onNavigate
    this.localStorage = localStorage
  }
  
  handleClick = (e) => {
    this.localStorage.clear()
    this.onNavigate(ROUTES_PATH['Login'])
  }

  init() {
    const discoButton = this.document.getElementById('layout-disconnect')
    discoButton.addEventListener('click', this.handleClick)
  }
}