describe('Validação Avançada de Campos - Portfólio do Sady', () => {

  beforeEach(() => {
    cy.visit('index.html')
  })

  // === SEUS 6 TESTES ORIGINAIS (MANTIDOS IGUAIS) ===

  it('1. Deve permitir uma postagem normal dentro do limite', () => {
    cy.get('#campo-postagem').type('Minha primeira postagem oficial de testes.')
    cy.get('#btn-publicar').click()
    cy.get('#mensagem-alerta').should('contain', 'Postado com sucesso!')
  })

  it('2. Deve cortar o texto quando ultrapassar o limite de 100 caracteres', () => {
    const textoMuitoLongo = 'A'.repeat(150)
    cy.get('#campo-postagem').type(textoMuitoLongo, { delay: 0 })
    cy.get('#campo-postagem').should('have.value', 'A'.repeat(100))
  })

  it('3. Deve aceitar injeção de caracteres especiais com sucesso', () => {
    const textoEspecial = 'Postagem #Foco @QA_2026 $Sucesso!'
    cy.get('#campo-postagem').type(textoEspecial)
    cy.get('#btn-publicar').click()
    cy.get('#mensagem-alerta').should('contain', 'Postado com sucesso!')
  })

  it('4. Deve exibir erro se o usuário tentar publicar o campo vazio', () => {
    cy.get('#btn-publicar').click()
    cy.get('#mensagem-alerta').should('contain', 'Erro: O campo não pode ficar vazio!')
  })

  it('5. Deve limpar espaços inúteis nas pontas e barrar post de espaços vazios', () => {
    cy.get('#campo-postagem').type('      ')
    cy.get('#btn-publicar').click()
    cy.get('#mensagem-alerta').should('contain', 'Erro: O campo não pode ficar vazio!')
  })

  it('6. Deve processar corretamente um texto copiado e colado (Paste)', () => {
    cy.get('#campo-postagem').withArgs = 'Texto Colado via Área de Transferência' // Ajustando sintaxe Cypress padrão para invoke
    cy.get('#campo-postagem').invoke('val', 'Texto Colado via Área de Transferência').trigger('input')
    cy.get('#btn-publicar').click()
    cy.get('#mensagem-alerta').should('contain', 'Postado com sucesso!')
  })

  it('7. Deve iniciar o contador de caracteres exatamente em 0/100', () => {
    cy.get('#contador').should('have.text', '0/100')
  })

  it('8. Deve atualizar o contador de caracteres em tempo real ao digitar', () => {
    cy.get('#campo-postagem').type('Desenvolvedor Sady')
    cy.get('#contador').should('have.text', '18/100')
  })

  it('9. Deve atualizar o contador decrementando ao apagar caracteres', () => {
    cy.get('#campo-postagem').type('Aprender testes')
    cy.get('#campo-postagem').type('{backspace}{backspace}')
    cy.get('#contador').should('have.text', '13/100')
  })

  it('10. Deve zerar o formulário e o contador imediatamente após uma publicação com sucesso', () => {
    cy.get('#campo-postagem').type('Limpando tudo.')
    cy.get('#btn-publicar').click()
    cy.get('#campo-postagem').should('have.value', '')
    cy.get('#contador').should('have.text', '0/100')
  })

  it('11. Deve verificar se o alerta de erro possui a cor vermelha configurada', () => {
    cy.get('#btn-publicar').click()
    // Verifica a cor vermelha via variável CSS ou propriedade computada
    cy.get('#mensagem-alerta').should('have.css', 'color').and('match', /rgb\(228,\s*30,\s*63\)/)
  })

  it('12. Deve verificar se o alerta de sucesso possui a cor verde configurada', () => {
    cy.get('#campo-postagem').type('Post corporativo')
    cy.get('#btn-publicar').click()
    cy.get('#mensagem-alerta').should('have.css', 'color').and('match', /rgb\(66,\s*183,\s*42\)/)
  })

  it('13. Deve fazer sumir a mensagem de alerta da tela após 3 segundos', () => {
    cy.get('#campo-postagem').type('Mensagem temporária')
    cy.get('#btn-publicar').click()
    cy.get('#mensagem-alerta').should('not.be.empty')
    
    cy.wait(3100) // Aguarda o tempo do setTimeout do seu HTML
    cy.get('#mensagem-alerta').should('be.empty')
  })

  it('14. Deve inserir fisicamente o novo card criado dentro do container de feed', () => {
    const meuTexto = 'Verificando a estrutura do card gerado.'
    cy.get('#campo-postagem').type(meuTexto)
    cy.get('#btn-publicar').click()
    
    // Garante que existe o texto dentro do feed dinâmico
    cy.get('#feed-dinamico').contains(meuTexto).should('be.visible')
  })

  it('15. Deve garantir a ordenação correta: o post mais recente deve ir para o topo', () => {
    cy.get('#campo-postagem').type('Primeiro post enviado')
    cy.get('#btn-publicar').click()
    
    cy.get('#campo-postagem').type('Segundo post enviado')
    cy.get('#btn-publicar').click()

    // Pega o primeiro card da lista do feed e valida se é o segundo post criado
    cy.get('#feed-dinamico .post-card').first().within(() => {
      cy.get('.post-conteudo').should('have.text', 'Segundo post enviado')
      cy.get('.post-autor').should('have.text', 'Sady Developer')
    })
  })

  it('16. Deve gerar o carimbo de data/hora no formato padrão de horas (HH:MM)', () => {
    cy.get('#campo-postagem').type('Testando o relógio do feed')
    cy.get('#btn-publicar').click()

    cy.get('#feed-dinamico .post-card').first().within(() => {
      // Valida se o texto da data segue a expressão regular de horas (ex: "Hoje às 15:30")
      cy.get('.post-data').should('text').and('match', /Hoje às \d{2}:\d{2}/)
    })
  })

  it('17. Deve suportar a publicação de emojis mantendo a integridade visual', () => {
    cy.get('#campo-postagem').type('Automação total 🚀🔥 QA 2026')
    cy.get('#btn-publicar').click()
    cy.get('#feed-dinamico .post-card').first().within(() => {
      cy.get('.post-conteudo').should('have.text', 'Automação total 🚀🔥 QA 2026')
    })
  })

  it('18. Deve certificar-se de que elementos fixos da barra lateral carregaram corretamente', () => {
    cy.get('.logo-empresa').should('be.visible').and('contain', 'Portal Sady S/A')
    cy.get('.sidebar').find('.nav-link').should('have.length', 4)
  })

})
