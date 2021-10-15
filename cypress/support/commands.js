// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('fillSignupFormAndSubmit', (email, password) => {
	cy.intercept('GET', '**/notes').as('getNotes')
	cy.visit('/signup')
	cy.get('#email').type(email)
	cy.get('#password').type(password, { log: false })
	cy.get('#confirmPassword').type(password, { log: false })
	cy.contains('button', 'Signup').click()
	cy.get('#confirmationCode').should('be.visible')
})

Cypress.Commands.add('login', (
	username = Cypress.env('USER_EMAIL'),
	password = Cypress.env('USER_PASSWORD'),
	{ cacheSession = true } = {}
) => {
	const login = () => {
		cy.visit('/login')
		cy.get('#email').type(Cypress.env('USER_EMAIL'), { log: false })
		cy.get('#password').type(Cypress.env('USER_PASSWORD'), { log: false })
		cy.contains('button', 'Login').click()
		cy.contains('h1', 'Your Notes').should('be.visible')
	}

	if (cacheSession) {
		cy.session([username, password], login)
	} else {
		login()
	}

})

const attachFileHandler = () => cy.get('#file').attachFile('example.json')

Cypress.Commands.add('createNote', (note, attachFile = false) => {
	cy.visit('/notes/new')
	cy.get('#content').type(note)

	if (attachFile) {
		attachFileHandler()
	}

	cy.contains('button', 'Create').click()

	cy.contains('.list-group-item', note).should('be.visible')
})

Cypress.Commands.add('editNote', (note, newValue, attachFile = false) => {
	cy.intercept('GET', '**/notes/**').as('getNote')

	cy.contains('.list-group-item', note).click()
	cy.wait('@getNote')

	cy.get('#content')
		.clear()
		.type(newValue)

	if (attachFile) {
		attachFileHandler()
	}

	cy.contains('button', 'Save').click()

	cy.contains('.list-group-item', note).should('not.exist')
	cy.contains('.list-group-item', newValue).should('be.visible')
})

Cypress.Commands.add('deleteNote', note => {
	cy.contains('.list-group-item', note).click()
	cy.contains('button', 'Delete').click()

	cy.contains('.list-group-item', note).should('not.exist')
})

Cypress.Commands.add('fillSettingsFormAndSubmit', () => {
	cy.visit('/settings')
	cy.get('#storage').type('1')
	cy.get('#name').type('Mary Doe')
	cy.iframe('.card-field iframe')
		.as('iframe')
		.find('[name="cardnumber"]')
		.type('4242424242424242')
	cy.get('@iframe')
		.find('[name="exp-date"]')
		.type('1271')
	cy.get('@iframe')
		.find('[name="cvc"]')
		.type('123')
	cy.get('@iframe')
		.find('[name="postal"]')
		.type('12345')
	cy.contains('button', 'Purchase').click()
})

